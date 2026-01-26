import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { Submission } from '../types';
import { AuthRequest } from '../middleware/auth';
import { createSubmissionSchema, isDeadlinePassed, calculateScore, validateSubmissionAnswers } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * Create a new submission
 * POST /api/submissions
 * Student only
 */
export const createSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = createSubmissionSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { assignmentId, reviewedGroupId, answers } = value;
    const studentId = req.user!.id;

    // Get assignment
    const assignment = await db.getAssignmentById(assignmentId);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check if deadline has passed (Business Rule)
    if (isDeadlinePassed(assignment.deadline)) {
      throw new AppError('Assignment deadline has passed', 403);
    }

    // Check if student is enrolled in the course
    const course = await db.getCourseById(assignment.courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }
    if (!course.enrolledStudents.includes(studentId)) {
      throw new AppError('Student is not enrolled in this course', 403);
    }

    // Get reviewed group
    const reviewedGroup = await db.getGroupById(reviewedGroupId);
    if (!reviewedGroup) {
      throw new AppError('Reviewed group not found', 404);
    }

    // Check if reviewed group belongs to the same course
    if (reviewedGroup.courseId !== assignment.courseId) {
      throw new AppError('Reviewed group does not belong to this course', 400);
    }

    // Check if student is not reviewing their own group (Business Rule)
    const student = await db.getUserById(studentId);
    if (student?.groupId === reviewedGroupId) {
      throw new AppError('Cannot review your own group', 400);
    }

    // Validate answers against assignment fields
    const validation = validateSubmissionAnswers(answers, assignment.fields);
    if (!validation.valid) {
      throw new AppError(validation.error!, 400);
    }

    // Calculate score
    const calculatedScore = calculateScore(answers, assignment.fields);

    // Create submission
    const submission: Submission = {
      id: uuidv4(),
      assignmentId,
      studentId,
      reviewedGroupId,
      answers,
      calculatedScore,
      submittedAt: new Date(),
    };

    await db.createSubmission(submission);

    logger.info(`Submission created: ${submission.id} by student ${studentId}`);

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get submissions with filters
 * GET /api/submissions?assignmentId=xxx&studentId=yyy&reviewedGroupId=zzz
 */
export const getSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assignmentId, studentId, reviewedGroupId } = req.query;
    const user = req.user!;

    // Build filters
    const filters: any = {};
    if (assignmentId) filters.assignmentId = assignmentId as string;
    if (studentId) filters.studentId = studentId as string;
    if (reviewedGroupId) filters.reviewedGroupId = reviewedGroupId as string;

    // Get submissions
    let submissions = await db.getSubmissions(filters);

    // Apply access control
    if (user.role === 'student') {
      // Students can only see:
      // 1. Their own submissions
      // 2. Submissions reviewing their group
      const currentUser = await db.getUserById(user.id);
      submissions = submissions.filter(
        s => s.studentId === user.id || s.reviewedGroupId === currentUser?.groupId
      );
    } else {
      // Staff can see submissions for their courses
      const staffCourses = await db.getCoursesByStaff(user.id);
      const staffCourseIds = staffCourses.map(c => c.id);
      
      const allAssignments = await db.getAllAssignments();
      const staffAssignmentIds = allAssignments
        .filter(a => staffCourseIds.includes(a.courseId))
        .map(a => a.id);
      
      submissions = submissions.filter(s => staffAssignmentIds.includes(s.assignmentId));
    }

    res.json({
      success: true,
      data: submissions,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get submission by ID
 * GET /api/submissions/:id
 */
export const getSubmissionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const submission = await db.getSubmissionById(id);
    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    // Check access rights
    const user = req.user!;
    if (user.role === 'student') {
      const currentUser = await db.getUserById(user.id);
      const canAccess =
        submission.studentId === user.id ||
        submission.reviewedGroupId === currentUser?.groupId;
      
      if (!canAccess) {
        throw new AppError('Access denied to this submission', 403);
      }
    } else {
      // Staff can access if it's in their course
      const assignment = await db.getAssignmentById(submission.assignmentId);
      if (!assignment) {
        throw new AppError('Assignment not found', 404);
      }
      const course = await db.getCourseById(assignment.courseId);
      if (!course || course.createdBy !== user.id) {
        throw new AppError('Access denied to this submission', 403);
      }
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get submission statistics for an assignment
 * GET /api/submissions/stats/:assignmentId
 * Staff only
 */
export const getSubmissionStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { assignmentId } = req.params;

    // Check if assignment exists
    const assignment = await db.getAssignmentById(assignmentId);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check if user is the course creator
    const course = await db.getCourseById(assignment.courseId);
    if (!course || course.createdBy !== req.user!.id) {
      throw new AppError('Access denied', 403);
    }

    // Get all submissions for this assignment
    const submissions = await db.getSubmissions({ assignmentId });

    // Calculate statistics
    const totalSubmissions = submissions.length;
    const averageScore = totalSubmissions > 0
      ? submissions.reduce((sum, s) => sum + s.calculatedScore, 0) / totalSubmissions
      : 0;

    // Group by reviewed group
    const groupStats = new Map<string, { count: number; totalScore: number; average: number }>();
    
    for (const submission of submissions) {
      const existing = groupStats.get(submission.reviewedGroupId) || { count: 0, totalScore: 0, average: 0 };
      existing.count += 1;
      existing.totalScore += submission.calculatedScore;
      existing.average = existing.totalScore / existing.count;
      groupStats.set(submission.reviewedGroupId, existing);
    }

    // Convert to array
    const groupStatsArray = Array.from(groupStats.entries()).map(([groupId, stats]) => ({
      groupId,
      ...stats,
    }));

    res.json({
      success: true,
      data: {
        totalSubmissions,
        averageScore: Math.round(averageScore * 100) / 100,
        groupStats: groupStatsArray,
      },
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete submission
 * DELETE /api/submissions/:id
 * Staff only (course creator) or student (own submission, before deadline)
 */
export const deleteSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = req.user!;

    // Check if submission exists
    const submission = await db.getSubmissionById(id);
    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    // Get assignment to check deadline
    const assignment = await db.getAssignmentById(submission.assignmentId);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check permissions
    if (user.role === 'student') {
      // Student can delete only their own submission and only before deadline
      if (submission.studentId !== user.id) {
        throw new AppError('Can only delete your own submissions', 403);
      }
      if (isDeadlinePassed(assignment.deadline)) {
        throw new AppError('Cannot delete submission after deadline', 403);
      }
    } else {
      // Staff can delete if they created the course
      const course = await db.getCourseById(assignment.courseId);
      if (!course || course.createdBy !== user.id) {
        throw new AppError('Access denied', 403);
      }
    }

    // Delete submission
    await db.deleteSubmission(id);

    logger.info(`Submission deleted: ${id}`);

    res.status(204).send();
  } catch (error) {
    throw error;
  }
};

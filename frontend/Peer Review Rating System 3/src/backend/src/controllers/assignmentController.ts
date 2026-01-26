import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { Assignment, Field } from '../types';
import { AuthRequest } from '../middleware/auth';
import { createAssignmentSchema, updateAssignmentSchema, validateAssignmentFields } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * Create a new assignment
 * POST /api/assignments
 * Staff only
 */
export const createAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = createAssignmentSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { title, description, courseId, deadline, fields } = value;
    const staffId = req.user!.id;

    // Check if course exists
    const course = await db.getCourseById(courseId);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is the course creator
    if (course.createdBy !== staffId) {
      throw new AppError('Only the course creator can add assignments', 403);
    }

    // Add IDs to fields if not provided
    const fieldsWithIds: Field[] = fields.map((field: Field) => ({
      ...field,
      id: field.id || uuidv4(),
    }));

    // Validate fields according to business rules
    const validation = validateAssignmentFields(fieldsWithIds);
    if (!validation.valid) {
      throw new AppError(validation.error!, 400);
    }

    // Create assignment
    const assignmentId = uuidv4();
    const shareableLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}?assignment=${assignmentId}`;

    const assignment: Assignment = {
      id: assignmentId,
      title,
      description,
      courseId,
      deadline: new Date(deadline),
      fields: fieldsWithIds,
      shareableLink,
      createdBy: staffId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.createAssignment(assignment);

    logger.info(`Assignment created: ${title} in course ${courseId}`);

    res.status(201).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get all assignments (filtered by courseId if provided)
 * GET /api/assignments?courseId=xxx
 */
export const getAssignments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.query;
    const user = req.user!;

    let assignments: Assignment[];

    if (courseId) {
      assignments = await db.getAssignmentsByCourse(courseId as string);
    } else if (user.role === 'staff') {
      assignments = await db.getAssignmentsByStaff(user.id);
    } else {
      // Students see assignments from their enrolled courses
      const allCourses = await db.getAllCourses();
      const userCourseIds = allCourses
        .filter(c => c.enrolledStudents.includes(user.id))
        .map(c => c.id);
      
      const allAssignments = await db.getAllAssignments();
      assignments = allAssignments.filter(a => userCourseIds.includes(a.courseId));
    }

    res.json({
      success: true,
      data: assignments,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get assignment by ID
 * GET /api/assignments/:id
 */
export const getAssignmentById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const assignment = await db.getAssignmentById(id);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check access rights for students
    if (req.user!.role === 'student') {
      const course = await db.getCourseById(assignment.courseId);
      if (!course || !course.enrolledStudents.includes(req.user!.id)) {
        throw new AppError('Access denied to this assignment', 403);
      }
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update assignment
 * PUT /api/assignments/:id
 * Staff only (creator)
 */
export const updateAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateAssignmentSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Check if assignment exists
    const assignment = await db.getAssignmentById(id);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check if user is the creator
    if (assignment.createdBy !== req.user!.id) {
      throw new AppError('Only the assignment creator can update it', 403);
    }

    // Validate fields if provided
    if (value.fields) {
      // Add IDs to new fields if not provided
      const fieldsWithIds: Field[] = value.fields.map((field: Field) => ({
        ...field,
        id: field.id || uuidv4(),
      }));

      const validation = validateAssignmentFields(fieldsWithIds);
      if (!validation.valid) {
        throw new AppError(validation.error!, 400);
      }

      value.fields = fieldsWithIds;
    }

    // Update assignment
    const updatedAssignment = await db.updateAssignment(id, value);

    logger.info(`Assignment updated: ${id}`);

    res.json({
      success: true,
      data: updatedAssignment,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete assignment
 * DELETE /api/assignments/:id
 * Staff only (creator)
 */
export const deleteAssignment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if assignment exists
    const assignment = await db.getAssignmentById(id);
    if (!assignment) {
      throw new AppError('Assignment not found', 404);
    }

    // Check if user is the creator
    if (assignment.createdBy !== req.user!.id) {
      throw new AppError('Only the assignment creator can delete it', 403);
    }

    // Delete assignment (cascades to submissions)
    await db.deleteAssignment(id);

    logger.info(`Assignment deleted: ${id}`);

    res.status(204).send();
  } catch (error) {
    throw error;
  }
};

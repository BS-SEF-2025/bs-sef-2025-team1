import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database';
import { Course } from '../types';
import { AuthRequest } from '../middleware/auth';
import { createCourseSchema, updateCourseSchema } from '../utils/validators';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * Create a new course
 * POST /api/courses
 * Staff only
 */
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Validate request body
    const { error, value } = createCourseSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    const { name, enrolledStudents } = value;
    const staffId = req.user!.id;

    // Validate that all enrolled students exist
    for (const studentId of enrolledStudents) {
      const student = await db.getUserById(studentId);
      if (!student) {
        throw new AppError(`Student with ID ${studentId} not found`, 404);
      }
      if (student.role !== 'student') {
        throw new AppError(`User ${studentId} is not a student`, 400);
      }
    }

    // Create course
    const course: Course = {
      id: uuidv4(),
      name,
      enrolledStudents,
      createdBy: staffId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.createCourse(course);

    logger.info(`Course created: ${name} by ${staffId}`);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get all courses (filtered by role)
 * GET /api/courses
 */
export const getCourses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    let courses: Course[];

    if (user.role === 'staff') {
      // Staff sees all their courses
      courses = await db.getCoursesByStaff(user.id);
    } else {
      // Students see courses they're enrolled in
      const allCourses = await db.getAllCourses();
      courses = allCourses.filter(c => c.enrolledStudents.includes(user.id));
    }

    res.json({
      success: true,
      data: courses,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Get course by ID
 * GET /api/courses/:id
 */
export const getCourseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const course = await db.getCourseById(id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check access rights
    const user = req.user!;
    if (user.role === 'student' && !course.enrolledStudents.includes(user.id)) {
      throw new AppError('Access denied to this course', 403);
    }

    res.json({
      success: true,
      data: course,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Update course
 * PUT /api/courses/:id
 * Staff only (creator)
 */
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate request body
    const { error, value } = updateCourseSchema.validate(req.body);
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // Check if course exists
    const course = await db.getCourseById(id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is the creator
    if (course.createdBy !== req.user!.id) {
      throw new AppError('Only the course creator can update it', 403);
    }

    // Validate enrolled students if provided
    if (value.enrolledStudents) {
      for (const studentId of value.enrolledStudents) {
        const student = await db.getUserById(studentId);
        if (!student) {
          throw new AppError(`Student with ID ${studentId} not found`, 404);
        }
        if (student.role !== 'student') {
          throw new AppError(`User ${studentId} is not a student`, 400);
        }
      }
    }

    // Update course
    const updatedCourse = await db.updateCourse(id, value);

    logger.info(`Course updated: ${id}`);

    res.json({
      success: true,
      data: updatedCourse,
    });
  } catch (error) {
    throw error;
  }
};

/**
 * Delete course
 * DELETE /api/courses/:id
 * Staff only (creator)
 */
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if course exists
    const course = await db.getCourseById(id);
    if (!course) {
      throw new AppError('Course not found', 404);
    }

    // Check if user is the creator
    if (course.createdBy !== req.user!.id) {
      throw new AppError('Only the course creator can delete it', 403);
    }

    // Delete course (cascades to groups, assignments, submissions)
    await db.deleteCourse(id);

    logger.info(`Course deleted: ${id}`);

    res.status(204).send();
  } catch (error) {
    throw error;
  }
};

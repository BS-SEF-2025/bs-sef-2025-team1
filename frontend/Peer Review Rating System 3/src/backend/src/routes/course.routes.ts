import { Router } from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (Staff only)
 */
router.post('/', authenticate, authorize('staff'), asyncHandler(createCourse));

/**
 * @route   GET /api/courses
 * @desc    Get all courses (filtered by role)
 * @access  Private
 */
router.get('/', authenticate, asyncHandler(getCourses));

/**
 * @route   GET /api/courses/:id
 * @desc    Get course by ID
 * @access  Private
 */
router.get('/:id', authenticate, asyncHandler(getCourseById));

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course
 * @access  Private (Staff only - creator)
 */
router.put('/:id', authenticate, authorize('staff'), asyncHandler(updateCourse));

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete course
 * @access  Private (Staff only - creator)
 */
router.delete('/:id', authenticate, authorize('staff'), asyncHandler(deleteCourse));

export default router;

import { Router } from 'express';
import {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from '../controllers/assignmentController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/assignments
 * @desc    Create a new assignment
 * @access  Private (Staff only)
 */
router.post('/', authenticate, authorize('staff'), asyncHandler(createAssignment));

/**
 * @route   GET /api/assignments
 * @desc    Get all assignments (optionally filtered by courseId)
 * @access  Private
 */
router.get('/', authenticate, asyncHandler(getAssignments));

/**
 * @route   GET /api/assignments/:id
 * @desc    Get assignment by ID
 * @access  Private (or Public via shareable link - see below)
 */
router.get('/:id', authenticate, asyncHandler(getAssignmentById));

/**
 * @route   PUT /api/assignments/:id
 * @desc    Update assignment
 * @access  Private (Staff only - creator)
 */
router.put('/:id', authenticate, authorize('staff'), asyncHandler(updateAssignment));

/**
 * @route   DELETE /api/assignments/:id
 * @desc    Delete assignment
 * @access  Private (Staff only - creator)
 */
router.delete('/:id', authenticate, authorize('staff'), asyncHandler(deleteAssignment));

export default router;

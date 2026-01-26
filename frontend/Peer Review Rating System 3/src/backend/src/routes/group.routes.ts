import { Router } from 'express';
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
} from '../controllers/groupController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/groups
 * @desc    Create a new group
 * @access  Private (Staff only)
 */
router.post('/', authenticate, authorize('staff'), asyncHandler(createGroup));

/**
 * @route   GET /api/groups
 * @desc    Get all groups (optionally filtered by courseId)
 * @access  Private
 */
router.get('/', authenticate, asyncHandler(getGroups));

/**
 * @route   GET /api/groups/:id
 * @desc    Get group by ID
 * @access  Private
 */
router.get('/:id', authenticate, asyncHandler(getGroupById));

/**
 * @route   PUT /api/groups/:id
 * @desc    Update group
 * @access  Private (Staff only)
 */
router.put('/:id', authenticate, authorize('staff'), asyncHandler(updateGroup));

/**
 * @route   DELETE /api/groups/:id
 * @desc    Delete group
 * @access  Private (Staff only)
 */
router.delete('/:id', authenticate, authorize('staff'), asyncHandler(deleteGroup));

export default router;

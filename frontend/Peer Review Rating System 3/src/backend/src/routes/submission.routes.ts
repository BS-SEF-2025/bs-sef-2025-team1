import { Router } from 'express';
import {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  getSubmissionStats,
  deleteSubmission,
} from '../controllers/submissionController';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

/**
 * @route   POST /api/submissions
 * @desc    Create a new submission
 * @access  Private (Student only)
 */
router.post('/', authenticate, authorize('student'), asyncHandler(createSubmission));

/**
 * @route   GET /api/submissions
 * @desc    Get submissions with filters (assignmentId, studentId, reviewedGroupId)
 * @access  Private
 */
router.get('/', authenticate, asyncHandler(getSubmissions));

/**
 * @route   GET /api/submissions/stats/:assignmentId
 * @desc    Get submission statistics for an assignment
 * @access  Private (Staff only)
 */
router.get('/stats/:assignmentId', authenticate, authorize('staff'), asyncHandler(getSubmissionStats));

/**
 * @route   GET /api/submissions/:id
 * @desc    Get submission by ID
 * @access  Private
 */
router.get('/:id', authenticate, asyncHandler(getSubmissionById));

/**
 * @route   DELETE /api/submissions/:id
 * @desc    Delete submission
 * @access  Private (Staff or student owner before deadline)
 */
router.delete('/:id', authenticate, asyncHandler(deleteSubmission));

export default router;

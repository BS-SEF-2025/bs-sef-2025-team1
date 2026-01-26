import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import groupRoutes from './group.routes';
import assignmentRoutes from './assignment.routes';
import submissionRoutes from './submission.routes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/groups', groupRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/submissions', submissionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AmiTeam API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;

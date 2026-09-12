import express from 'express';
import { getJobs, getRecommendedJobs, getJobById, applyToJob } from '../controllers/jobController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/recommended', authenticateToken, getRecommendedJobs);
router.get('/:id', getJobById);
router.post('/:id/apply', authenticateToken, applyToJob);

export default router;

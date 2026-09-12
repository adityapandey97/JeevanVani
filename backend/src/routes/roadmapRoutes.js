import express from 'express';
import { getCareerRoadmap, getSkillGaps } from '../controllers/roadmapController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/roadmap', authenticateToken, getCareerRoadmap);
router.get('/gaps', authenticateToken, getSkillGaps);

export default router;

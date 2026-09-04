import express from 'express';
import { generateRecommendations, getRecommendations, getRecommendationById } from '../controllers/recommendationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.post('/generate', generateRecommendations);
router.get('/', getRecommendations);
router.get('/:id', getRecommendationById);

export default router;

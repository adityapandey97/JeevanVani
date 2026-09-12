import express from 'express';
import { submitFeedback, getHumanReviewQueue, updateHumanReview, getRecommendationExplanation } from '../controllers/feedbackController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, submitFeedback);
router.get('/human-review', authenticateToken, requireAdmin, getHumanReviewQueue);
router.put('/human-review/:id', authenticateToken, requireAdmin, updateHumanReview);
router.get('/explain/:id', authenticateToken, getRecommendationExplanation);

export default router;

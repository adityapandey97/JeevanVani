import express from 'express';
import { getCourses, getRecommendedCourses, getCourseById, enrollCourse } from '../controllers/courseController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getCourses);
router.get('/recommended', authenticateToken, getRecommendedCourses);
router.get('/:id', getCourseById);
router.post('/:id/enroll', authenticateToken, enrollCourse);

export default router;

import express from 'express';
import { getUserApplications, submitApplication, getBeneficiaryProgress } from '../controllers/applicationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getUserApplications);
router.post('/', submitApplication);
router.get('/progress', getBeneficiaryProgress);

export default router;

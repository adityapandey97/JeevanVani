import express from 'express';
import { getProfile, updateProfile, getProfileSkills } from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/skills', getProfileSkills);

export default router;

import express from 'express';
import { getProfile, updateProfile, getProfileSkills, deleteProfile, extractProfile } from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile AI extraction (can be invoked during onboarding or profile editing)
router.post('/extract', extractProfile);

// Authenticated profile operations
router.use(authenticate);

router.get('/', getProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);
router.get('/skills', getProfileSkills);

export default router;

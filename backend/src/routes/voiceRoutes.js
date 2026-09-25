import express from 'express';
import { transcribeVoiceAudio, submitAnswer } from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { audioUpload } from '../services/voiceService.js';
import { voiceLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(authenticate);

router.post('/transcribe', audioUpload.single('audio'), voiceLimiter, transcribeVoiceAudio);
router.post('/onboarding', audioUpload.single('audio'), voiceLimiter, submitAnswer);

export default router;

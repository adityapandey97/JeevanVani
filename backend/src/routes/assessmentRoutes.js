import express from 'express';
import { startAssessment, submitAnswer, getAssessmentStatus, completeAssessment, transcribeVoiceAudio } from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { audioUpload } from '../services/voiceService.js';

const router = express.Router();

router.use(authenticate);

router.post('/start', startAssessment);
router.post('/answer', audioUpload.single('audio'), submitAnswer);
router.post('/transcribe', audioUpload.single('audio'), transcribeVoiceAudio);
router.get('/status', getAssessmentStatus);
router.post('/complete', completeAssessment);

export default router;

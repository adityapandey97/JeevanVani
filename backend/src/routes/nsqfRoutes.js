import express from 'express';
import { getQualifications, getQualificationById } from '../controllers/nsqfController.js';

const router = express.Router();

router.get('/qualifications', getQualifications);
router.get('/qualifications/:id', getQualificationById);
router.get('/:id', getQualificationById);
router.get('/', getQualifications);

export default router;

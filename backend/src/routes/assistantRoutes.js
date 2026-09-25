import express from 'express';
import { handleAssistantMessage } from '../controllers/assistantController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Assistant can be accessed with auth or optionally as visitor
router.post('/message', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
}, handleAssistantMessage);

export default router;

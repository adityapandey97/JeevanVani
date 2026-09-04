import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getAdminJobRoles,
  createJobRole,
  updateJobRole,
  deleteJobRole
} from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.get('/job-roles', getAdminJobRoles);
router.post('/job-roles', createJobRole);
router.put('/job-roles/:id', updateJobRole);
router.delete('/job-roles/:id', deleteJobRole);

export default router;

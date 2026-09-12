import express from 'express';
import {
  getDashboardStats,
  getUsers,
  getAdminJobRoles,
  createJobRole,
  updateJobRole,
  deleteJobRole,
  getAdminSkills,
  getAdminJobs,
  getAdminCourses,
  getAdminKnowledge,
  getAdminHumanReviews,
  updateAdminHumanReview,
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

// Extended Admin Monitoring & Governance
router.get('/skills', getAdminSkills);
router.get('/jobs', getAdminJobs);
router.get('/courses', getAdminCourses);
router.get('/knowledge', getAdminKnowledge);
router.get('/human-reviews', getAdminHumanReviews);
router.put('/human-reviews/:id', updateAdminHumanReview);

export default router;


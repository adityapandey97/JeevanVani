import express from 'express';
import { getAllJobRoles, getJobRoleById } from '../controllers/jobRoleController.js';

const router = express.Router();

router.get('/', getAllJobRoles);
router.get('/:id', getJobRoleById);

export default router;

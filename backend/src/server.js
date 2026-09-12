import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import jobRoleRoutes from './routes/jobRoleRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import seedDatabase from './utils/seedRunner.js';
import db from './config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-language']
}));

// Body parsing middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check endpoint
app.get(['/api/health', '/api/v1/health'], (req, res) => {
  res.json({
    status: 'healthy',
    project: 'JeevanVani - PM-AJAY GIA AI Livelihood & Skilling Platform',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    driver: db.getDriver()
  });
});

// Legacy API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/training', roadmapRoutes);
app.use('/api/skills', roadmapRoutes);
app.use('/api/feedback', feedbackRoutes);

// Versioned /api/v1 Routes (Standard SIH Specification)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/assessment', assessmentRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/recommendations', recommendationRoutes);
app.use('/api/v1/job-roles', jobRoleRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/training', roadmapRoutes);
app.use('/api/v1/skills', roadmapRoutes);
app.use('/api/v1/feedback', feedbackRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Auto-seed and start server
async function startServer() {
  try {
    // Check if initial roles exist, else seed
    const checkRoles = await db.query('SELECT COUNT(*) as count FROM job_roles');
    if (Number(checkRoles.rows[0]?.count || 0) === 0) {
      console.log('[Server] Database is empty. Running initial seed...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 JeevanVani Backend Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`💾 Database Driver: ${db.getDriver()}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('[Server Error] Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;

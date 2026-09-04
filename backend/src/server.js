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
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    project: 'JeevanVani - PM-AJAY GIA AI Livelihood & Skilling Platform',
    timestamp: new Date().toISOString(),
    driver: db.getDriver()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/admin', adminRoutes);

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

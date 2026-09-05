import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import jobRoutes from './routes/jobRoutes';
import userRoutes from './routes/userRoutes';
import applicationRoutes from './routes/applicationRoutes';
import uploadRoutes from './routes/uploadRoutes';
import sharedJobRoutes from './routes/sharedJobRoutes';
import candidateDashboardRoutes from './routes/candidateDashboardRoutes';
import connectDB from './config/db';

dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Connect to MongoDB
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: true, // Dynamically allow request origin (production Vercel, preview URLs, localhost)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
// Handle preflight across all routes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, X-Requested-With, Accept');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

// Disable helmet's crossOriginResourcePolicy for now to allow local images/pdfs to load
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

import webhookRoutes from './routes/webhookRoutes';

// Health Check Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/shared-jobs', sharedJobRoutes);
app.use('/api/candidate', candidateDashboardRoutes);
app.use('/api/webhooks', webhookRoutes);

// Basic Route
app.get('/', (req: Request, res: Response) => {
  res.send('FAST CAREERS API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // connectDB();
});

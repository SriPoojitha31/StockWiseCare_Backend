import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fileUpload from 'express-fileupload';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import mongoose from 'mongoose';

import connectDB from './database/db.js';
import { startScheduledJobs } from './jobs/cronJobs.js';
import { errorMiddleware } from './middlewares/errorMiddlewares.js';
import aiRouter from './routes/aiRouter.js';
import authRouter from './routes/authRouter.js';
import charityRouter from './routes/charityRouter.js';
import portfolioRouter from './routes/portfolioRouter.js';
import transactionRouter from './routes/transactionRouter.js';
import { getNotifications, markAsSeen } from './controllers/notificationController.js';
import { downloadPDF } from './controllers/pdfController.js';

// New features
import expenseRouter from './routes/expenseRouter.js';
import badgeRouter from './routes/badgeRouter.js';
import extensionRouter from './routes/extensionRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, 'config', '.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://stock-wise-care-frontend.vercel.app',
    ],
    credentials: true,
  },
});

connectDB();

// CORS Config
const allowedOrigins = [
  'http://localhost:3000',
  'https://stock-wise-care-frontend.vercel.app'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

// Rate Limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/portfolio', portfolioRouter);
app.use('/api/v1/charity', charityRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/transactions', transactionRouter);
app.post('/api/v1/generate-pdf', downloadPDF);
app.get('/api/v1/notifications', getNotifications);
app.post('/api/v1/notifications/mark-as-seen', markAsSeen);

// New Feature Routes
app.use('/api/v1/expenses', expenseRouter);
app.use('/api/v1/badges', badgeRouter);
app.use('/api/v1/extension/news', extensionRouter);

// Health Check
app.get('/api/v1/ping', (req, res) => {
  res.json({ message: 'Backend API is reachable ✅' });
});

// Socket Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('sendMessage', (msg) => {
    io.emit('message', {
      id: Date.now(),
      text: "Message received. Chat handler is currently unavailable.",
      sender: 'system',
      timestamp: new Date().toISOString()
    });
  });

  socket.on('sendNotification', (notificationData) => {
    io.emit('notification', notificationData);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Cron Jobs
startScheduledJobs();

// Base Route
app.get('/', (req, res) => {
  res.send('Server Running...');
});

// Error Middleware
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} in use. Trying port ${PORT + 1}...`);
    server.listen(PORT + 1, () => {
      console.log(`Server running on port ${PORT + 1}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

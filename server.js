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

// NEW: Import new feature routers (you'll define them separately)
import expenseRouter from './routes/expenseRouter.js';
import badgeRouter from './routes/badgeRouter.js';
import extensionRouter from './routes/extensionRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// App & Server Setup
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
});

// DB Connection
connectDB();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ useTempFiles: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/portfolio', portfolioRouter);
app.use('/api/v1/charity', charityRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/transactions', transactionRouter);
app.post('/api/v1/generate-pdf', downloadPDF);
app.get('/api/v1/notifications', getNotifications);
app.post('/api/v1/notifications/mark-as-seen', markAsSeen);

// 💡 NEW FEATURE ROUTES
app.use('/api/v1/expenses', expenseRouter);         // 💰 Expense Tracker
app.use('/api/v1/badges', badgeRouter);             // 🏅 Green Investment Badge
app.use('/api/v1/extension/news', extensionRouter); // 📰 AI News for Browser Extension

// Real-time Communication
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('sendMessage', async (msg) => {
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

// Server Listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
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

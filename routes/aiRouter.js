import express from 'express';
import { getAIRecommendations, getSentimentAnalysis } from '../controllers/aiController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// AI routes
router.get('/sentiment', isAuthenticated, getSentimentAnalysis);
router.get('/recommendations', isAuthenticated, getAIRecommendations);

export default router; 
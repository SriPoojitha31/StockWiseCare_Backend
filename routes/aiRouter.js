import express from 'express';
import { getAIRecommendations, getSentimentAnalysis } from '../controllers/aiController.js';
import { analyzeNews } from '../controllers/ai-insights/newsController.js';
import { optimizePortfolio } from '../controllers/ai-insights/portfolioController.js';
import { analyzeSentiment } from '../controllers/ai-insights/sentimentController.js';
import { analyzeSentiment } from '../controllers/ai-insights/sentimentController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// AI routes
router.get('/sentiment', isAuthenticated, getSentimentAnalysis);
router.get('/recommendations', isAuthenticated, getAIRecommendations);
router.post('/sentiment', analyzeSentiment)
router.post('/predict', predictStocks)
router.post('/optimize', optimizePortfolio)
router.post('/news', analyzeNews)

export default router; 
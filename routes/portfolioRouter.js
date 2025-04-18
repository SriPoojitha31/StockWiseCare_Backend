import express from 'express';
import { getPortfolioAnalytics, getPortfolioDetails, updatePortfolio } from '../controllers/portfolioController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Portfolio routes
router.get('/analytics', isAuthenticated, getPortfolioAnalytics);
router.get('/details', isAuthenticated, getPortfolioDetails);
router.put('/update', isAuthenticated, updatePortfolio);

export default router; 
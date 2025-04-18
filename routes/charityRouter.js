import express from 'express';
import { getCharityAnalytics, getCharityDetails, updateCharityAllocation } from '../controllers/charityController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Charity routes
router.get('/analytics', isAuthenticated, getCharityAnalytics);
router.get('/details', isAuthenticated, getCharityDetails);
router.put('/allocation', isAuthenticated, updateCharityAllocation);

export default router; 
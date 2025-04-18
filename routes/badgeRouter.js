import express from 'express';
import { getUserBadges, assignBadge } from '../controllers/badgeController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all badges of a user
router.get('/', isAuthenticated, getUserBadges);

// Assign badge after action (e.g., donation, green investment)
router.post('/assign', isAuthenticated, assignBadge);

export default router;

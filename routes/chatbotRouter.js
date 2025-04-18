import express from 'express';
import { chatWithBot } from '../controllers/chatController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Chat with the bot - requires authentication
router.post('/chat', isAuthenticated, chatWithBot);

export default router; 
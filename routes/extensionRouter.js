import express from 'express';
import { getExtensionInsights } from '../controllers/extensionController.js';

const router = express.Router();

// Get insights from AI to show in browser extension popup
router.get('/ai/news', getExtensionInsights);

export default router;

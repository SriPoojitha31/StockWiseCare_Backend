// routes/settingsRouter.js
import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateUser, getSettings);
router.put('/', authenticateUser, updateSettings);

export default router;

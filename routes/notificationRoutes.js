import express from 'express';
import { getNotifications, markAsSeen } from '../controllers/notificationController.js';

const router = express.Router();
router.get('/:id', getNotifications);
router.post('/seen/:id', markAsSeen);
export default router;

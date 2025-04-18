import express from 'express';
import { uploadImage } from '../controllers/fileController.js';

const router = express.Router();
router.post('/upload', uploadImage);
export default router;

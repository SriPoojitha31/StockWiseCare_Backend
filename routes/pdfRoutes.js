import express from 'express';
import { downloadPDF } from '../controllers/pdfController.js';

const router = express.Router();
router.get('/report', downloadPDF);
export default router;

import express from 'express';
import { addExpense, getExpenses, deleteExpense } from '../controllers/expenseController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Add new expense
router.post('/add', isAuthenticated, addExpense);

// Get all expenses for a user
router.get('/', isAuthenticated, getExpenses);

// Delete expense by ID
router.delete('/:id', isAuthenticated, deleteExpense);

export default router;

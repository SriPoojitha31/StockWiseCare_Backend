import express from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
} from '../controllers/transactionController.js';

const router = express.Router();

// POST: Create new transaction
router.post('/', createTransaction);

// GET: All transactions for a specific user
router.get('/user/:userId', getTransactions);

// GET: Single transaction by ID
router.get('/:id', getTransactionById);

// PUT: Update transaction
router.put('/:id', updateTransaction);

// DELETE: Delete transaction
router.delete('/:id', deleteTransaction);

export default router;

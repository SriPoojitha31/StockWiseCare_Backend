import Expense from '../models/expenseModel.js';  // Import Expense model
import ErrorHandler from '../utils/errorHandler.js';  // Import your error handler utility

// Custom error classes for bad request and not found
class BadRequestError extends ErrorHandler {
  constructor(message) {
    super(message, 400);
  }
}

class NotFoundError extends ErrorHandler {
  constructor(message) {
    super(message, 404);
  }
}

// Add a new expense
export const addExpense = async (req, res, next) => {
  try {
    const { amount, description, category, date } = req.body;

    if (!amount || !description || !category || !date) {
      throw new BadRequestError('All fields are required.');
    }

    const expense = new Expense({
      userId: req.user.id,  // Assuming user ID from authentication middleware
      amount,
      description,
      category,
      date,
    });

    await expense.save();
    return res.status(201).json({ message: 'Expense added successfully.', expense });
  } catch (error) {
    next(error);  // Pass the error to the error handling middleware
  }
};

// Get all expenses for the authenticated user
export const getExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });

    if (expenses.length === 0) {
      throw new NotFoundError('No expenses found.');
    }

    return res.status(200).json(expenses);
  } catch (error) {
    next(error);  // Pass the error to the error handling middleware
  }
};

// Delete an expense by ID
export const deleteExpense = async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense || expense.userId.toString() !== req.user.id) {
      throw new NotFoundError('Expense not found or unauthorized.');
    }

    await expense.remove();
    return res.status(200).json({ message: 'Expense deleted successfully.' });
  } catch (error) {
    next(error);  // Pass the error to the error handling middleware
  }
};

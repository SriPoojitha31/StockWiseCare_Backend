import mongoose from 'mongoose';  // Use ES Module import syntax

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Assuming there's a User model
    required: true
  },
  category: {
    type: String,
    enum: ['Food', 'Transport', 'Utilities', 'Investments', 'Healthcare', 'Entertainment', 'Other'],
    default: 'Other'
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String
  }
});

// Correctly closing the model export
export default mongoose.model('Expense', expenseSchema);

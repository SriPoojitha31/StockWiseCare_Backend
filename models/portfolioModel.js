import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stocks: [{
    symbol: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    averagePrice: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    }
  }],
  totalValue: {
    type: Number,
    required: true,
    default: 0
  },
  returns: {
    type: Number,
    required: true,
    default: 0
  },
  history: [{
    date: {
      type: Date,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Portfolio', portfolioSchema); 
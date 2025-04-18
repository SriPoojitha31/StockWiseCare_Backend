import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // Portfolio or Investment Transactions
  type: {
    type: String,
    enum: ['BUY', 'SELL', 'DONATION', 'COURSE_ENROLLMENT', 'TAX_REPORT'],
    required: true,
  },

  asset: {
    name: String,             // e.g. "Apple Inc.", "Mutual Fund A"
    symbol: String,           // e.g. "AAPL"
    category: String,         // e.g. "Stock", "Bond", "Mutual Fund", "Crypto"
    riskLevel: String,        // Low, Medium, High
  },

  quantity: {
    type: Number,
    default: 0,
  },

  pricePerUnit: {
    type: Number,
    default: 0,
  },

  totalValue: {
    type: Number,
    required: true,
  },

  roi: {
    type: Number, // Return on Investment (in %)
    default: 0,
  },

  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'CANCELLED'],
    default: 'COMPLETED',
  },

  tradeDetails: {
    buyDate: Date,
    sellDate: Date,
    profitLoss: Number,
  },

  // AI Insights Data
  aiInsights: {
    recommendationType: {
      type: String, // e.g., 'BUY', 'SELL', 'HOLD', 'REBALANCE'
    },
    confidenceScore: {
      type: Number, // 0 to 1
    },
    predictedChange: {
      type: Number, // percentage
    },
    sentiment: {
      type: String, // e.g., 'Positive', 'Neutral', 'Negative'
    },
  },

  // Course Tracking
  course: {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    progress: {
      type: String,
      enum: ['Not Started', 'In Progress', 'Completed'],
      default: 'Not Started',
    },
    enrolledAt: Date,
  },

  // Donations
  donation: {
    charityName: String,
    logoURL: String,
    amount: Number,
    badgeEarned: String,  // e.g., 'Top Donor', 'First Donation'
    impactMessage: String, // e.g., "You helped plant 100 trees!"
  },

  // Tax Calculation
  taxData: {
    capitalGains: Number,
    estimatedTax: Number,
    optimizationTips: [String],
    year: Number,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});

export default mongoose.model('Transaction', transactionSchema);

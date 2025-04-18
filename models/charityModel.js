import mongoose from 'mongoose';

const charitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medical: {
    type: Number,
    required: true,
    default: 0
  },
  education: {
    type: Number,
    required: true,
    default: 0
  },
  environment: {
    type: Number,
    required: true,
    default: 0
  },
  other: {
    type: Number,
    required: true,
    default: 0
  },
  totalDonated: {
    type: Number,
    required: true,
    default: 0
  },
  impact: {
    livesImpacted: {
      type: Number,
      default: 0
    },
    projectsSupported: {
      type: Number,
      default: 0
    }
  },
  donationHistory: [{
    amount: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: ['medical', 'education', 'environment', 'other']
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Charity', charitySchema); 
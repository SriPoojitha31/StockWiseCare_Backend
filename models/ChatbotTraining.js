const mongoose = require('mongoose');

const ChatbotTrainingSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['general', 'company', 'projects', 'faq']
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  keywords: [{
    type: String,
    trim: true
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
ChatbotTrainingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ChatbotTraining', ChatbotTrainingSchema); 
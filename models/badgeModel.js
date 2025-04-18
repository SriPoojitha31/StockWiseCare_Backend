import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  badgeName: {
    type: String,
    required: true
  },
  criteria: {
    type: String,
    required: true
  },
  awardedAt: {
    type: Date,
    default: Date.now
  }
});

const Badge = mongoose.model('Badge', badgeSchema);
export default Badge;

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: String,
  message: String,
  seen: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);

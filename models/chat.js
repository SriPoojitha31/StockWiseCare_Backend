// models/Chat.js
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    default: null,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Chat', chatSchema);

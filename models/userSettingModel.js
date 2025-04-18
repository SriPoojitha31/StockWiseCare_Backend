// models/userSettingsModel.js
import mongoose from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
  language: {
    type: String,
    default: 'en',
  }
}, { timestamps: true });

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
export default UserSettings;

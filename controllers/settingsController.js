// controllers/settingsController.js
import UserSettings from '../models/userSettingsModel.js';
import ErrorHandler from '../utils/errorHandler.js';

class NotFoundError extends ErrorHandler {
  constructor(message) {
    super(message, 404);
  }
}
class BadRequestError extends ErrorHandler {
  constructor(message) {
    super(message, 400);
  }
}

// Get current user's settings
export const getSettings = async (req, res, next) => {
  try {
    const settings = await UserSettings.findOne({ user: req.user.id });

    if (!settings) {
      throw new NotFoundError('User settings not found.');
    }

    res.status(200).json(settings);
  } catch (err) {
    next(err);
  }
};

// Update settings
export const updateSettings = async (req, res, next) => {
  try {
    const { darkMode, notificationsEnabled, language } = req.body;

    const settings = await UserSettings.findOneAndUpdate(
      { user: req.user.id },
      { darkMode, notificationsEnabled, language },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Settings updated successfully.', settings });
  } catch (err) {
    next(err);
  }
};

import Badge from '../models/badgeModel.js';  // Assuming Badge model is defined
import User from '../models/userModel.js';  // Assuming User model is defined
import ErrorHandler from '../utils/errorHandler.js';

// Get all badges for a user
export const getUserBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find({ user: req.user.id });

    if (!badges) {
      throw new NotFoundError('No badges found for this user.');
    }

    return res.status(200).json(badges);
  } catch (error) {
    next(error);
  }
};

// Assign a badge to the user (e.g., for green investments or charity donations)
export const assignBadge = async (req, res, next) => {
  try {
    const { badgeName, criteria } = req.body;

    if (!badgeName || !criteria) {
      throw new BadRequestError('Badge name and criteria are required.');
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      throw new NotFoundError('User not found.');
    }

    // Create new badge
    const badge = new Badge({
      user: req.user.id,
      badgeName,
      criteria,
    });

    await badge.save();

    return res.status(201).json({ message: 'Badge awarded successfully.', badge });
  } catch (error) {
    next(error);
  }
};

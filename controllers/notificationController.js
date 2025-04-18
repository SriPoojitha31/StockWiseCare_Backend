import Notification from '../models/notificatins.js';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.params.id });
  res.json(notifications);
};

export const markAsSeen = async (req, res) => {
  await Notification.updateMany({ userId: req.params.id }, { seen: true });
  res.sendStatus(200);
};

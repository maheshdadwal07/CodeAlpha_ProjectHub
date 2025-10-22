import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Notification from "../models/Notification.js";

// @desc Get notifications for user
// @route GET /api/notifications
// @access Private
export const getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id }).sort(
    "-createdAt"
  );
  res
    .status(200)
    .json({ success: true, count: notifications.length, notifications });
});

// @desc Mark notification as read
// @route PATCH /api/notifications/:id/read
// @access Private
export const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification)
    return next(new ErrorResponse("Notification not found", 404));

  if (notification.user.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Not authorized to update this notification", 403)
    );
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({ success: true, notification });
});

// @desc Delete notification
// @route DELETE /api/notifications/:id
// @access Private
export const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification)
    return next(new ErrorResponse("Notification not found", 404));

  if (notification.user.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Not authorized to delete this notification", 403)
    );
  }

  await notification.remove();

  res.status(200).json({ success: true, message: "Notification deleted" });
});

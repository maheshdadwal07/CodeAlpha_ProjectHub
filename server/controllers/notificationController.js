import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Notification from "../models/Notification.js";
import { emitNotification } from "../config/socket.js";

// @desc Get notifications for user
// @route GET /api/notifications
// @access Private
export const getNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate("relatedTask", "title")
    .populate("relatedProject", "title")
    .sort("-createdAt")
    .limit(50);

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

  await notification.deleteOne();

  res.status(200).json({ success: true, message: "Notification deleted" });
});

// @desc Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
export const markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { user: req.user._id, read: false },
    { read: true }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

// Helper function to create notification
export const createNotification = async (
  userId,
  type,
  message,
  options = {}
) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      message,
      link: options.link || null,
      relatedTask: options.taskId || null,
      relatedProject: options.projectId || null,
    });

    // Populate for real-time emission
    await notification.populate("relatedTask", "title");
    await notification.populate("relatedProject", "title");

    // Emit real-time notification via WebSocket
    emitNotification(userId, notification);

    return notification;
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    return null;
  }
};

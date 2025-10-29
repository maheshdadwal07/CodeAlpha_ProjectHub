import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { createNotification } from "./notificationController.js";
import { emitNewComment } from "../config/socket.js";

// @desc Get comments for a task
// @route GET /api/comments/:taskId
// @access Private
export const getCommentsByTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) return next(new ErrorResponse("Task not found", 404));

  const project = await Project.findById(task.project);
  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isMember)
    return next(new ErrorResponse("Not authorized to view comments", 403));

  const comments = await Comment.find({ task: taskId })
    .populate("user", "name email avatar")
    .sort("-createdAt");

  res.status(200).json({ success: true, count: comments.length, comments });
});

// @desc Create comment
// @route POST /api/comments
// @access Private
export const createComment = asyncHandler(async (req, res, next) => {
  const { content, task: taskId } = req.body;
  if (!content || !taskId)
    return next(new ErrorResponse("Content and task are required", 400));

  const task = await Task.findById(taskId);
  if (!task) return next(new ErrorResponse("Task not found", 404));

  const project = await Project.findById(task.project);
  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isMember)
    return next(
      new ErrorResponse("Not authorized to comment on this task", 403)
    );

  const comment = await Comment.create({
    content,
    task: taskId,
    user: req.user._id,
  });

  await comment.populate("user", "name email avatar");

  // Notify task assignee about new comment
  if (
    task.assignedTo &&
    task.assignedTo.toString() !== req.user._id.toString()
  ) {
    await createNotification(
      task.assignedTo,
      "comment_added",
      `${req.user.name} commented on your task: ${task.title}`,
      {
        taskId: task._id,
        projectId: project._id,
        link: `/project/${project._id}`,
      }
    );
  }

  // Notify task creator if different from commenter and assignee
  if (
    task.createdBy &&
    task.createdBy.toString() !== req.user._id.toString() &&
    task.createdBy.toString() !== task.assignedTo?.toString()
  ) {
    await createNotification(
      task.createdBy,
      "comment_added",
      `${req.user.name} commented on task: ${task.title}`,
      {
        taskId: task._id,
        projectId: project._id,
        link: `/project/${project._id}`,
      }
    );
  }

  // Emit real-time comment to project room
  emitNewComment(project._id.toString(), comment);

  res.status(201).json({ success: true, comment });
});

// @desc Update comment
// @route PUT /api/comments/:id
// @access Private (comment owner only)
export const updateComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(new ErrorResponse("Comment not found", 404));

  if (comment.user.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Not authorized to update this comment", 403)
    );
  }

  comment.content = req.body.content || comment.content;
  await comment.save();

  res.status(200).json({ success: true, comment });
});

// @desc Delete comment
// @route DELETE /api/comments/:id
// @access Private (comment owner or project owner)
export const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(new ErrorResponse("Comment not found", 404));

  const task = await Task.findById(comment.task);
  const project = await Project.findById(task.project);

  const isOwnerOrCommenter =
    comment.user.toString() === req.user._id.toString() ||
    project.owner.toString() === req.user._id.toString();

  if (!isOwnerOrCommenter)
    return next(
      new ErrorResponse("Not authorized to delete this comment", 403)
    );

  await comment.remove();

  res.status(200).json({ success: true, message: "Comment deleted" });
});

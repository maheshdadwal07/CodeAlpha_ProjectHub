import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import { createNotification } from "./notificationController.js";
import { emitTaskUpdate } from "../config/socket.js";

// @desc Create new task
// @route POST /api/tasks
// @access Private
export const createTask = asyncHandler(async (req, res, next) => {
  const {
    title,
    description,
    project: projectId,
    assignedTo,
    dueDate,
    priority,
  } = req.body;

  if (!title || !projectId) {
    return next(new ErrorResponse("Title and project are required", 400));
  }

  const project = await Project.findById(projectId);
  if (!project) return next(new ErrorResponse("Project not found", 404));

  // Check membership
  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isMember)
    return next(
      new ErrorResponse("Not authorized to add tasks to this project", 403)
    );

  const task = await Task.create({
    title,
    description,
    project: projectId,
    assignedTo: assignedTo || null,
    createdBy: req.user._id,
    dueDate: dueDate || null,
    priority: priority || "medium",
  });

  // Populate the task before sending response
  await task.populate("assignedTo", "name email");
  await task.populate("createdBy", "name email");

  // Send notification if task is assigned
  if (assignedTo && assignedTo !== req.user._id.toString()) {
    await createNotification(
      assignedTo,
      "task_assigned",
      `You have been assigned to task: ${title}`,
      {
        taskId: task._id,
        projectId: project._id,
        link: `/project/${project._id}`,
      }
    );
  }

  // Emit real-time update to project room
  emitTaskUpdate(projectId, task);

  console.log("✅ Task created:", task);
  res.status(201).json({ success: true, task });
});

// @desc Get all tasks for a project
// @route GET /api/tasks/:projectId
// @access Private
export const getTasksByProject = asyncHandler(async (req, res, next) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) return next(new ErrorResponse("Project not found", 404));

  // Check membership
  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isMember)
    return next(new ErrorResponse("Not authorized to view tasks", 403));

  const tasks = await Task.find({ project: projectId })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort("position");

  res.status(200).json({ success: true, count: tasks.length, tasks });
});

// @desc Get task by id
// @route GET /api/tasks/task/:id
// @access Private
export const getTaskById = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("project", "title");

  if (!task) return next(new ErrorResponse("Task not found", 404));

  // Check membership
  const project = await Project.findById(task.project);
  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isMember)
    return next(new ErrorResponse("Not authorized to view this task", 403));

  res.status(200).json({ success: true, task });
});

// @desc Update task
// @route PUT /api/tasks/:id
// @access Private
export const updateTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse("Task not found", 404));

  const project = await Project.findById(task.project);
  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isMember)
    return next(new ErrorResponse("Not authorized to update this task", 403));

  const updates = (({
    title,
    description,
    status,
    priority,
    assignedTo,
    dueDate,
    position,
  }) => ({
    title,
    description,
    status,
    priority,
    assignedTo,
    dueDate,
    position,
  }))(req.body);

  // Store old assignedTo before updating
  const oldAssignedTo = task.assignedTo?.toString();

  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) task[key] = updates[key];
  });

  await task.save();

  // Populate the task before sending response
  await task.populate("assignedTo", "name email");
  await task.populate("createdBy", "name email");

  // Send notification if task is reassigned to a different user
  const newAssignedTo = task.assignedTo?._id?.toString();
  if (
    newAssignedTo &&
    newAssignedTo !== req.user._id.toString() &&
    oldAssignedTo !== newAssignedTo
  ) {
    await createNotification(
      newAssignedTo,
      "task_assigned",
      `You have been assigned to task: ${task.title}`,
      {
        taskId: task._id,
        projectId: project._id,
        link: `/projects/${project._id}`,
      }
    );
    console.log("📧 Notification sent for task reassignment");
  }

  console.log("✅ Task updated:", task);
  res.status(200).json({ success: true, task });
});

// @desc Update task status only
// @route PATCH /api/tasks/:id/status
// @access Private
export const updateTaskStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse("Task not found", 404));

  const project = await Project.findById(task.project);
  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isMember)
    return next(new ErrorResponse("Not authorized to update this task", 403));

  if (status) task.status = status;
  await task.save();

  // Populate the task before sending response
  await task.populate("assignedTo", "name email");
  await task.populate("createdBy", "name email");

  console.log("✅ Task status updated:", task);
  res.status(200).json({ success: true, task });
});

// @desc Delete task
// @route DELETE /api/tasks/:id
// @access Private
export const deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new ErrorResponse("Task not found", 404));

  const project = await Project.findById(task.project);
  const isMember =
    project.owner.toString() === req.user._id.toString() ||
    project.members.some((m) => m.toString() === req.user._id.toString());

  if (!isMember)
    return next(new ErrorResponse("Not authorized to delete this task", 403));

  await task.deleteOne();

  console.log("✅ Task deleted:", task._id);
  res.status(200).json({ success: true, message: "Task deleted" });
});

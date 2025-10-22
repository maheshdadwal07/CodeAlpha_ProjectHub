import asyncHandler from "../utils/asyncHandler.js";
import ErrorResponse from "../utils/errorResponse.js";
import Project from "../models/Project.js";
import User from "../models/User.js";

// @desc Create new project
// @route POST /api/projects
// @access Private
export const createProject = asyncHandler(async (req, res, next) => {
  const { title, description, status } = req.body;

  if (!title) {
    return next(new ErrorResponse("Project title is required", 400));
  }

  const project = await Project.create({
    title,
    description,
    owner: req.user._id,
    members: [req.user._id],
    status: status || "active",
  });

  res.status(201).json({ success: true, project });
});

// @desc Get all projects for user
// @route GET /api/projects
// @access Private
export const getProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({
    $or: [{ owner: req.user._id }, { members: req.user._id }],
  })
    .populate("owner", "name email")
    .populate("members", "name email")
    .sort("-createdAt");

  res.status(200).json({ success: true, count: projects.length, projects });
});

// @desc Get single project
// @route GET /api/projects/:id
// @access Private
export const getProjectById = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email")
    .populate("members", "name email");

  if (!project) {
    return next(new ErrorResponse("Project not found", 404));
  }

  // Check membership
  const isMember =
    project.owner._id.toString() === req.user._id.toString() ||
    project.members.some((m) => m._id.toString() === req.user._id.toString());

  if (!isMember) {
    return next(new ErrorResponse("Not authorized to view this project", 403));
  }

  res.status(200).json({ success: true, project });
});

// @desc Update project (owner only)
// @route PUT /api/projects/:id
// @access Private
export const updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse("Project not found", 404));
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Not authorized to update this project", 403)
    );
  }

  const updates = (({ title, description, status }) => ({
    title,
    description,
    status,
  }))(req.body);

  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) project[key] = updates[key];
  });

  await project.save();

  res.status(200).json({ success: true, project });
});

// @desc Delete project (owner only)
// @route DELETE /api/projects/:id
// @access Private
export const deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new ErrorResponse("Project not found", 404));
  }

  if (project.owner.toString() !== req.user._id.toString()) {
    return next(
      new ErrorResponse("Not authorized to delete this project", 403)
    );
  }

  await project.remove();

  res.status(200).json({ success: true, message: "Project deleted" });
});

// @desc Add member by email
// @route POST /api/projects/:id/members
// @access Private (owner only)
export const addMember = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new ErrorResponse("Project not found", 404));

  if (project.owner.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse("Not authorized to add members", 403));
  }

  const { email } = req.body;
  if (!email) return next(new ErrorResponse("Please provide an email", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new ErrorResponse("User not found", 404));

  if (project.members.some((m) => m.toString() === user._id.toString())) {
    return next(new ErrorResponse("User already a member", 400));
  }

  project.members.push(user._id);
  await project.save();

  res.status(200).json({ success: true, project });
});

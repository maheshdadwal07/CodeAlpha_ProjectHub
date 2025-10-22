import express from "express";
import {
  createTask,
  getTasksByProject,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/").post(protect, createTask);
router.route("/:projectId").get(protect, getTasksByProject);
router
  .route("/task/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);
router.route("/:id/status").patch(protect, updateTaskStatus);

export default router;

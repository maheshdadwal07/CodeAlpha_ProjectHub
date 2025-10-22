import express from "express";
import {
  getCommentsByTask,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.route("/:taskId").get(protect, getCommentsByTask);
router.route("/").post(protect, createComment);
router.route("/:id").put(protect, updateComment).delete(protect, deleteComment);

export default router;

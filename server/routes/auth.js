import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  logout,
  getAllUsers,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/updateprofile", protect, updateProfile);
router.put("/updatepassword", protect, updatePassword);
router.post("/logout", protect, logout);
router.get("/users", protect, getAllUsers);

export default router;

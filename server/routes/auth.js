import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  logout,
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

export default router;

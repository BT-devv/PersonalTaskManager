import express from "express";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";
import {
  activateUserProfile,
  changeUserPassword,
  deleteUserProfile,
  getNotificationsList,
  getTeamList,
  getUser,
  loginUser,
  logoutUser,
  markNotificationRead,
  registerUser,
  updateUserProfile,
} from "../controller/userController.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser); // Register a new user
router.post("/login", loginUser); // Login an existing user
router.post("/logout", logoutUser); // Logout the current user

// Protected routes for authenticated users
router.get("/profile/:id", protectRoute, getUser); // Get user profile by ID
router.get("/team", protectRoute, isAdminRoute, getTeamList); // Get team list (Admin only)
router.get("/notifications", protectRoute, getNotificationsList); // Get notifications for the logged-in user

router.put("/profile", protectRoute, updateUserProfile); // Update profile of the logged-in user
router.put("/notifications/read", protectRoute, markNotificationRead); // Mark notifications as read
router.put("/password/change", protectRoute, changeUserPassword); // Change the password of the logged-in user

// Admin-only routes
router
  .route("/:id")
  .put(protectRoute, isAdminRoute, activateUserProfile) // Activate or deactivate a user profile (Admin only)
  .delete(protectRoute, isAdminRoute, deleteUserProfile); // Delete a user profile (Admin only)

export default router;

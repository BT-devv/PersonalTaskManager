import express from "express";
import {
  createProject,
  updateProject,
  getProject,
  getAllProjects,
  deleteProject,
  getProjectsByUserId,
} from "../controller/projectController.js";
import { protectRoute, isAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes related to project management
router.post("/", protectRoute, createProject); // Simplified the path
router.put("/:id", protectRoute, updateProject); // PUT is generally used for updates
router.get("/:id", protectRoute, getProject);
router.get("/", protectRoute, getAllProjects);
router.delete("/:id", protectRoute, isAdminRoute, deleteProject); // No need for 'delete' in the path
router.get("/user/:userId", protectRoute, getProjectsByUserId);

export default router;

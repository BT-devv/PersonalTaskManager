import express from "express";
import {
  createWorkspace,
  updateWorkspace,
  getWorkspace,
  getAllWorkspaces,
  deleteWorkspace,
  getWorkspacesByUser,
  getWorkspaceByUser,
} from "../controller/workspaceController.js";
import { protectRoute, isAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new workspace
router.post("/", protectRoute, createWorkspace);

// Route to update an existing workspace by ID
router.put("/:id", protectRoute, isAdminRoute, updateWorkspace);

// Route to get a specific workspace by ID
router.get("/:id", protectRoute, getWorkspace);

// Route to get all workspaces
router.get("/", protectRoute, getAllWorkspaces);

// Route to delete a workspace by ID
router.delete("/:id", protectRoute, isAdminRoute, deleteWorkspace);

router.get("/user/:userId", protectRoute, getWorkspacesByUser);
router.get(
  "/user/:userId/workspace/:workspaceId",
  protectRoute,
  getWorkspaceByUser
);
export default router;

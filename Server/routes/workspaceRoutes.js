import express from "express";
import {
  createWorkspace,
  updateWorkspace,
  getWorkspace,
  getAllWorkspaces,
  deleteWorkspace,
} from "../controller/workspaceController.js";
import { protectRoute, isAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createWorkspace);
router.put("/update/:id", protectRoute, updateWorkspace);
router.get("/:id", protectRoute, getWorkspace);
router.get("/", protectRoute, getAllWorkspaces);
router.delete("/delete/:id", protectRoute, isAdminRoute, deleteWorkspace);

export default router;

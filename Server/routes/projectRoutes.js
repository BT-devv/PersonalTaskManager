import express from "express";
import {
  createProject,
  updateProject,
  getProject,
  getAllProjects,
  deleteProject,
} from "../controller/projectController.js";
import { protectRoute, isAdminRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protectRoute, createProject);
router.put("/update/:id", protectRoute, updateProject);
router.get("/:id", protectRoute, getProject);
router.get("/", protectRoute, getAllProjects);
router.delete("/delete/:id", protectRoute, isAdminRoute, deleteProject);

export default router;

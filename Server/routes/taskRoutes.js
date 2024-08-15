import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  getTasksByProject,
  trashTask,
  updateTask,
} from "../controller/taskController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to create a new task
router.post("/", protectRoute, createTask);

// Route to duplicate an existing task
router.post("/duplicate/:id", protectRoute, duplicateTask);

// Route to post an activity related to a task
router.post("/activity/:id", protectRoute, postTaskActivity);

// Route to get dashboard statistics
router.get("/dashboard", protectRoute, dashboardStatistics);

// Route to get all tasks for the authenticated user
router.get("/", protectRoute, getTasks);

// Route to get all tasks by project for the authenticated user
router.get("/project/:projectId", protectRoute, getTasksByProject);

// Route to get a single task by ID for the authenticated user
router.get("/:id", protectRoute, getTask);

// Route to create a subtask under an existing task
router.put("/subtask/:id", protectRoute, createSubTask);

// Route to update an existing task
router.put("/:id", protectRoute, updateTask);

// Route to trash a task (soft delete)
router.put("/trash/:id", protectRoute, trashTask);

// Route to delete or restore a trashed task
router.delete("/delete-restore/:id?", protectRoute, deleteRestoreTask);

export default router;

import express from "express";
import { check, validationResult } from "express-validator";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controller/taskController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";
import Task from "../models/task.js"; // Import the Task model if you use it directly in routes

const router = express.Router();

// Route to create a new task with validation
router.post(
  "/",
  protectRoute,
  isAdminRoute,
  [
    check("title", "Title is required").not().isEmpty(),
    check("status", "Status is required").not().isEmpty(),
    check("project", "Project is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: false, errors: errors.array() });
    }

    try {
      const { title, description, status, priority, due_date, project, users } =
        req.body;

      const task = new Task({
        title,
        description,
        status,
        priority: priority ? priority.toLowerCase() : "medium",
        due_date,
        project,
        users,
      });

      await task.save();

      res.status(201).json({
        status: true,
        task,
        message: "Task created successfully.",
      });
    } catch (error) {
      console.error("Error in creating task:", error);
      return res
        .status(500)
        .json({
          status: false,
          message: "Server error. Please try again later.",
        });
    }
  }
);

// Route to duplicate an existing task
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);

// Route to post an activity related to a task
router.post("/activity/:id", protectRoute, postTaskActivity);

// Route to get dashboard statistics
router.get("/dashboard", protectRoute, dashboardStatistics);

// Route to get all tasks
router.get("/", protectRoute, getTasks);

// Route to get a single task by ID
router.get("/:id", protectRoute, getTask);

// Route to create a subtask under an existing task
router.put("/subtask/:id", protectRoute, isAdminRoute, createSubTask);

// Route to update an existing task
router.put("/:id", protectRoute, isAdminRoute, updateTask);

// Route to trash a task (soft delete)
router.put("/trash/:id", protectRoute, isAdminRoute, trashTask);

// Route to delete or restore a trashed task
router.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;

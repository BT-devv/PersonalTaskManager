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

// Updated /create route with validation
router.post(
  "/create",
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
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId } = req.user;
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
      console.error(error);
      return res.status(500).json({ status: false, message: error.message });
    }
  }
);

router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);
router.post("/activity/:id", protectRoute, postTaskActivity);

router.get("/dashboard", protectRoute, dashboardStatistics);
router.get("/", protectRoute, getTasks);
router.get("/:id", protectRoute, getTask);

router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);
router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
router.put("/:id", protectRoute, isAdminRoute, trashTask);

router.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;

import express from "express";
import {
  createTaskStatus,
  getTaskStatuses,
  getTaskStatus,
  updateTaskStatus,
  deleteTaskStatus,
} from "../controller/taskStatusController.js";
import { isAdminRoute, protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// Routes related to task status management
router.post("/", protectRoute, createTaskStatus); // POST / for creating a new status
router.get("/", protectRoute, getTaskStatuses); // GET / for retrieving all statuses
router.get("/:id", protectRoute, getTaskStatus); // GET /:id for retrieving a single status by ID
router.put("/:id", protectRoute, updateTaskStatus); // PUT /:id for updating a status by ID
router.delete("/:id", protectRoute, deleteTaskStatus); // DELETE /:id for deleting a status by ID

export default router;

import express from "express";
import {
  createTaskStatus,
  getTaskStatuses,
  getTaskStatus,
  updateTaskStatus,
  deleteTaskStatus,
} from "../controller/taskStatusController.js";

const router = express.Router();

// Routes related to task status management
router.post("/", createTaskStatus); // POST / for creating a new status
router.get("/", getTaskStatuses); // GET / for retrieving all statuses
router.get("/:id", getTaskStatus); // GET /:id for retrieving a single status by ID
router.put("/:id", updateTaskStatus); // PUT /:id for updating a status by ID
router.delete("/:id", deleteTaskStatus); // DELETE /:id for deleting a status by ID

export default router;

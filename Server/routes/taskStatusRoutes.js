import express from "express";
import {
  createTaskStatus,
  getTaskStatuses,
  getTaskStatus,
  updateTaskStatus,
  deleteTaskStatus,
} from "../controller/taskStatusController.js";

const router = express.Router();

router.post("/", createTaskStatus);
router.get("/", getTaskStatuses);
router.get("/:id", getTaskStatus);
router.put("/:id", updateTaskStatus);
router.delete("/:id", deleteTaskStatus);

export default router;

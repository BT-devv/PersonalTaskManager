import express from "express";
import userRoutes from "./userRoutes.js";
import taskStatusRoutes from "./taskStatusRoutes.js";
import taskRoutes from "./taskRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import projectRoutes from "./projectRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/status", taskStatusRoutes);
router.use("/task", taskRoutes);
router.use("/workspace", workspaceRoutes);
router.use("/project", projectRoutes);

export default router;

import express from "express";
import userRoutes from "./userRoutes.js";
import taskStatusRoutes from "./taskStatusRoutes.js";
import taskRoutes from "./taskRoutes.js";
import workspaceRoutes from "./workspaceRoutes.js";
import projectRoutes from "./projectRoutes.js";

const router = express.Router();

// Mounting routes with descriptive base paths
router.use("/users", userRoutes); // Plural form for consistency
router.use("/statuses", taskStatusRoutes); // More descriptive, plural form
router.use("/tasks", taskRoutes); // Plural form for consistency
router.use("/workspaces", workspaceRoutes); // Plural form for consistency
router.use("/projects", projectRoutes); // Plural form for consistency

export default router;

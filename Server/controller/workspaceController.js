import mongoose from "mongoose";
import User from "../models/user.js";
import Workspace from "../models/workspace.js";

// Create a new Workspace
export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id; // Ensure req.user is correctly set

    if (!userId) {
      return res
        .status(400)
        .json({ status: false, message: "User ID is missing" });
    }

    // Create a new workspace associated with the user
    const workspace = new Workspace({
      name,
      description,
      users: [userId],
    });

    await workspace.save();

    // Retrieve the user and ensure they are found
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Associate the workspace with the user
    user.workspaces.push(workspace._id);
    await user.save();

    res.status(201).json({ status: true, workspace });
  } catch (error) {
    console.error("Error in createWorkspace:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update an existing Workspace
export const updateWorkspace = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!workspace) {
      return res
        .status(404)
        .json({ status: false, message: "Workspace not found" });
    }

    return res.status(200).json({ status: true, workspace });
  } catch (error) {
    console.error("Error in updateWorkspace:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Get a single Workspace by ID
export const getWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res
        .status(404)
        .json({ status: false, message: "Workspace not found" });
    }

    return res.status(200).json({ status: true, workspace });
  } catch (error) {
    console.error("Error in getWorkspace:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Get all Workspaces
export const getAllWorkspaces = async (req, res) => {
  try {
    // Optionally, you might want to filter workspaces associated with the user
    const workspaces = await Workspace.find({ users: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ status: true, workspaces });
  } catch (error) {
    console.error("Error in getAllWorkspaces:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a Workspace by ID
export const deleteWorkspace = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findByIdAndDelete(id);

    if (!workspace) {
      return res
        .status(404)
        .json({ status: false, message: "Workspace not found" });
    }

    // Optionally remove the workspace from users
    await User.updateMany(
      { workspaces: workspace._id },
      { $pull: { workspaces: workspace._id } }
    );

    return res
      .status(200)
      .json({ status: true, message: "Workspace deleted successfully" });
  } catch (error) {
    console.error("Error in deleteWorkspace:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Get all Workspaces by User ID
export const getWorkspacesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user ID." });
    }

    const workspaces = await Workspace.find({ users: userId });

    if (!workspaces || workspaces.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No workspaces found for this user." });
    }

    res.status(200).json({ status: true, workspaces });
  } catch (error) {
    console.error("Error in getWorkspacesByUser:", error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Get a single Workspace by User ID
export const getWorkspaceByUser = async (req, res) => {
  try {
    const { userId, workspaceId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(workspaceId)
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user ID or workspace ID." });
    }

    const workspace = await Workspace.findOne({
      _id: workspaceId,
      users: userId,
    });

    if (!workspace) {
      return res
        .status(404)
        .json({ status: false, message: "Workspace not found for this user." });
    }

    res.status(200).json({ status: true, workspace });
  } catch (error) {
    console.error("Error in getWorkspaceByUser:", error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

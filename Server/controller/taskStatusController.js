import mongoose from "mongoose";
import TaskStatus from "../models/taskStatus.js";
import User from "../models/user.js";
import Task from "../models/task.js";

// Create a new Task Status
export const createTaskStatus = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user._id; // Assuming you have user ID in req.user from middleware

    const existingStatus = await TaskStatus.findOne({ name, user: userId });
    if (existingStatus) {
      return res.status(400).json({
        status: false,
        message: "Status already exists for this user.",
      });
    }

    const taskStatus = new TaskStatus({ name, description, user: userId });
    await taskStatus.save();

    // Update the user's taskStatuses array
    const user = await User.findById(userId);
    user.taskStatuses.push(taskStatus._id);
    await user.save();

    res.status(201).json({
      status: true,
      taskStatus,
      message: "Task status created successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// Get all Task Statuses by user
export const getTaskStatuses = async (req, res) => {
  try {
    const userId = req.user._id;

    const taskStatuses = await TaskStatus.find({ user: userId });
    res.status(200).json({ status: true, taskStatuses });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
// Get a single Task Status by ID
export const getTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid status ID." });
    }

    const taskStatus = await TaskStatus.findById(id);
    if (!taskStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Task status not found." });
    }
    const tasks = await Task.find({ status: id }).populate(
      "users",
      "name title email"
    );

    res.status(200).json({ status: true, taskStatus, tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Update an existing Task Status
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    const taskStatus = await TaskStatus.findOne({ _id: id, user: userId });

    if (!taskStatus) {
      return res.status(404).json({
        status: false,
        message: "Task status not found for this user.",
      });
    }

    taskStatus.name = name || taskStatus.name;
    taskStatus.description = description || taskStatus.description;

    await taskStatus.save();

    res.status(200).json({
      status: true,
      taskStatus,
      message: "Task status updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

// Delete a Task Status
export const deleteTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const taskStatus = await TaskStatus.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!taskStatus) {
      return res.status(404).json({
        status: false,
        message: "Task status not found for this user.",
      });
    }

    // Update the user's taskStatuses array
    await User.findByIdAndUpdate(userId, {
      $pull: { taskStatuses: id },
    });

    res
      .status(200)
      .json({ status: true, message: "Task status deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

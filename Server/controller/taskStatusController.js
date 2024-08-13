import TaskStatus from "../models/taskStatus.js";

// Create a new Task Status
export const createTaskStatus = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validate required fields
    if (!name) {
      return res
        .status(400)
        .json({ status: false, message: "Name is required." });
    }

    // Check for existing status
    const existingStatus = await TaskStatus.findOne({ name });
    if (existingStatus) {
      return res
        .status(409)
        .json({ status: false, message: "Status already exists." });
    }

    const taskStatus = new TaskStatus({ name, description });
    await taskStatus.save();

    res.status(201).json({
      status: true,
      taskStatus,
      message: "Task status created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Get all Task Statuses
export const getTaskStatuses = async (req, res) => {
  try {
    const taskStatuses = await TaskStatus.find().sort({ name: 1 });
    res.status(200).json({ status: true, taskStatuses });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
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

    res.status(200).json({ status: true, taskStatus });
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

    taskStatus.name = name || taskStatus.name;
    taskStatus.description = description || taskStatus.description;

    await taskStatus.save();

    res.status(200).json({
      status: true,
      taskStatus,
      message: "Task status updated successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Delete a Task Status
export const deleteTaskStatus = async (req, res) => {
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

    await taskStatus.remove();

    res
      .status(200)
      .json({ status: true, message: "Task status deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

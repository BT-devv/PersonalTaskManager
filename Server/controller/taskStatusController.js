import TaskStatus from "../models/taskStatus.js";

export const createTaskStatus = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingStatus = await TaskStatus.findOne({ name });
    if (existingStatus) {
      return res
        .status(400)
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
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTaskStatuses = async (req, res) => {
  try {
    const taskStatuses = await TaskStatus.find();
    res.status(200).json({ status: true, taskStatuses });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const taskStatus = await TaskStatus.findById(id);

    if (!taskStatus) {
      return res
        .status(404)
        .json({ status: false, message: "Task status not found." });
    }

    res.status(200).json({ status: true, taskStatus });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

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
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;

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
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

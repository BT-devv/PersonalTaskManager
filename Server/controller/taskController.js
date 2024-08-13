import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

// Create a new Task
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, due_date, project, users } =
      req.body;

    if (!title || !status || !priority || !project) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Title, status, priority, and project are required.",
        });
    }

    const task = new Task({
      title,
      description,
      status,
      priority: priority.toLowerCase(),
      due_date,
      project,
      users,
    });
    await task.save();

    const text = `New task "${title}" has been assigned to you in project "${project}". The task priority is set to ${priority.toLowerCase()}. Due date is ${new Date(
      due_date
    ).toDateString()}.`;

    await Notice.create({ team: users, text, task: task._id });

    res
      .status(201)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Duplicate a Task
export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found." });
    }

    const newTask = new Task({
      title: `${task.title} - Duplicate`,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
      project: task.project,
      users: task.users,
    });
    await newTask.save();

    const text = `New task "${
      newTask.title
    }" has been assigned to you in project "${
      task.project
    }". The task priority is set to ${task.priority.toLowerCase()}. Due date is ${new Date(
      task.due_date
    ).toDateString()}.`;

    await Notice.create({ team: task.users, text, task: newTask._id });

    res
      .status(201)
      .json({
        status: true,
        task: newTask,
        message: "Task duplicated successfully.",
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Update an existing Task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, project, users } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid task ID." });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found." });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.priority = priority ? priority.toLowerCase() : task.priority;
    task.due_date = due_date || task.due_date;
    task.project = project || task.project;
    task.users = users || task.users;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Post activity on a Task
export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, activity } = req.body;
    const userId = req.user._id;

    if (!type || !activity) {
      return res
        .status(400)
        .json({
          status: false,
          message: "Activity type and activity description are required.",
        });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found." });
    }

    task.activities.push({ type, activity, by: userId });
    await task.save();

    res
      .status(201)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Get dashboard statistics
export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const tasksQuery = isAdmin
      ? { isTrashed: false }
      : { isTrashed: false, users: { $in: [userId] } };
    const allTasks = await Task.find(tasksQuery)
      .populate("users", "name role title email")
      .sort({ _id: -1 });

    const users = isAdmin
      ? await User.find({ isActive: true })
          .select("name title role isAdmin createdAt")
          .limit(10)
          .sort({ _id: -1 })
      : [];

    const groupedTasks = allTasks.reduce((result, task) => {
      const { status } = task;
      if (!result[status]) {
        result[status] = 1;
      } else {
        result[status] += 1;
      }
      return result;
    }, {});

    const graphData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;
        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    const totalTasks = allTasks.length;
    const last10Tasks = allTasks.slice(0, 10);

    res.status(200).json({
      status: true,
      message: "Successfully retrieved dashboard statistics.",
      summary: {
        totalTasks,
        last10Tasks,
        users,
        tasks: groupedTasks,
        graphData,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Get all Tasks
export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    const query = { isTrashed: isTrashed === "true" };
    if (stage) query.stage = stage;

    const tasks = await Task.find(query)
      .populate("users", "name title email")
      .sort({ _id: -1 });

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Get a single Task by ID
export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid task ID." });
    }

    const task = await Task.findById(id)
      .populate("users", "name title role email")
      .populate("activities.by", "name");

    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found." });
    }

    res.status(200).json({ status: true, task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Create a Sub-task
export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.params;

    if (!title) {
      return res
        .status(400)
        .json({ status: false, message: "Sub-task title is required." });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found." });
    }

    task.subTasks.push({ title, tag, date });
    await task.save();

    res
      .status(201)
      .json({ status: true, message: "Sub-task added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Trash a Task
export const trashTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid task ID." });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res
        .status(404)
        .json({ status: false, message: "Task not found." });
    }

    task.isTrashed = true;
    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task trashed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

// Delete or Restore Task
export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (!actionType) {
      return res
        .status(400)
        .json({ status: false, message: "Action type is required." });
    }

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const task = await Task.findById(id);
      if (!task) {
        return res
          .status(404)
          .json({ status: false, message: "Task not found." });
      }
      task.isTrashed = false;
      await task.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany({ isTrashed: true }, { isTrashed: false });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid action type." });
    }

    res
      .status(200)
      .json({ status: true, message: "Operation performed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

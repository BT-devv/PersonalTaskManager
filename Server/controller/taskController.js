import Notice from "../models/notification.js";
import Task from "../models/task.js";
import User from "../models/user.js";

export const createTask = async (req, res) => {
  try {
    const { userId } = req.user;
    const { title, team, stage, date, priority, assets } = req.body;

    let text = "New task has been assigned to you";
    if (team?.length > 1) {
      text += ` and ${team?.length - 1} others.`;
    }

    text += ` The task priority is set to ${priority} priority, so check and act accordingly. The task date is ${new Date(
      date
    ).toDateString()}. Thank you!`;

    const activity = {
      type: "assigned",
      activity: text,
      by: userId,
    };

    const task = await Task.create({
      title,
      team,
      stage: stage.toLowerCase(),
      date,
      priority: priority.toLowerCase(),
      assets,
      activities: [activity],
    });

    await Notice.create({
      team,
      text,
      task: task._id,
    });

    res
      .status(200)
      .json({ status: true, task, message: "Task created successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const duplicateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    const newTask = await Task.create({
      title: `${task.title} - Duplicate`,
      team: task.team,
      subTasks: task.subTasks,
      assets: task.assets,
      priority: task.priority,
      stage: task.stage,
      date: task.date,
      activities: task.activities,
    });

    let text = "New task has been assigned to you";
    if (task.team.length > 1) {
      text += ` and ${task.team.length - 1} others.`;
    }

    text += ` The task priority is set to ${
      task.priority
    } priority, so check and act accordingly. The task date is ${new Date(
      task.date
    ).toDateString()}. Thank you!`;

    await Notice.create({
      team: task.team,
      text,
      task: newTask._id,
    });

    res
      .status(200)
      .json({
        status: true,
        task: newTask,
        message: "Task duplicated successfully.",
      });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const postTaskActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;
    const { type, activity } = req.body;

    const task = await Task.findById(id);

    const data = {
      type,
      activity,
      by: userId,
    };

    task.activities.push(data);
    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Activity posted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const dashboardStatistics = async (req, res) => {
  try {
    const { userId, isAdmin } = req.user;

    const tasksQuery = isAdmin
      ? { isTrashed: false }
      : { isTrashed: false, team: { $in: [userId] } };

    const allTasks = await Task.find(tasksQuery)
      .populate({ path: "team", select: "name role title email" })
      .sort({ _id: -1 });

    const users = await User.find({ isActive: true })
      .select("name title role isAdmin createdAt")
      .limit(10)
      .sort({ _id: -1 });

    const groupedTasks = allTasks.reduce((result, task) => {
      const { stage } = task;
      if (!result[stage]) {
        result[stage] = 1;
      } else {
        result[stage] += 1;
      }
      return result;
    }, {});

    const groupData = Object.entries(
      allTasks.reduce((result, task) => {
        const { priority } = task;
        result[priority] = (result[priority] || 0) + 1;
        return result;
      }, {})
    ).map(([name, total]) => ({ name, total }));

    const totalTasks = allTasks.length;
    const last10Tasks = allTasks.slice(0, 10);

    const summary = {
      totalTasks,
      last10Tasks,
      users: isAdmin ? users : [],
      tasks: groupedTasks,
      graphData: groupData,
    };

    res.status(200).json({
      status: true,
      message: "Successfully retrieved dashboard statistics.",
      ...summary,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { stage, isTrashed } = req.query;

    let query = { isTrashed: isTrashed === "true" };

    if (stage) {
      query.stage = stage;
    }

    const tasks = await Task.find(query)
      .populate({ path: "team", select: "name title email" })
      .sort({ _id: -1 });

    res.status(200).json({ status: true, tasks });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate({ path: "team", select: "name title role email" })
      .populate({ path: "activities.by", select: "name" });

    res.status(200).json({ status: true, task });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const createSubTask = async (req, res) => {
  try {
    const { title, tag, date } = req.body;
    const { id } = req.params;

    const newSubTask = { title, tag, date };

    const task = await Task.findById(id);

    task.subTasks.push(newSubTask);
    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Sub-task added successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, team, stage, priority, assets } = req.body;

    const task = await Task.findById(id);

    task.title = title;
    task.date = date;
    task.priority = priority.toLowerCase();
    task.assets = assets;
    task.stage = stage.toLowerCase();
    task.team = team;

    await task.save();

    res
      .status(200)
      .json({ status: true, message: "Task updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteRestoreTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { actionType } = req.query;

    if (actionType === "delete") {
      await Task.findByIdAndDelete(id);
    } else if (actionType === "deleteAll") {
      await Task.deleteMany({ isTrashed: true });
    } else if (actionType === "restore") {
      const resp = await Task.findById(id);

      resp.isTrashed = false;
      resp.save();
    } else if (actionType === "restoreAll") {
      await Task.updateMany(
        { isTrashed: true },
        { $set: { isTrashed: false } }
      );
    }

    res.status(200).json({
      status: true,
      message: `Operation performed successfully.`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

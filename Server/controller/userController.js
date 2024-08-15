import User from "../models/user.js";
import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import TaskStatus from "../models/taskStatus.js";
import bcrypt from "bcryptjs";
import { createJWT } from "../utils/index.js";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = new User({
      name,
      email,
      password,
      role,
    });

    await user.save();

    // Create default task statuses associated with the user
    const statuses = [
      { name: "To Do", description: "Tasks to be done", user: user._id },
      { name: "In Progress", description: "Tasks in progress", user: user._id },
      { name: "Done", description: "Tasks that are completed", user: user._id },
    ];

    const createdStatuses = await TaskStatus.insertMany(statuses);

    // Associate the created statuses with the user
    user.taskStatuses = createdStatuses.map((status) => status._id);
    await user.save();

    // Create a default workspace
    const workspace = new Workspace({
      name: `${name}'s Workspace`,
      description: "This is your personal workspace.",
      users: [user._id],
    });

    await workspace.save();

    // Create a default project within the workspace
    const project = new Project({
      name: "Sample Project",
      description: "This is a sample project.",
      workspace: workspace._id,
      users: [user._id],
    });

    await project.save();

    // Add the project to the workspace's projects array
    workspace.projects.push(project._id);
    await workspace.save();

    // Create sample tasks in the project
    const tasks = [
      {
        title: "Sample Task 1",
        description: "This is a sample task in To Do.",
        status: createdStatuses.find((status) => status.name === "To Do")._id,
        project: project._id,
        users: [user._id],
      },
      {
        title: "Sample Task 2",
        description: "This is a sample task in In Progress.",
        status: createdStatuses.find((status) => status.name === "In Progress")
          ._id,
        project: project._id,
        users: [user._id],
      },
      {
        title: "Sample Task 3",
        description: "This is a sample task in Done.",
        status: createdStatuses.find((status) => status.name === "Done")._id,
        project: project._id,
        users: [user._id],
      },
    ];

    const createdTasks = await Task.insertMany(tasks);

    // Add the tasks to the project's tasks array
    project.tasks = createdTasks.map((task) => task._id);
    await project.save();

    // Add references to user model
    user.workspaces = [workspace._id];
    user.projects = [project._id];
    user.tasks = createdTasks.map((task) => task._id);

    await user.save();

    // Populate the user data with the created workspaces, projects, and tasks
    const populatedUser = await User.findById(user._id)
      .populate({
        path: "workspaces",
        populate: {
          path: "projects",
          populate: {
            path: "tasks",
          },
        },
      })
      .populate("taskStatuses"); // Populate task statuses associated with the user

    createJWT(res, user._id);

    populatedUser.password = undefined; // Remove the password from the response

    res.status(201).json({
      status: true,
      user: populatedUser,
      message: "User registered successfully with default data.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email is case insensitive
    const user = await User.findOne({ email: email });
    console.log("User found:", user); // Debugging
    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    // Compare the entered password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debugging
    if (!isMatch) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    // If password matches, create a JWT and send it
    createJWT(res, user._id);

    user.password = undefined; // Remove the password from the response

    return res.status(200).json({
      status: true,
      user,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ status: true, message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get User by ID
export const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ status: false, message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({ status: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get Team List
export const getTeamList = async (req, res) => {
  try {
    const users = await User.find()
      .select("name title role email isActive")
      .sort({ name: 1 });

    return res.status(200).json({ status: true, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Get Notifications List
export const getNotificationsList = async (req, res) => {
  try {
    const { userId } = req.user;

    const notifications = await Notification.find({
      team: userId,
      isRead: { $nin: [userId] },
    })
      .populate("task", "title")
      .sort({ createdAt: -1 });

    return res.status(200).json({ status: true, notifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.user; // Get the userId from the authenticated user
    const { name, email, password, role } = req.body; // Get the updated fields from the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    // Update the user's information
    if (name) user.name = name;
    if (email) user.email = email.toLowerCase(); // Ensure email is stored in lowercase
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword; // Hash the new password before saving
    }
    if (role) user.role = role; // Optionally update the role if allowed

    await user.save();

    // Remove the password from the response
    user.password = undefined;

    res.status(200).json({
      status: true,
      user,
      message: "Profile updated successfully.",
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      status: false,
      message: "Server error. Please try again later.",
    });
  }
};

// Mark Notification as Read
export const markNotificationRead = async (req, res) => {
  try {
    const { userId } = req.user;
    const { isReadType, id } = req.query;

    let updateQuery;
    if (isReadType === "all") {
      updateQuery = {
        team: userId,
        isRead: { $nin: [userId] },
      };
    } else {
      updateQuery = {
        _id: id,
        team: userId,
        isRead: { $nin: [userId] },
      };
    }

    await Notification.updateMany(updateQuery, {
      $push: { isRead: userId },
    });

    return res
      .status(200)
      .json({ status: true, message: "Notifications updated" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Change User Password
export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId).select("+password");

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    user.password = undefined;
    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Activate or Deactivate User Profile
export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user ID" });
    }

    const user = await User.findById(id);

    if (user) {
      user.isActive = req.body.isActive;
      await user.save();

      return res.status(200).json({
        status: true,
        message: `User account has been ${
          user.isActive ? "activated" : "deactivated"
        }.`,
      });
    } else {
      return res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Delete User Profile
export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid user ID" });
    }

    const user = await User.findByIdAndDelete(id);

    if (user) {
      return res
        .status(200)
        .json({ status: true, message: "User deleted successfully" });
    } else {
      return res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

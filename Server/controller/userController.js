import User from "../models/user.js";
import Notification from "../models/notification.js";
import { createJWT } from "../utils/index.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if the email already exists
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }

    // Create new user
    const user = new User({ name, email, password, role });
    await user.save();

    user.password = undefined;
    return res.status(201).json({ status: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({
        status: false,
        message:
          "User account has been deactivated, contact the administrator.",
      });
    }

    // Match the password
    const isMatch = await user.matchPassword(password);

    if (isMatch) {
      createJWT(res, user._id);

      user.password = undefined;
      return res.status(200).json({ status: true, user });
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
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
    const { userId, isAdmin } = req.user;
    const { _id } = req.body;

    const id = isAdmin ? _id : userId;

    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.role = isAdmin ? req.body.role || user.role : user.role;
      user.isActive =
        req.body.isActive !== undefined ? req.body.isActive : user.isActive;

      const updatedUser = await user.save();
      updatedUser.password = undefined;

      return res.status(200).json({
        status: true,
        message: "Profile updated successfully.",
        user: updatedUser,
      });
    } else {
      return res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: false, message: "Server Error" });
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

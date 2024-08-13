import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Database connection function
export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit the process with failure
  }
};

// JWT creation and cookie setup function
export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Adjust based on environment
    maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
  });
};

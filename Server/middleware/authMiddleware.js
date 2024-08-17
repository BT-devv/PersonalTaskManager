import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes
const protectRoute = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header or cookies
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract token from Authorization header
    } else if (req.cookies?.token) {
      token = req.cookies.token; // Or extract from cookies if available
    }

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({
        status: false,
        message: "No token provided. Not authorized.",
      });
    }

    // Log the token for debugging purposes
    // console.log("Token provided:", token);

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Find the user by ID and select necessary fields
    const user = await User.findById(decodedToken.userId).select("email role");

    if (!user) {
      return res.status(401).json({
        status: false,
        message: "User not found. Not authorized.",
      });
    }

    // Attach user information to the request object
    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role, // Attach the role instead of isAdmin
    };

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(401).json({
      status: false,
      message: "Invalid token. Not authorized.",
    });
  }
};

// Middleware to check if the user is an admin
const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    // Check if the user's role is "admin"
    next();
  } else {
    return res.status(403).json({
      status: false,
      message: "Access denied. Admins only.",
    });
  }
};

export { protectRoute, isAdminRoute };

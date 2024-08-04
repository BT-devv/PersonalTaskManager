import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes
const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (token) {
      // Verify the token
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by ID and select necessary fields
      const user = await User.findById(decodedToken.userId).select(
        "email isAdmin"
      );

      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "Not authorized. Try login again." });
      }

      // Attach user information to the request object
      req.user = {
        email: user.email,
        isAdmin: user.isAdmin,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

// Middleware to check if the user is an admin
const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(401).json({
      status: false,
      message: "Not authorized as admin. Try login as admin.",
    });
  }
};

export { protectRoute, isAdminRoute };

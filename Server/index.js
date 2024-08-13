import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { dbConnection } from "./utils/index.js";
import { errorHandler, routeNotFound } from "./middleware/errorMiddleware.js";
import routes from "./routes/index.js";

// Load environment variables from .env file
dotenv.config();

// Establish database connection
dbConnection();

const PORT = process.env.PORT || 5000;

const app = express();

// Set up CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middlewares for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for parsing cookies
app.use(cookieParser());

// HTTP request logger middleware
app.use(morgan("dev"));

// Main application routes
app.use("/api", routes);

// Middleware for handling undefined routes
app.use(routeNotFound);

// Global error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

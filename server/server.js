import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import connectDB from "./config/db.js";
import errorHandler from "./middleware/error.js";
import { initSocket } from "./config/socket.js";

// Route files
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import taskRoutes from "./routes/tasks.js";
import commentRoutes from "./routes/comments.js";
import notificationRoutes from "./routes/notifications.js";

// Load env vars
dotenv.config();

// Initialize express app
const app = express();
const httpServer = createServer(app);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/notifications", notificationRoutes);

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ProjectHub API is running",
    version: "1.0.0",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server function
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();

    // Initialize Socket.io
    initSocket(httpServer);
    console.log("🔌 Socket.io initialized");

    // Start server
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log("🚀 ===================================");
      console.log(`🚀 Server running in ${process.env.NODE_ENV} mode`);
      console.log(`🚀 Server running on port ${PORT}`);
      console.log("🚀 WebSocket ready for real-time updates");
      console.log("🚀 ===================================");
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err, promise) => {
      console.log(`❌ Error: ${err.message}`);
      // Close server & exit process
      httpServer.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;

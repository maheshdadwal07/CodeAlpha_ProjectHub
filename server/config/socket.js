import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        process.env.CLIENT_URL,
      ].filter(Boolean),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Join user to their personal room
    socket.on("join", (userId) => {
      socket.join(`user:${userId}`);
      console.log(`👤 User ${userId} joined their room`);
    });

    // Join project room
    socket.on("join-project", (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`📋 Socket ${socket.id} joined project ${projectId}`);
    });

    // Leave project room
    socket.on("leave-project", (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`📋 Socket ${socket.id} left project ${projectId}`);
    });

    // User is typing in comment
    socket.on("typing", ({ projectId, taskId, userName }) => {
      socket.to(`project:${projectId}`).emit("user-typing", {
        taskId,
        userName,
      });
    });

    // User stopped typing
    socket.on("stop-typing", ({ projectId, taskId }) => {
      socket.to(`project:${projectId}`).emit("user-stopped-typing", { taskId });
    });

    socket.on("disconnect", () => {
      console.log("🔌 Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Emit notification to specific user
export const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user:${userId}`).emit("notification", notification);
  }
};

// Emit task update to project room
export const emitTaskUpdate = (projectId, task) => {
  if (io) {
    io.to(`project:${projectId}`).emit("task-updated", task);
  }
};

// Emit new comment to project room
export const emitNewComment = (projectId, comment) => {
  if (io) {
    io.to(`project:${projectId}`).emit("new-comment", comment);
  }
};

// Emit task status change
export const emitTaskStatusChange = (projectId, taskId, newStatus) => {
  if (io) {
    io.to(`project:${projectId}`).emit("task-status-changed", {
      taskId,
      newStatus,
    });
  }
};

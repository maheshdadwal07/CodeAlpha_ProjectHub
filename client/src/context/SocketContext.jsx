import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io(
        import.meta.env.VITE_API_URL || "http://localhost:5000",
        {
          withCredentials: true,
        }
      );

      newSocket.on("connect", () => {
        console.log("🔌 Socket connected");
        setConnected(true);

        // Join user's personal room
        newSocket.emit("join", user._id);
      });

      newSocket.on("disconnect", () => {
        console.log("🔌 Socket disconnected");
        setConnected(false);
      });

      // Listen for notifications
      newSocket.on("notification", (notification) => {
        console.log("🔔 New notification:", notification);
        toast.info(notification.message, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const joinProject = (projectId) => {
    if (socket) {
      socket.emit("join-project", projectId);
      console.log(`📋 Joined project room: ${projectId}`);
    }
  };

  const leaveProject = (projectId) => {
    if (socket) {
      socket.emit("leave-project", projectId);
      console.log(`📋 Left project room: ${projectId}`);
    }
  };

  const emitTyping = (projectId, taskId, userName) => {
    if (socket) {
      socket.emit("typing", { projectId, taskId, userName });
    }
  };

  const emitStopTyping = (projectId, taskId) => {
    if (socket) {
      socket.emit("stop-typing", { projectId, taskId });
    }
  };

  const value = {
    socket,
    connected,
    joinProject,
    leaveProject,
    emitTyping,
    emitStopTyping,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

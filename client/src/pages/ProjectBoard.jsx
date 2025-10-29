import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-toastify";
import Navbar from "@/components/layout/Navbar";
import TaskCard from "@/components/task/TaskCard";
import CreateTaskModal from "@/components/task/CreateTaskModal";
import TaskDetailModal from "@/components/task/TaskDetailModal";
import EditTaskModal from "@/components/task/EditTaskModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import { useSocket } from "@/context/SocketContext";
import {
  fetchTasks,
  updateTaskStatus,
  deleteTask,
} from "@/redux/slices/taskSlice";
import { fetchProjects } from "@/redux/slices/projectSlice";
import {
  FiPlus,
  FiCheckCircle,
  FiClock,
  FiList,
  FiArrowLeft,
} from "react-icons/fi";

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { socket, joinProject, leaveProject } = useSocket();
  const { tasks, isLoading } = useSelector((s) => s.tasks);
  const { projects } = useSelector((s) => s.projects);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks(id));

    // Join project room for real-time updates
    if (socket) {
      joinProject(id);
    }

    return () => {
      if (socket) {
        leaveProject(id);
      }
    };
  }, [dispatch, id, socket, joinProject, leaveProject]);

  // Listen for real-time task updates
  useEffect(() => {
    if (socket) {
      socket.on("task-updated", (task) => {
        console.log("🔄 Task updated in real-time:", task);
        dispatch(fetchTasks(id));
        toast.info("Task updated by another user");
      });

      socket.on("task-status-changed", ({ taskId, newStatus }) => {
        console.log(`🔄 Task ${taskId} status changed to ${newStatus}`);
        dispatch(fetchTasks(id));
      });

      socket.on("new-comment", (comment) => {
        console.log("💬 New comment:", comment);
        toast.info("New comment added");
      });

      return () => {
        socket.off("task-updated");
        socket.off("task-status-changed");
        socket.off("new-comment");
      };
    }
  }, [socket, dispatch, id]);

  const project = projects.find((p) => p._id === id) || {};

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };

  const handleDeleteTask = (taskId) => {
    setDeleteTaskId(taskId);
  };

  const confirmDelete = () => {
    if (deleteTaskId) {
      dispatch(deleteTask(deleteTaskId));
      setDeleteTaskId(null);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const statusMap = {
      todo: "todo",
      "in-progress": "in-progress",
      done: "done",
    };

    const newStatus = statusMap[destination.droppableId];

    if (destination.droppableId !== source.droppableId) {
      handleStatusChange(draggableId, newStatus);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="animate-fade-in flex items-center space-x-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all transform hover:scale-105 group"
              title="Back to Dashboard"
            >
              <FiArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-primary-600 transition-colors" />
            </button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {project.title || "Project"}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                {project.description || "No description"}
              </p>
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              onClick={() => setShowCreate(true)}
            >
              <FiPlus className="w-5 h-5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent mb-4"></div>
            <p className="text-gray-600 font-medium">Loading tasks...</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FiList className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">To Do</h3>
                  </div>
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
                    {todoTasks.length}
                  </span>
                </div>
                <Droppable droppableId="todo">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] ${
                        snapshot.isDraggingOver
                          ? "bg-primary-50 rounded-lg"
                          : ""
                      }`}
                    >
                      {todoTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No tasks</p>
                        </div>
                      ) : (
                        todoTasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={
                                  snapshot.isDragging ? "opacity-70" : ""
                                }
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => setSelectedTask(task)}
                                  onStatusChange={(status) =>
                                    handleStatusChange(task._id, status)
                                  }
                                  onDelete={() => handleDeleteTask(task._id)}
                                  onEdit={() => handleEditTask(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* In Progress Column */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <FiClock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">
                      In Progress
                    </h3>
                  </div>
                  <span className="px-3 py-1 bg-yellow-200 text-yellow-700 rounded-full text-sm font-semibold">
                    {inProgressTasks.length}
                  </span>
                </div>
                <Droppable droppableId="in-progress">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] ${
                        snapshot.isDraggingOver ? "bg-yellow-50 rounded-lg" : ""
                      }`}
                    >
                      {inProgressTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No tasks</p>
                        </div>
                      ) : (
                        inProgressTasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={
                                  snapshot.isDragging ? "opacity-70" : ""
                                }
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => setSelectedTask(task)}
                                  onStatusChange={(status) =>
                                    handleStatusChange(task._id, status)
                                  }
                                  onDelete={() => handleDeleteTask(task._id)}
                                  onEdit={() => handleEditTask(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              {/* Done Column */}
              <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FiCheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">Done</h3>
                  </div>
                  <span className="px-3 py-1 bg-green-200 text-green-700 rounded-full text-sm font-semibold">
                    {doneTasks.length}
                  </span>
                </div>
                <Droppable droppableId="done">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`space-y-3 min-h-[200px] ${
                        snapshot.isDraggingOver ? "bg-green-50 rounded-lg" : ""
                      }`}
                    >
                      {doneTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>No tasks</p>
                        </div>
                      ) : (
                        doneTasks.map((task, index) => (
                          <Draggable
                            key={task._id}
                            draggableId={task._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={
                                  snapshot.isDragging ? "opacity-70" : ""
                                }
                              >
                                <TaskCard
                                  task={task}
                                  onClick={() => setSelectedTask(task)}
                                  onStatusChange={(status) =>
                                    handleStatusChange(task._id, status)
                                  }
                                  onDelete={() => handleDeleteTask(task._id)}
                                  onEdit={() => handleEditTask(task)}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </DragDropContext>
        )}
      </div>

      {showCreate && (
        <CreateTaskModal projectId={id} onClose={() => setShowCreate(false)} />
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projectId={id}
          onClose={() => setEditingTask(null)}
        />
      )}

      {deleteTaskId && (
        <DeleteConfirmModal
          title="Delete Task"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onClose={() => setDeleteTaskId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default ProjectBoard;

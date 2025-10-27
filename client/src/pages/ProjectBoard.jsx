import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/layout/Navbar";
import TaskCard from "@/components/task/TaskCard";
import CreateTaskModal from "@/components/task/CreateTaskModal";
import { fetchTasks } from "@/redux/slices/taskSlice";
import { fetchProjects } from "@/redux/slices/projectSlice";
import { FiPlus, FiCheckCircle, FiClock, FiList } from "react-icons/fi";

const ProjectBoard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((s) => s.tasks);
  const { projects } = useSelector((s) => s.projects);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  const project = projects.find((p) => p._id === id) || {};

  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {project.title || "Project"}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              {project.description || "No description"}
            </p>
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
              <div className="space-y-3">
                {todoTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks</p>
                  </div>
                ) : (
                  todoTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                )}
              </div>
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
              <div className="space-y-3">
                {inProgressTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks</p>
                  </div>
                ) : (
                  inProgressTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                )}
              </div>
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
              <div className="space-y-3">
                {doneTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No tasks</p>
                  </div>
                ) : (
                  doneTasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateTaskModal projectId={id} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
};

export default ProjectBoard;

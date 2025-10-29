import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/redux/slices/projectSlice";
import Navbar from "@/components/layout/Navbar";
import ProjectList from "@/components/project/ProjectList";
import {
  FiCheckCircle,
  FiClock,
  FiFolder,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects, isLoading, error } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log("Dashboard mounted, fetching projects...");
    dispatch(fetchProjects());
  }, [dispatch]);

  useEffect(() => {
    console.log("Projects updated:", projects);
  }, [projects]);

  // Calculate real-time stats based on task status
  const totalProjects = projects.length;

  // Active projects: projects with tasks in-progress or todo
  const activeProjects = projects.filter(
    (p) =>
      p.realTimeStatus === "in-progress" ||
      (p.taskStats && (p.taskStats.inProgress > 0 || p.taskStats.todo > 0))
  ).length;

  // Completed projects: all tasks are done
  const completedProjects = projects.filter(
    (p) =>
      p.realTimeStatus === "completed" ||
      (p.taskStats &&
        p.taskStats.total > 0 &&
        p.taskStats.completed === p.taskStats.total)
  ).length;

  // Total tasks across all projects
  const totalTasks = projects.reduce(
    (sum, p) => sum + (p.taskStats?.total || 0),
    0
  );
  const completedTasks = projects.reduce(
    (sum, p) => sum + (p.taskStats?.completed || 0),
    0
  );
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/40 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Floating Geometric Shapes */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-blue-200/30 rounded-2xl rotate-12 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 border-2 border-purple-200/30 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 border-2 border-indigo-200/30 rounded-lg rotate-45 animate-float animation-delay-4000"></div>

        {/* Decorative Dots */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400/40 rounded-full animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-pink-400/40 rounded-full animate-pulse animation-delay-4000"></div>

        {/* Light Rays */}
        <div className="absolute top-0 left-1/4 w-px h-64 bg-gradient-to-b from-blue-200/50 to-transparent transform -rotate-12"></div>
        <div className="absolute top-0 right-1/3 w-px h-48 bg-gradient-to-b from-purple-200/50 to-transparent transform rotate-12"></div>
      </div>

      <Navbar />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-blue-100 mt-2 text-lg md:text-xl font-medium">
              Manage your projects and tasks efficiently
            </p>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-slide-up">
          {/* Total Projects Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <FiFolder className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-blue-50 rounded-full">
                  <span className="text-xs font-bold text-blue-600">TOTAL</span>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {totalProjects}
              </h3>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Projects
              </p>
            </div>
          </div>

          {/* Active Projects Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-yellow-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform animate-pulse">
                  <FiClock className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-yellow-50 rounded-full">
                  <span className="text-xs font-bold text-yellow-600">
                    ACTIVE
                  </span>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {activeProjects}
              </h3>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Active Projects
              </p>
            </div>
          </div>

          {/* Completed Projects Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-green-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <FiCheckCircle className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-green-50 rounded-full">
                  <span className="text-xs font-bold text-green-600">DONE</span>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {completedProjects}
              </h3>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Completed
              </p>
            </div>
          </div>

          {/* Completion Rate Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-purple-100 hover:shadow-2xl hover:scale-105 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                  <FiTrendingUp className="w-7 h-7 text-white" />
                </div>
                <div className="px-3 py-1 bg-purple-50 rounded-full">
                  <span className="text-xs font-bold text-purple-600">
                    RATE
                  </span>
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-1">
                {completionRate}%
              </h3>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Completion Rate
              </p>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4 font-medium">
              Loading projects...
            </p>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

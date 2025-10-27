import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/redux/slices/projectSlice";
import Navbar from "@/components/layout/Navbar";
import ProjectList from "@/components/project/ProjectList";
import { FiCheckCircle, FiClock, FiFolder } from "react-icons/fi";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p) => p.status === "in-progress"
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-xl animate-fade-in">
          <h1 className="text-4xl font-bold">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-primary-100 mt-2 text-lg">
            Manage your projects and tasks efficiently
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Total Projects
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {totalProjects}
                </h3>
              </div>
              <div className="p-4 bg-blue-100 rounded-2xl group-hover:scale-110 transition-transform">
                <FiFolder className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Active Projects
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {activeProjects}
                </h3>
              </div>
              <div className="p-4 bg-yellow-100 rounded-2xl group-hover:scale-110 transition-transform">
                <FiClock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Completed
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {completedProjects}
                </h3>
              </div>
              <div className="p-4 bg-green-100 rounded-2xl group-hover:scale-110 transition-transform">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        {isLoading ? (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4 font-medium">Loading projects...</p>
          </div>
        ) : (
          <ProjectList projects={projects} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

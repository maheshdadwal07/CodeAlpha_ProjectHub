import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createProject, fetchProjects } from "@/redux/slices/projectSlice";
import {
  FiPlus,
  FiFolder,
  FiUsers,
  FiX,
  FiCalendar,
  FiActivity,
} from "react-icons/fi";

const ProjectList = ({ projects }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.projects);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    console.log("📝 Creating project with data:", formData);

    try {
      const result = await dispatch(createProject(formData)).unwrap();
      console.log("✅ Project created successfully:", result);

      // Clear form and close modal
      setFormData({ title: "", description: "" });
      setShowModal(false);

      // Refresh projects list
      await dispatch(fetchProjects());
      console.log("✅ Projects list refreshed");
    } catch (err) {
      console.error("❌ Project creation error:", err);
      setError(err || "Failed to create project");
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center space-x-2 transform hover:scale-105 transition-transform shadow-lg"
        >
          <FiPlus />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-16 animate-fade-in">
          <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
            <FiFolder className="text-6xl text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first project to get started
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <FiPlus />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            // Calculate real-time status based on tasks
            const taskStats = project.taskStats || {
              total: 0,
              completed: 0,
              inProgress: 0,
              todo: 0,
            };
            let displayStatus = "ACTIVE";
            let statusColor =
              "bg-gradient-to-r from-green-500 to-green-600 text-white";

            if (taskStats.total > 0) {
              if (taskStats.completed === taskStats.total) {
                displayStatus = "COMPLETED";
                statusColor =
                  "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
              } else if (taskStats.inProgress > 0 || taskStats.todo > 0) {
                displayStatus = "ACTIVE";
                statusColor =
                  "bg-gradient-to-r from-green-500 to-green-600 text-white";
              }
            }

            return (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="block group animate-fade-in"
              >
                <div className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 overflow-hidden relative">
                  {/* Status Badge - Top Right */}
                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${statusColor}`}
                    >
                      {displayStatus}
                    </span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500"></div>

                  {/* Card Content */}
                  <div className="pt-6">
                    {/* Icon */}
                    <div className="mb-4">
                      <div className="inline-flex p-3 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl group-hover:scale-110 transition-transform">
                        <FiFolder className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors mb-3 pr-24">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2 min-h-[3rem]">
                      {project.description || "No description provided"}
                    </p>

                    {/* Task Statistics */}
                    {taskStats.total > 0 && (
                      <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center">
                              <span className="text-gray-600 font-medium">
                                Tasks:
                              </span>
                              <span className="ml-1 font-bold text-gray-900">
                                {taskStats.total}
                              </span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                              <span className="font-semibold text-green-700">
                                {taskStats.completed}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                              <span className="font-semibold text-yellow-700">
                                {taskStats.inProgress}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                              <span className="font-semibold text-gray-600">
                                {taskStats.todo}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="flex items-center mr-4">
                          <FiUsers className="mr-1.5 text-gray-400" />
                          <span className="font-medium">
                            {project.members?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FiActivity className="mr-1.5 text-gray-400" />
                          <span className="font-medium text-xs">
                            {displayStatus}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center">
                        <FiCalendar className="mr-1" />
                        {new Date(project.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-purple-500/0 group-hover:from-primary-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none"></div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Create New Project
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4 animate-shake">
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  rows="4"
                  placeholder="Enter project description"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary flex-1 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    "Create Project"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError("");
                  }}
                  className="btn btn-secondary flex-1 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;

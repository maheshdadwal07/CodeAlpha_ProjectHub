import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { createProject, fetchProjects } from "@/redux/slices/projectSlice";
import { FiPlus, FiFolder, FiUsers, FiX } from "react-icons/fi";

const ProjectList = ({ projects }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createProject(formData));
    if (result.type === "projects/createProject/fulfilled") {
      // Refresh projects list after successful creation
      dispatch(fetchProjects());
      setFormData({ title: "", description: "" });
      setShowModal(false);
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
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="block group animate-fade-in"
            >
              <div className="card hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {project.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      project.status === "active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : project.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : project.status === "completed"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {project.description || "No description provided"}
                </p>
                <div className="flex items-center text-sm text-gray-500 pt-3 border-t border-gray-100">
                  <FiUsers className="mr-2" />
                  <span>{project.members?.length || 0} members</span>
                </div>
              </div>
            </Link>
          ))}
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
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-500" />
              </button>
            </div>
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
                  className="btn btn-primary flex-1 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                >
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

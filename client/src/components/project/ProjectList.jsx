import { useState } from "react";
import { useDispatch } from "react-redux";
import { createProject } from "@/redux/slices/projectSlice";
import { FiPlus, FiFolder } from "react-icons/fi";

const ProjectList = ({ projects }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createProject(formData));
    setFormData({ title: "", description: "" });
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>New Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <FiFolder className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500">
            Create your first project to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project._id}
              className="card hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {project.description || "No description"}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {project.members?.length || 0} members
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    project.status === "active"
                      ? "bg-green-100 text-green-800"
                      : project.status === "completed"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Create New Project
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input"
                  placeholder="Enter project title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input"
                  rows="3"
                  placeholder="Enter project description"
                />
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="btn btn-primary flex-1">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex-1"
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

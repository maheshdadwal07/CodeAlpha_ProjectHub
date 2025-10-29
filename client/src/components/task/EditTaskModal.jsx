import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateTask } from "../../redux/slices/taskSlice";
import { FiX, FiChevronDown, FiUser, FiCheck } from "react-icons/fi";
import api from "@/services/api";

const EditTaskModal = ({ task, onClose, projectId }) => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    assignedTo: task?.assignedTo?._id || task?.assignedTo || "",
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/users");
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserSelect = (userId) => {
    setFormData({ ...formData, assignedTo: userId });
    setShowUserDropdown(false);
  };

  const getSelectedUserName = () => {
    if (!formData.assignedTo) return "Unassigned";
    const user = users.find((u) => u._id === formData.assignedTo);
    return user ? `${user.name} (${user.email})` : "Unassigned";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Updating task:", task._id, formData);
    try {
      await dispatch(updateTask({ taskId: task._id, data: formData })).unwrap();
      console.log("✅ Task updated successfully");
      onClose();
    } catch (err) {
      console.error("❌ Failed to update task:", err);
    }
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6 rounded-t-xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assign To
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-left flex items-center justify-between hover:border-primary-400 transition-colors"
                >
                  <span className="flex items-center space-x-2">
                    <FiUser className="text-gray-400" />
                    <span className="text-gray-700">
                      {getSelectedUserName()}
                    </span>
                  </span>
                  <FiChevronDown
                    className={`text-gray-400 transition-transform ${
                      showUserDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Custom Dropdown with Scroll */}
                {showUserDropdown && (
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                    {/* Unassigned Option */}
                    <div
                      onClick={() => handleUserSelect("")}
                      className={`px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors flex items-center justify-between ${
                        !formData.assignedTo ? "bg-primary-50" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <FiUser className="text-gray-500 w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-700">
                            Unassigned
                          </div>
                          <div className="text-xs text-gray-400">
                            No assignee
                          </div>
                        </div>
                      </div>
                      {!formData.assignedTo && (
                        <FiCheck className="text-primary-600 w-5 h-5" />
                      )}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100"></div>

                    {/* User List */}
                    {users.map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleUserSelect(user._id)}
                        className={`px-4 py-3 hover:bg-primary-50 cursor-pointer transition-colors flex items-center justify-between ${
                          formData.assignedTo === user._id
                            ? "bg-primary-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        {formData.assignedTo === user._id && (
                          <FiCheck className="text-primary-600 w-5 h-5" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-semibold"
            >
              Update Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;

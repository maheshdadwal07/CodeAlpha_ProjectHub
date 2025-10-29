import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "@/redux/slices/taskSlice";
import { FiX, FiPlus, FiChevronDown, FiUser, FiCheck } from "react-icons/fi";
import api from "@/services/api";

const CreateTaskModal = ({ projectId, onClose }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((s) => s.tasks);
  const [users, setUsers] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "",
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

  const handleUserSelect = (userId) => {
    setForm({ ...form, assignedTo: userId });
    setShowUserDropdown(false);
  };

  const getSelectedUserName = () => {
    if (!form.assignedTo) return "Unassigned";
    const user = users.find((u) => u._id === form.assignedTo);
    return user ? `${user.name} (${user.email})` : "Unassigned";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📝 Creating task with data:", { projectId, form });
    try {
      const result = await dispatch(
        createTask({ projectId, payload: form })
      ).unwrap();
      console.log("✅ Task created successfully:", result);
      onClose();
    } catch (err) {
      console.error("❌ Failed to create task:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Create New Task</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Task Title
            </label>
            <input
              className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              placeholder="Enter task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              rows={4}
              placeholder="Enter task description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Priority Level
            </label>
            <select
              className="input focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>

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
                  <span className="text-gray-700">{getSelectedUserName()}</span>
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
                      !form.assignedTo ? "bg-primary-50" : ""
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
                        <div className="text-xs text-gray-400">No assignee</div>
                      </div>
                    </div>
                    {!form.assignedTo && (
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
                        form.assignedTo === user._id ? "bg-primary-50" : ""
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
                      {form.assignedTo === user._id && (
                        <FiCheck className="text-primary-600 w-5 h-5" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              className="btn btn-primary flex-1 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <FiPlus className="w-5 h-5" />
                  <span>Create Task</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary flex-1 hover:bg-gray-200 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

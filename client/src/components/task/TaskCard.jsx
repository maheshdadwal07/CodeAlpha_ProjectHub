import React, { useState, useRef, useEffect } from "react";
import {
  FiUser,
  FiClock,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiArrowRight,
  FiCheckCircle,
  FiCircle,
  FiAlertCircle,
} from "react-icons/fi";

const TaskCard = ({ task, onClick, onStatusChange, onDelete, onEdit }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    setMenuOpen(false);
    action();
  };

  const getNextStatus = () => {
    if (task.status === "todo")
      return { status: "in-progress", label: "Move to In Progress" };
    if (task.status === "in-progress")
      return { status: "done", label: "Move to Done" };
    return { status: "todo", label: "Move to To Do" };
  };

  const nextStatus = getNextStatus();
  const priorityStyles = {
    high: "border-l-[6px] border-red-500 bg-gradient-to-r from-red-50 via-white to-white hover:from-red-100",
    medium:
      "border-l-[6px] border-yellow-500 bg-gradient-to-r from-yellow-50 via-white to-white hover:from-yellow-100",
    low: "border-l-[6px] border-green-500 bg-gradient-to-r from-green-50 via-white to-white hover:from-green-100",
  };

  const priorityBadgeStyles = {
    high: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200",
    medium:
      "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-yellow-200",
    low: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200",
  };

  const priorityIcons = {
    high: FiAlertCircle,
    medium: FiCircle,
    low: FiCheckCircle,
  };

  const priority = task.priority || "medium";
  const PriorityIcon = priorityIcons[priority];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg p-6 mb-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer relative overflow-hidden group border-2 ${
        priorityStyles[priority] || priorityStyles.medium
      }`}
    >
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 to-purple-500/0 group-hover:from-primary-500/10 group-hover:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <PriorityIcon
              className={`w-6 h-6 ${
                priority === "high"
                  ? "text-red-500 animate-pulse"
                  : priority === "medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}
            />
            <h4 className="font-bold text-gray-900 text-xl flex-1 pr-2 line-clamp-2 leading-tight">
              {task.title}
            </h4>
          </div>
          <div className="flex items-center space-x-3">
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                priorityBadgeStyles[priority] || priorityBadgeStyles.medium
              }`}
            >
              {priority}
            </span>
            <div className="relative" ref={menuRef}>
              <button
                onClick={handleMenuClick}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all hover:shadow-md border border-transparent hover:border-gray-200"
                title="Quick actions"
              >
                <FiMoreVertical className="w-5 h-5 text-gray-600" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-2xl z-10 w-56 py-2 animate-fade-in overflow-hidden">
                  {onEdit && (
                    <button
                      onClick={(e) => handleAction(e, onEdit)}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-50 flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-all duration-200 group/edit"
                    >
                      <FiEdit className="w-4 h-4 group-hover/edit:scale-110 transition-transform" />
                      <span className="font-medium">Edit Task</span>
                    </button>
                  )}
                  {onStatusChange && (
                    <button
                      onClick={(e) =>
                        handleAction(e, () => onStatusChange(nextStatus.status))
                      }
                      className="w-full px-4 py-2.5 text-left hover:bg-green-50 flex items-center space-x-3 text-gray-700 hover:text-green-600 transition-all duration-200 group/move"
                    >
                      <FiArrowRight className="w-4 h-4 group-hover/move:translate-x-1 transition-transform" />
                      <span className="font-medium">{nextStatus.label}</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => handleAction(e, onDelete)}
                      className="w-full px-4 py-3 text-left bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 flex items-center space-x-3 text-red-600 hover:text-white border-t-2 border-red-100 transition-all duration-200 font-semibold group/delete mt-1"
                    >
                      <FiTrash2 className="w-5 h-5 group-hover/delete:scale-110 group-hover/delete:rotate-12 transition-all" />
                      <span className="text-sm">Delete Task</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-5 line-clamp-2 relative leading-relaxed">
          {task.description || "No description provided"}
        </p>

        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100 relative">
          <div className="flex items-center text-sm text-gray-600">
            <div className="flex items-center bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-xl shadow-sm border border-gray-200">
              <FiUser className="mr-2 text-gray-400 w-4 h-4" />
              <span className="font-semibold text-gray-700">
                {task.assignedTo?.name || "Unassigned"}
              </span>
            </div>
          </div>
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-600 bg-gradient-to-r from-orange-50 to-red-50 px-4 py-2 rounded-xl shadow-sm border border-orange-200">
              <FiClock className="mr-2 text-orange-500 w-4 h-4" />
              <span className="font-semibold text-gray-700">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

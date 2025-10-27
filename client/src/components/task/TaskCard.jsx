import React from "react";
import { FiUser, FiClock } from "react-icons/fi";

const TaskCard = ({ task }) => {
  const priorityStyles = {
    high: "border-l-4 border-red-500 bg-red-50",
    medium: "border-l-4 border-yellow-500 bg-yellow-50",
    low: "border-l-4 border-green-500 bg-green-50",
  };

  const priorityBadgeStyles = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  const priority = task.priority || "medium";

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-4 mb-3 hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer ${
        priorityStyles[priority] || priorityStyles.medium
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-bold text-gray-900 text-lg flex-1 pr-2">
          {task.title}
        </h4>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${
            priorityBadgeStyles[priority] || priorityBadgeStyles.medium
          }`}
        >
          {priority}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {task.description || "No description provided"}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
        <div className="flex items-center text-sm text-gray-500">
          <FiUser className="mr-1.5 text-gray-400" />
          <span className="font-medium">
            {task.assignedToName || "Unassigned"}
          </span>
        </div>
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500">
            <FiClock className="mr-1 text-gray-400" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

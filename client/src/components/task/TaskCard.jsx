import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white rounded-md shadow p-3 mb-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-gray-900">{task.title}</h4>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
        <div className="text-sm text-gray-500">{task.priority || "medium"}</div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Assigned to: {task.assignedToName || "Unassigned"}
      </div>
    </div>
  );
};

export default TaskCard;

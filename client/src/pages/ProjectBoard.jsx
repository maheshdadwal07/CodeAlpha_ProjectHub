import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "@/components/layout/Navbar";
import TaskCard from "@/components/task/TaskCard";
import CreateTaskModal from "@/components/task/CreateTaskModal";
import { fetchTasks } from "@/redux/slices/taskSlice";
import { fetchProjects } from "@/redux/slices/projectSlice";

const ProjectBoard = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector((s) => s.tasks);
  const { projects } = useSelector((s) => s.projects);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks(id));
  }, [dispatch, id]);

  const project = projects.find((p) => p._id === id) || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {project.title || "Project"}
            </h1>
            <p className="text-gray-600">{project.description}</p>
          </div>
          <div>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreate(true)}
            >
              New Task
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            Loading tasks...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3">To Do</h3>
              {tasks
                .filter((t) => t.status === "todo")
                .map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
            </div>
            <div>
              <h3 className="font-semibold mb-3">In Progress</h3>
              {tasks
                .filter((t) => t.status === "in-progress")
                .map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
            </div>
            <div>
              <h3 className="font-semibold mb-3">Done</h3>
              {tasks
                .filter((t) => t.status === "done")
                .map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
            </div>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateTaskModal projectId={id} onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
};

export default ProjectBoard;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchComments,
  createComment,
  deleteComment,
} from "@/redux/slices/commentSlice";
import {
  FiX,
  FiSend,
  FiTrash2,
  FiUser,
  FiClock,
  FiCalendar,
} from "react-icons/fi";

const TaskDetailModal = ({ task, onClose }) => {
  const dispatch = useDispatch();
  const { comments, isLoading } = useSelector((s) => s.comments);
  const { user } = useSelector((s) => s.auth);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (task?._id) {
      dispatch(fetchComments(task._id));
    }
  }, [dispatch, task?._id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      await dispatch(createComment({ taskId: task._id, text: commentText }));
      setCommentText("");
    }
  };

  const handleDeleteComment = (commentId) => {
    if (window.confirm("Delete this comment?")) {
      dispatch(deleteComment(commentId));
    }
  };

  const priorityStyles = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  const statusStyles = {
    todo: "bg-gray-100 text-gray-700 border-gray-200",
    "in-progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
    review: "bg-blue-100 text-blue-700 border-blue-200",
    done: "bg-green-100 text-green-700 border-green-200",
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
              <div className="flex items-center gap-3 text-sm">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    priorityStyles[task.priority] || priorityStyles.medium
                  }`}
                >
                  {task.priority?.toUpperCase()}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    statusStyles[task.status] || statusStyles.todo
                  }`}
                >
                  {task.status?.replace("-", " ").toUpperCase()}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
          {/* Task Details */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Description
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">
              {task.description || "No description provided"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <FiUser className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Assigned To</p>
                <p className="font-semibold">
                  {task.assignedToName || "Unassigned"}
                </p>
              </div>
            </div>
            {task.dueDate && (
              <div className="flex items-center gap-2 text-gray-600">
                <FiCalendar className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Due Date</p>
                  <p className="font-semibold">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              💬 Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="input flex-1 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="btn btn-primary px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mx-auto"></div>
                  <p className="mt-2">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-primary-100 rounded-full">
                          <FiUser className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {comment.user?.name || "Unknown User"}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FiClock className="w-3 h-3" />
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {comment.user?._id === user?._id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete comment"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 ml-12">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="btn btn-secondary w-full hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;

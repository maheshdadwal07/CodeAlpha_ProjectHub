import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Fetch comments for a task
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (taskId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/${taskId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch comments");
    }
  }
);

// Create a new comment
export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ taskId, text }, { rejectWithValue }) => {
    try {
      const response = await api.post("/comments", { task: taskId, text });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create comment");
    }
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete comment");
    }
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter((c) => c._id !== action.payload);
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;

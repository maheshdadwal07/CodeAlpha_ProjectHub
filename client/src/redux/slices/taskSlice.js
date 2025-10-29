import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/services/api";

// Fetch tasks for a project
export const fetchTasks = createAsyncThunk(
  "tasks/fetch",
  async (projectId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/tasks/${projectId}`);
      console.log("✅ Tasks fetched:", res.data);
      return res.data.tasks; // Return only the tasks array
    } catch (err) {
      console.error("❌ Fetch tasks error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Create a new task
export const createTask = createAsyncThunk(
  "tasks/create",
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/tasks`, { project: projectId, ...payload });
      console.log("✅ Task created, response:", res.data);
      return res.data.task; // Return only the task object
    } catch (err) {
      console.error("❌ Create task error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Update task status
export const updateTaskStatus = createAsyncThunk(
  "tasks/updateStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const res = await api.patch(`/tasks/${taskId}/status`, { status });
      console.log("✅ Task status updated:", res.data);
      return res.data.task; // Return only the task object
    } catch (err) {
      console.error(
        "❌ Update status error:",
        err.response?.data || err.message
      );
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  "tasks/update",
  async ({ taskId, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/tasks/task/${taskId}`, data);
      console.log("✅ Task updated:", res.data);
      return res.data.task; // Return only the task object
    } catch (err) {
      console.error("❌ Update task error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  "tasks/delete",
  async (taskId, { rejectWithValue }) => {
    try {
      await api.delete(`/tasks/task/${taskId}`);
      return taskId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: { tasks: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update task status
      .addCase(updateTaskStatus.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (t) => t._id === action.payload._id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// Fetch all projects
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/projects");
      return response.data.projects;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch projects"
      );
    }
  }
);

// Create project
export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await api.post("/projects", projectData);
      return response.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create project"
      );
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/projects/${id}`, data);
      return response.data.project;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update project"
      );
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to delete project"
      );
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter((p) => p._id !== action.payload);
      });
  },
});

export const { setCurrentProject, clearError } = projectSlice.actions;
export default projectSlice.reducer;

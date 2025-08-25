import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedProject_progress: { id: 231 },
  allProjects_progress: [],
  ui_progress: {
    variant: "view",
    deleteCompt: false,
    activityCompt: false,
    milestoneCompt: false,
  },
  data_progress: {
    period: { from: null, to: null },
    tree: [],
  },
};
const progressSlice = createSlice({
  name: "progressSlice",
  initialState,
  reducers: {
    setProject_progress: (state, action) => {
      state.selectedProject_progress = action.payload;
    },
    setAllProjects_progress: (state, action) => {
      state.allProjects_progress = action.payload;
    },
  },
});
export const { setProject_progress } = progressSlice.actions;
export default progressSlice.reducer;

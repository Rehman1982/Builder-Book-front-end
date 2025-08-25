import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  allprojects: [],
  selectedProject: null,
  deleteIds: [],
  variant: "view",
  showDialog: false,
  errors: {},
};
const projectsSlice = createSlice({
  name: "createSlice",
  initialState,
  reducers: {
    setAllProjects: (state, action) => {
      state.allprojects = action.payload;
    },
    setDeleteIds: (state, action) => {
      const { id, check } = action.payload;
      check && state.deleteIds.push(id);
      !check &&
        (state.deleteIds = state?.deleteIds?.filter((num) => num !== id));
    },
    clearDeleteIds: (state) => {
      state.deleteIds = [];
    },
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
    create: (state, action) => {
      state.selectedProject = action.payload;
      state.showDialog = true;
      state.variant = "create";
    },
    view: (state, action) => {
      state.selectedProject = action?.payload;
      state.showDialog = true;
      state.variant = "view";
    },
    edit: (state, action) => {
      state.selectedProject = action?.payload;
      state.showDialog = true;
      state.variant = "edit";
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    open: (state) => {
      state.showDialog = true;
    },
    close: (state) => {
      state.showDialog = false;
      state.selectedProject = null;
    },
  },
});

export const {
  setAllProjects,
  setDeleteIds,
  clearDeleteIds,
  selectProject,
  setVariant,
  create,
  view,
  edit,
  open,
  close,
  setErrors,
} = projectsSlice.actions;
export default projectsSlice.reducer;

// refenced Funcitons

const generateNestedTree = (menuArray) => {
  const map = {};
  const tree = [];

  // Create a map with default children array
  menuArray.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  // Build the tree
  menuArray.forEach((item) => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });

  return tree;
};

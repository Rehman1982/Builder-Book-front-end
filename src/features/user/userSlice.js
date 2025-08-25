import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  allUsers: [],
  filteredUsers: [],
  selectedUser: {},
  deleteIds: [],
  variant: "view",
  showDialog: false,
  errors: {},
  partials: {
    accounts: [],
    roles: [],
    projects: [],
  },
};
const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
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
    setUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
    create: (state, action) => {
      state.selectedUser = {};
      state.showDialog = true;
      state.variant = "create";
    },
    view: (state, action) => {
      state.selectedUser = action?.payload;
      state.showDialog = true;
      state.variant = "view";
    },
    edit: (state, action) => {
      state.selectedUser = action?.payload;
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
      state.selectedUser = {};
      state.errors = {};
    },
    filterUsers: (state, action) => {
      const string = action.payload || "";
      state.filteredUsers = _.filter(state.allUsers, (user) => {
        if (
          (user.user && user.user.toLowerCase().includes(string)) ||
          (user.cnic && user.cnic.includes(string)) ||
          (user.mbn && user.mbn.includes(string)) ||
          (user.email && user.email.toLowerCase().includes(string)) ||
          (user.status && user.status.toLowerCase().includes(string))
        ) {
          return user;
        }
      });
    },
    setPartials: (state, action) => {
      state.partials = action.payload;
    },
  },
});

export const {
  setAllUsers,
  filterUsers,
  setDeleteIds,
  clearDeleteIds,
  setUser,
  setVariant,
  create,
  view,
  edit,
  open,
  close,
  setErrors,
  setPartials,
} = userSlice.actions;
export default userSlice.reducer;

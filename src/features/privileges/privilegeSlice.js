import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  all_Privileges: [],
  showGeneral_Privilege: false,
  showProject_Privilege: false,
  user: null,
  project: null,
  errors: {},
};
const privilegeSlice = createSlice({
  name: "privilegeSlice",
  initialState,
  reducers: {
    setAll_Privileges: (state, action) => {
      state.all_Privileges = action.payload;
    },
    openGeneral_Privilege: (state, action) => {
      state.showGeneral_Privilege = true;
    },
    closeGeneral_Privilege: (state, action) => {
      state.showGeneral_Privilege = false;
    },
    openProject_Privilege: (state, action) => {
      state.showProject_Privilege = true;
    },
    closeProject_Privilege: (state, action) => {
      state.showProject_Privilege = false;
    },
    setUser_Privilege: (state, action) => {
      state.user = action.payload;
    },
    setProject_Privilege: (state, action) => {
      state.project = action.payload;
    },
  },
});

export const {
  setAll_Privileges,
  openGeneral_Privilege,
  closeGeneral_Privilege,
  openProject_Privilege,
  closeProject_Privilege,
  filter_Privilege,
  setUser_Privilege,
  setProject_Privilege,
} = privilegeSlice.actions;
export default privilegeSlice.reducer;

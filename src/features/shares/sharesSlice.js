import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  project_shares: {},
  ui_shares: {
    variant: "view",
    component: false,
  },
  data_shares: {
    equityAccounts: [],
    users: [],
  },
};
const sharesSlice = createSlice({
  name: "sharesSlice",
  initialState,
  reducers: {
    setProject_shares: (state, action) => {
      state.project_shares = action.payload;
    },
    clearProject_shares: (state, action) => {
      state.project = {};
    },
    openComponent_shares: (state, action) => {
      state.ui_shares.component = true;
      state.ui_shares.variant = "create";
    },
    closeComponent_shares: (state, action) => {
      state.ui_shares.component = false;
      state.ui_shares.variant = "view";
    },
    setEquityAccounts_shares: (state, action) => {
      state.data_shares.equityAccounts = action.payload;
    },
    clearEquityAccounts_shares: (state, action) => {
      state.data_shares.equityAccounts = [];
    },
    setUsers_shares: (state, action) => {
      state.data_shares.users = action.payload;
    },
    clearUsers_shares: (state, action) => {
      state.data_shares.users = [];
    },
    clearUi_shares: (state, action) => {
      state.ui_shares = {
        variant: "view",
        component: false,
      };
    },
    clearData_shares: (state, action) => {
      state.data_shares = {
        equityAccounts: [],
        users: [],
      };
    },
  },
});
export const {
  setProject_shares,
  clearProject_shares,
  openComponent_shares,
  closeComponent_shares,
  setEquityAccounts_shares,
  clearEquityAccounts_shares,
  setUsers_shares,
  clearUsers_shares,
  clearData_shares,
} = sharesSlice.actions;
export default sharesSlice.reducer;

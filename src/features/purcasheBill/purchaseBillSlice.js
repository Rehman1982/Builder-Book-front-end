import { createSlice } from "@reduxjs/toolkit";

import purchaseBillApi from "./purchaseBillApi";

const initialState = {
  pbNo: "",
  transDetails: {
    trans_no: "",
    pbNo: "",
    created_at: "",
    user_id: "",
    user_name: "",
    project_id: "",
    project_name: "",
  },
  jrDetails: [
    {
      desp: "",
      item_id: "",
      item_name: "",
      project_id: "",
      project_name: "",
      qty: 0,
      rate: 0,
      debit: 0,
    },
  ],
  errors: {},
  variant: "view",
  showComp: false,
  items: [],
  projects: [],
  period: {},
};

const purchaseBillSlice = createSlice({
  name: "purchaseBillSlice",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    viewPB: (state, { payload }) => {
      state.pbNo = payload;
      state.variant = "view";
      state.showComp = true;
    },
    createPB: (state) => {
      state.pbNo = "";
      state.jrDetails = [];
      state.variant = "create";
      state.showComp = true;
    },
    editPB: (state) => {
      // state.transDetails = payload.tr;
      // state.jrDetails = payload.jr;
      state.variant = "edit";
      state.showComp = true;
    },
    closePB: (state) => {
      state.pbNo = "";
      state.transDetails = {};
      state.jrDetails = [];
      state.variant = "view";
      state.showComp = false;
    },
    addJR: (state, action) => {
      state.errors = {};
      state.jrDetails = [...state.jrDetails, action.payload];
    },
    updateJR: (state, action) => {
      const { index, data } = action.payload;
      state.jrDetails = state.jrDetails.map((jr, i) => {
        if (i === index) {
          return data;
        } else {
          return jr;
        }
      });
    },
    deleteJR: (state, action) => {
      state.jrDetails.splice(action.payload, 1);
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        purchaseBillApi.endpoints.showPB.matchFulfilled,
        (state, action) => {
          state.jrDetails = action.payload.jrDetails;
          state.transDetails = action.payload.transDetails;
          state.variant = "view";
          state.showComp = true;
        }
      )
      .addMatcher(
        purchaseBillApi.endpoints.createPB.matchFulfilled,
        (state, action) => {
          state.items = action.payload.items;
          state.projects = action.payload.projects;
        }
      );
  },
});

export const {
  setPeriod,
  viewPB,
  createPB,
  editPB,
  closePB,
  addJR,
  updateJR,
  deleteJR,
  setErrors,
} = purchaseBillSlice.actions;
export default purchaseBillSlice.reducer;

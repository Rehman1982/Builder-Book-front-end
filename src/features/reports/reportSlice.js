import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  endpoint: "",
  title: "",
  groupOn: "",
  period: { from: null, to: null },
  partials: {
    businesses: [],
    status: [],
    projects: [],
  },
  conditions: [
    { key: "link", value: null },
    { key: "p.status", value: null },
    { key: "project_id", value: null },
  ],
  havings: [],
  groupby: [
    { name: "Projects", value: "project_id" },
    { name: "Vendors", value: "vendor_id" },
    { name: "Accounts", value: "account_id" },
    { name: "Users", value: "user_id" },
    { name: "Items", value: "item_id" },
    { name: "Business", value: "link" },
  ],
  mainReport: {
    groupedOn: "project_id",
  },
  detailReport: {
    title: "",
    conditions: [],
    showComp: false,
    groupedOn: "project_id",
  },
  moreDetailReport: {
    title: "More Report Title",
    conditions: [],
    showComp: false,
    groupedOn: {},
  },
};

const reportSlice = createSlice({
  name: "reportSlice",
  initialState,
  reducers: {
    setReportPartials: (state, action) => {
      state.partials = action.payload;
    },
    setDefaults: (state, { payload }) => {
      state.endpoint = payload.endpoint;
      state.title = payload.title;
      state.groupOn = payload.groupOn;
    },
    setConditions: (state, action) => {
      state.conditions = action.payload;
    },
    setHavings: (state, action) => {
      state.havings = action.payload;
    },
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    setGroupby: (state, action) => {
      state.groupOn = action.payload;
    },
    setGroupDetailReport: (state, action) => {
      state.detailReport.groupedOn = action.payload;
    },
    openDetails: (state, { payload }) => {
      const { title, condition, groupOn } = payload;
      state.detailReport.title = title;
      if (Array.isArray(condition)) {
        state.detailReport.conditions = [...state.conditions, ...condition];
      } else {
        state.detailReport.conditions = [...state.conditions, condition];
      }
      state.detailReport.groupedOn = groupOn;
      state.detailReport.showComp = true;
    },
    closeDetails: (state, action) => {
      // state.conditions = [];
      state.detailReport.showComp = false;
    },
    openMoreDetails: (state, { payload }) => {
      const { title, condition, groupby } = payload;
      state.moreDetailReport.title = title;
      state.moreDetailReport.conditions = [
        ...state.detailReport.conditions,
        condition,
      ];

      state.moreDetailReport.showComp = true;
    },
    closeMoreDetails: (state, action) => {
      state.moreDetailReport.conditions = [];
      state.moreDetailReport.showComp = false;
    },
  },
});

export const {
  setReportPartials,
  setDefaults,
  setConditions,
  setHavings,
  setPeriod,
  setGroupby,
  openDetails,
  closeDetails,
  setGroupDetailReport,
  openMoreDetails,
  closeMoreDetails,
} = reportSlice.actions;
export default reportSlice.reducer;

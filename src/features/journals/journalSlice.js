import { createSlice } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const FROM = dayjs().startOf("month").format("YYYY-MM-DD");
const TO = dayjs().endOf("month").format("YYYY-MM-DD");

const initialState = {
  data: {
    selectedJR: {},
  },
  ui: {
    variant: "",
    showDialoge: false,
  },
};
const journalSlice = createSlice({
  name: "journalSlice",
  initialState,
  reducers: {
    setJR: (state, action) => {
      state.data.selectedJR = action.payload;
    },
    setVendors: (state, action) => {
      state.data.vendors = action.payload;
    },
    setAccounts: (state, action) => {},
    setItems: (state, action) => {},
    create: (state, action) => {
      state.data.selectedJR = {};
      state.ui.variant = "create";
      state.ui.showDialoge = true;
    },
    view: (state, action) => {
      state.data.selectedJR = action.payload;
      state.ui.variant = "view";
      state.ui.showDialoge = true;
    },
    edit: (state, action) => {
      state.data.selectedJR = action.payload;
      state.ui.variant = "edit";
      state.ui.showDialoge = true;
    },
    delete: (state, action) => {},
    setVariant: (state, action) => {},
    clear: (state, action) => {},
  },
});
export const {
  setJR,
  setVendors,
  setAccounts,
  setItems,
  create,
  view,
  edit,
  setVariant,
  clear,
} = journalSlice.actions;
export default journalSlice.reducer;

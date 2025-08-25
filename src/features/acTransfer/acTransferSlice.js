import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import acTransferApi from "./acTransferApi";

const initialState = {
  transferNo: "",
  transDetails: {
    trans_no: "",
    transferNo: "",
    created_at: "",
    transfer_by: "",
  },
  entries: [],
  selectedEntry: {},
  errors: {},
  variant: "view",
  showComp: false,
  users: [],
};

const acTransferSlice = createSlice({
  name: "acTransferSlice",
  initialState,
  reducers: {
    viewAcTranfer: (state, { payload }) => {
      state.transferNo = payload;
      state.variant = "view";
      state.showComp = true;
    },
    createAcTranfer: (state) => {
      state.transferNo = "";
      state.entries = [];
      state.selectedEntry = {};
      state.variant = "create";
      state.showComp = true;
    },
    editAcTranfer: (state, { payload }) => {
      //   state.selectedEntry = payload;
      state.transDetails = payload.tr;
      state.entries = payload.jr;
      state.variant = "edit";
      state.showComp = true;
    },
    closeAcTranfer: (state) => {
      state.transferNo = "";
      state.transDetails = {};
      state.entries = [];
      state.variant = "view";
      state.showComp = false;
    },
    addEntry: (state, action) => {
      state.errors = {};
      state.entries = [...state.entries, action.payload];
    },
    selectEntry: (state, action) => {
      state.selectedEntry = action.payload;
    },
    updateEntry: (state, action) => {
      const { index, data } = action.payload;
      state.entries = state.entries.map((entry, i) => {
        if (i === index) {
          return data;
        } else {
          return entry;
        }
      });
    },
    deleteEntry: (state, action) => {
      state.entries.splice(action.payload, 1);
    },
    setEntryErrors: (state, action) => {
      state.errors = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        acTransferApi.endpoints.showAcTransfer.matchFulfilled,
        (state, action) => {
          //   console.log("respone of Extra Reducer", action);
          state.transDetails = action.payload.tr;
          state.entries = action.payload.jr;
          state.variant = "view";
          state.showComp = true;
        }
      )
      .addMatcher(
        acTransferApi.endpoints.createAcTransfer.matchFulfilled,
        (state, action) => {
          console.log("respone of Extra Reducer", action);
          //   state.transDetails = action.payload.tr;
          //   state.entries = action.payload.jr;
          //   state.variant = "view";
          //   state.showComp = true;
        }
      );
  },
});

export const {
  viewAcTranfer,
  createAcTranfer,
  editAcTranfer,
  closeAcTranfer,
  addEntry,
  selectEntry,
  updateEntry,
  deleteEntry,
  setEntryErrors,
} = acTransferSlice.actions;
export default acTransferSlice.reducer;

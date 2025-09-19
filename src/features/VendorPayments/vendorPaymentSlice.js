import { createSlice } from "@reduxjs/toolkit";

import vendorPaymentApi from "./vendorPaymentApi";

const initialState = {
  paymentNo: null,
  transDetails: {
    trans_no: "",
    paymentNo: "",
    created_at: "",
    user_id: "",
    user_name: "",
  },
  jrDetails: [
    {
      desp: "",
      vendor_id: "",
      vendor_name: "",
      account_id: "",
      account_name: "",
      project_id: "",
      project_name: "",
      debit: 0,
      credit: 0,
    },
  ],
  errors: {},
  variant: "view",
  showComp: false,
  vendors: [],
  projects: [],
  books: [],
  period: {},
};

const vendorPaymentSlice = createSlice({
  name: "vendorPaymentSlice",
  initialState,
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
    viewPayment: (state, { payload }) => {
      console.log(payload);
      state.paymentNo = payload;
      state.variant = "view";
      state.showComp = true;
    },
    createPayment: (state) => {
      state.paymentNo = "";
      state.jrDetails = [];
      state.variant = "create";
      state.showComp = true;
    },
    editPayment: (state) => {
      // state.transDetails = payload.tr;
      // state.jrDetails = payload.jr;
      state.variant = "edit";
      state.showComp = true;
    },
    closePayment: (state) => {
      state.paymentNo = "";
      state.transDetails = {};
      state.jrDetails = [];
      state.errors = {};
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
        vendorPaymentApi.endpoints.show.matchFulfilled,
        (state, action) => {
          state.jrDetails = action.payload.jrDetails;
          state.transDetails = action.payload.transDetails;
          // state.variant = "view";
          // state.showComp = true;
        }
      )
      .addMatcher(
        vendorPaymentApi.endpoints.create.matchFulfilled,
        (state, action) => {
          console.log(action);
          if (action?.payload?.projects) {
            state.projects = action.payload.projects;
          }
          if (action?.payload?.vendors) {
            state.vendors = action.payload.vendors;
          }
          // state.items = action.payload.items;
          // state.projects = action.payload.projects;
        }
      );
  },
});

export const {
  setPeriod,
  viewPayment,
  createPayment,
  editPayment,
  closePayment,
  addJR,
  updateJR,
  deleteJR,
  setErrors,
} = vendorPaymentSlice.actions;
export default vendorPaymentSlice.reducer;

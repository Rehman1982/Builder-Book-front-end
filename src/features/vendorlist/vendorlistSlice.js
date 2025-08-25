import { createSlice } from "@reduxjs/toolkit";
import _, { partial } from "lodash";
const initialState = {
  vendors: [],
  selectedVendor: {},
  variant: "view",
  filteredData: [],
  busy: false,
  open: false,
  partials: {
    accounts: [],
  },
};
const vendorlistSlice = createSlice({
  name: "vendorlistSlice",
  initialState,
  reducers: {
    setVendors: (state, action) => {
      state.vendors = action.payload;
    },
    setSelectedVendor: (state, action) => {
      state.selectedVendor = action.payload;
    },
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
    applyFilter: (state, action) => {
      const string = action.payload.toLowerCase();
      state.busy = true;
      const filteredData = _.filter(state.vendors, (vendor) => {
        if (
          (vendor.name && vendor.name.toLowerCase().includes(string)) ||
          (vendor.address && vendor.address.toLowerCase().includes(string)) ||
          (vendor.cnic && vendor.cnic.includes(string)) ||
          (vendor.mob_no && vendor.mob_no.includes(string)) ||
          (vendor.email && vendor.email.toLowerCase().includes(string)) ||
          (vendor.status && vendor.status.toLowerCase().includes(string))
        ) {
          state.busy = false;
          return vendor;
        }
      });
      state.filteredData = filteredData;
    },
    setOpen: (state, action) => {
      state.open = action.payload;
    },
  },
});

export const {
  setVendors,
  setSelectedVendor,
  setVariant,
  applyFilter,
  setOpen,
} = vendorlistSlice.actions;
export default vendorlistSlice.reducer;

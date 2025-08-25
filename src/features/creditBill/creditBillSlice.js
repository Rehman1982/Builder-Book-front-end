import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedBill: {},
  ui: {
    variant: "view",
    viewComponent: false,
    createComponent: false,
    editComponent: false,
    deleteComponent: false,
  },
};
const creditBillSlice = createSlice({
  name: "creditBillSlice",
  initialState,
  reducers: {
    setBill: (state, action) => {
      state.selectedBill = action.payload;
    },
    view: (state, action) => {
      console.log(action);
      state.selectedBill = action.payload;
      state.ui.variant = "view";
      state.ui.viewComponent = true;
    },
    create: (state) => {
      state.ui.variant = "create";
      state.ui.createComponent = true;
    },
    edit: (state, action) => {
      state.selectedBill = action.payload;
      state.ui.variant = "edit";
      state.ui.editComponent = true;
    },
    destroy: (state, action) => {
      state.selectedBill = action.payload;
      state.ui.variant = "delete";
      state.ui.deleteComponent = true;
    },
    clear: (state) => {
      state.ui.viewComponent = false;
      state.ui.createComponent = false;
      state.ui.editComponent = false;
      state.ui.deleteComponent = false;
      state.ui.variant = "create";
      state.selectedBill = {};
    },
  },
});
export const { setBill, view, create, edit, destroy, clear } =
  creditBillSlice.actions;

export default creditBillSlice.reducer;

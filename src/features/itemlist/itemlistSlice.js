import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  selectedItem: { parent_id: 15 },
  deleteIds: [],
  errors: {},
  partials: {
    accounts: [],
  },
  ui: {
    variant: "view",
    show: false,
  },
};
const itemlistSlice = createSlice({
  name: "companySlice",
  initialState,
  reducers: {
    setItem: (state, action) => {
      const { payload } = action;
      const { selectedItem } = state;
      state.selectedItem = { ...selectedItem, ...payload };
    },
    createItem: (state, action) => {
      state.ui.variant = "create";
      state.selectedItem = action.payload || {};
      state.ui.show = true;
    },
    viewItem: (state, action) => {
      state.ui.variant = "view";
      state.selectedItem = action.payload;
      state.ui.show = true;
    },
    editItem: (state, action) => {
      console.log(action.payload);
      state.ui.variant = "edit";
      state.selectedItem = action.payload;
      state.ui.show = true;
    },
    setDeleteIds: (state, action) => {
      const { check, id } = action.payload;
      if (check) {
        state.deleteIds.push(id);
      }
      if (!check) {
        state.deleteIds = state.deleteIds.filter((di) => di !== id);
      }
    },
    clearItem: (state, action) => {
      state.ui.variant = "view";
      state.selectedItem = {};
      state.errors = {};
      state.ui.show = false;
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
  },
});

export const {
  setItem,
  createItem,
  viewItem,
  editItem,
  setDeleteIds,
  clearItem,
  setErrors,
} = itemlistSlice.actions;
export default itemlistSlice.reducer;

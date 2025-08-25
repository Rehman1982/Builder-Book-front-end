import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  data_menu: {
    items: [],
    selectedItem: {},
    deleteIds: [],
    errors: {},
  },
  ui_menu: {
    variant: "view",
    showDialog: false,
  },
};
const sidemenuSlice = createSlice({
  name: "createSlice",
  initialState,
  reducers: {
    setAItems_menu: (state, action) => {
      state.data_menu.items = action.payload;
    },
    setDeleteIds_menu: (state, action) => {
      const { id, check } = action.payload;
      check && state?.data_menu?.deleteIds.push(id);
      !check &&
        (state.data_menu.deleteIds = state?.data_menu?.deleteIds?.filter(
          (num) => num !== id
        ));
    },
    clearDeleteIds_menu: (state) => {
      state.deleteIds = [];
    },
    selectItem_menu: (state, action) => {
      state.data_menu.selectedItem = action.payload;
    },
    setVariant_menu: (state, action) => {
      state.ui_menu.variant = action.payload;
    },
    create_menu: (state, action) => {
      state.data_menu.selectedItem = action.payload;
      state.ui_menu.showDialog = true;
      state.ui_menu.variant = "create";
    },
    view_menu: (state, action) => {
      state.data_menu.selectedItem = action?.payload;
      state.ui_menu.showDialog = true;
      state.ui_menu.variant = "view";
    },
    edit_menu: (state, action) => {
      state.ui_menu.selectedItem = action?.payload;
      state.ui_menu.showDialog = true;
      state.ui_menu.variant = "edit";
    },
    setErrors_menu: (state, action) => {
      state.data_menu.errors = action.payload;
    },
    open_menu: (state) => {
      state.ui_menu.showDialog = true;
    },
    close_menu: (state) => {
      state.ui_menu.showDialog = false;
      state.data_menu.selectedItem = null;
      state.data_menu.errors = {};
    },
  },
});

export const {
  setAItems_menu,
  setDeleteIds_menu,
  clearDeleteIds_menu,
  selectItem_menu,
  setVariant_menu,
  create_menu,
  view_menu,
  edit_menu,
  setErrors_menu,
  open_menu,
  close_menu,
} = sidemenuSlice.actions;
export default sidemenuSlice.reducer;

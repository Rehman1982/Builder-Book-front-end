import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

const initialState = {
  allAccounts: [],
  tree: [],
  selectedAccount: {},
  deleteIds: [],
  variant: "view",
  showDialog: false,
  errors: {},
  acTypes: [
    { name: "Assets", slug: "assets" },
    { name: "Liabilites", slug: "Liability" },
    { name: "Equities", slug: "equity" },
    { name: "Income", slug: "income" },
    { name: "Cost of Goods", slug: "COGS" },
  ],
};
const coaSlice = createSlice({
  name: "coaSlice",
  initialState,
  reducers: {
    setAllAccounts: (state, action) => {
      state.allAccounts = action.payload;
    },
    generateTree: (state, action) => {
      if (action.payload) {
        state.tree = generateNestedTree(action.payload) || [];
      }
    },
    setDeleteIds: (state, action) => {
      const { id, check } = action.payload;
      check && state.deleteIds.push(id);
      !check &&
        (state.deleteIds = state?.deleteIds?.filter((num) => num !== id));
    },
    clearDeleteIds: (state) => {
      state.deleteIds = [];
    },
    setAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
    create: (state, action) => {
      state.selectedAccount = action.payload;
      state.showDialog = true;
      state.variant = "create";
    },
    view: (state, action) => {
      state.selectedAccount = action?.payload;
      state.showDialog = true;
      state.variant = "view";
    },
    edit: (state, action) => {
      state.selectedAccount = action?.payload;
      state.showDialog = true;
      state.variant = "edit";
    },
    setErrors: (state, action) => {
      state.errors = action.payload;
    },
    open: (state) => {
      state.showDialog = true;
    },
    close: (state) => {
      state.showDialog = false;
      state.selectedAccount = null;
    },
  },
});

export const {
  setAllAccounts,
  setDeleteIds,
  clearDeleteIds,
  generateTree,
  setAccount,
  setVariant,
  create,
  view,
  edit,
  open,
  close,
  setErrors,
} = coaSlice.actions;
export default coaSlice.reducer;

// refenced Funcitons

const generateNestedTree = (menuArray) => {
  const map = {};
  const tree = [];

  // Create a map with default children array
  menuArray.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  // Build the tree
  menuArray.forEach((item) => {
    if (item.parent_id && map[item.parent_id]) {
      map[item.parent_id].children.push(map[item.id]);
    } else {
      tree.push(map[item.id]);
    }
  });

  return tree;
};

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  props: {
    object_id: "",
    user_id: "",
  },
  ui: {
    variant: "view",
    showComponent: false,
  },
};
const signatureSlice = createSlice({
  name: "signatureSlice",
  initialState,
  reducers: {
    viewSignatures: (state, action) => {
      state.props.object_type = action.payload.type;
      state.props.object_id = action.payload.id;
      state.ui.variant = "view";
      state.ui.showComponent = true;
    },
    closeSignatures: (state, action) => {
      state.props.object_type = "";
      state.props.object_id = "";
      state.ui.variant = "view";
      state.ui.showComponent = false;
    },
  },
});

export const { viewSignatures, closeSignatures } = signatureSlice.actions;
export default signatureSlice.reducer;

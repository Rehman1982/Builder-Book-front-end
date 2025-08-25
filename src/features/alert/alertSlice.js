import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  alertShow: false,
  severity: "error",
};
const alertSlice = createSlice({
  name: "alertSlice",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
    setAlertShow: (state, action) => {
      state.alertShow = action.payload;
    },
    setSeverity: (state, action) => {
      state.severity = action.payload;
    },
    toast: (state, action) => {
      const { message, show, severity } = action.payload;
      state.message = message || "";
      state.alertShow = show || true;
      state.severity = severity || "error";
    },
    clearToast: (state) => {
      state.message = "";
      state.alertShow = false;
      state.severity = "";
    },
  },
});

export const { setMessage, setAlertShow, setSeverity, toast, clearToast } =
  alertSlice.actions;
export default alertSlice.reducer;

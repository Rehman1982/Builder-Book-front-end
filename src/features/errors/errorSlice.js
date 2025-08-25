import { createSlice } from "@reduxjs/toolkit";

const initialsSlice = {
  showAlert: false,
  validationErrors: {},
  globalErrors: {},
  permissionErrors: {},
};
const errorsSlice = createSlice({
  name: "errorsSlice",
  initialState,
  reducers: {},
});

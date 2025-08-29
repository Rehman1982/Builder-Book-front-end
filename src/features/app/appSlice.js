import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobile: false,
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    setDevice: () => {},
  },
});

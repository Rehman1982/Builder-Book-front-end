import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  businessType: "",
  projectId: "",
  projectStatus: "",
  period: { from: null, to: null },
};

const plReportSlice = createSlice({
  name: "plReportSlice",
  initialState,
  reducers: {
    setBusinessType: () => {},
    setProjectId: () => {},
    setProjectStatus: () => {},
    setPeriod: () => {},
  },
});

export const { setBusinessType, setProjectId, setProjectStatus, setPeriod } =
  plReportSlice.actions;
export default plReportSlice.reducer;

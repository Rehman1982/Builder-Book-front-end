import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  companies: "",
  selectedCompany: "",
  variant: "view",
};
const companySlice = createSlice({
  name: "companySlice",
  initialState,
  reducers: {
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
    },
    setVariant: (state, action) => {
      state.variant = action.payload;
    },
  },
});

export const { setCompanies, setSelectedCompany, setVariant } =
  companySlice.actions;
export default companySlice.reducer;

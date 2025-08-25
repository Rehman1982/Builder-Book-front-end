import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cards: "",
  ieOverview: "",
  vitals: "",
  expenseOverview: "light",
};
const dashSlice = createSlice({
  name: "dashSlice",
  initialState,
  reducers: {
    setCards: (state, action) => {
      state.cards = action.payload;
    },
    setIeOverview: (state, action) => {
      state.ieOverview = action.payload;
    },
    setVitals: (state, action) => {
      state.vitals = action.payload;
    },
    setExpenseOverview: (state, action) => {
      state.expenseOverview = action.payload;
    },
  },
});

export const { setCards, setIeOverview, setVitals, setExpenseOverview } =
  dashSlice.actions;
export default dashSlice.reducer;

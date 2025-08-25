import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  props: {
    type: "",
    id: "",
  },
  open: false,
  state: [],
};
const messengerSlice = createSlice({
  name: "messengerSlice",
  initialState,
  reducers: {
    setProps: (state, action) => {
      state.type = action.payload.type;
      state.id = action.payload.id;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    openMessenger: (state, action) => {
      state.props.type = action.payload.type;
      state.props.id = action.payload.id;
      state.open = true;
    },
    closeMessenger: (state) => {
      state.props.type = "";
      state.props.id = "";
      state.open = false;
    },
  },
});

export const { setState, openMessenger, closeMessenger, setProps } =
  messengerSlice.actions;
export default messengerSlice.reducer;

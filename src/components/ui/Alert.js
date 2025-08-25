import React from "react";
import { Snackbar, Alert as Abc, Paper } from "@mui/material";
import Grow from "@mui/material/Grow";
import { useDispatch, useSelector } from "react-redux";
import {
  setMessage,
  setAlertShow,
  setSeverity,
  clearToast,
} from "../../features/alert/alertSlice";

export default function Alert(props) {
  const dispatch = useDispatch();
  const { alertShow, show, message, severity } = useSelector(
    (state) => state.alertSlice
  );
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(clearToast());
  };
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      open={alertShow}
      autoHideDuration={5000}
      onClose={handleClose}
      TransitionComponent={Grow}
      sx={{ minWidth: "25%" }}
    >
      <Abc
        component={Paper}
        elevation={3}
        severity={severity}
        sx={{ width: "100%" }}
        onClose={handleClose}
      >
        {message}
      </Abc>
    </Snackbar>
  );
}
export { Alert };

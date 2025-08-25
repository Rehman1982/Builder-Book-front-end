import React, { createContext } from "react";
import { useState } from "react";
import { Snackbar, Alert as Abc, Paper } from "@mui/material";
import Grow from "@mui/material/Grow";
const Alert = createContext();
export default function AlertBar(props) {
  const [open, showAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    showAlert(false);
    setMessage("");
    // setSeverity("success");
  };
  return (
    <Alert.Provider value={{ showAlert, setMessage, setSeverity }}>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={3000}
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
      {props.children}
    </Alert.Provider>
  );
}
export { Alert };

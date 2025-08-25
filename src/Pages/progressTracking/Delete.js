import React, { useState, useEffect, useContext } from "react";
import ProgTrackingContext from "./context";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Dialog, TextField, Typography, Button, LinearProgress } from "@mui/material";

const Delete = () => {
    const params = useParams();
    const [progress, setProgress] = useState(false);
    const { showAlert, setMessage, toggles, setToggles, editState } = useContext(ProgTrackingContext);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ id: "", code: "" });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setState((prv) => {
            let newState = { ...prv };
            newState[e.target.name] = e.target.value;
            return newState;
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setProgress(true);
        axios.delete(route("progressTracking.destroy", { "progressTracking": 1, ...state })).then(res => {
            if (res.status == 200) {
                if (res.data.errors) {
                    setErrors(res.data.errors);
                    console.log(res.data.errors);
                } else {
                    setMessage("Delete Successfully!");
                    showAlert(true);
                    hideForm();
                    params.refresh = true;
                    setProgress(false);
                }
            }
        });
    }
    const showForm = () => {
        setOpen(true);
    }
    const hideForm = () => {
        setOpen(false);
        setState({ id: "", code: "" });
        setToggles({ ...toggles, deleteForm: false });
        setErrors({});
        setProgress(false);
    }
    useEffect(() => {
        if (toggles.deleteForm) {
            setState({ ...state, id: editState.id });
            showForm();
        }
    }, [toggles.deleteForm]);
    return (
        <Dialog
            open={open}
            onClose={hideForm}
        >
            <Box sx={{ p: { sm: 2, md: 4 } }}>
                <Typography variant="h6" gutterBottom>Are you sure you want to Delete ?</Typography>
                <TextField
                    fullWidth
                    label="Signatory Code"
                    name="code"
                    type="number"
                    value={state.code}
                    onChange={handleChange}
                    error={(errors && errors.code) ? true : false}
                    helperText={(errors && errors.code) && errors.code.map((e) => e)}
                />
                {progress && <LinearProgress sx={{ my: 1 }} />}
                <Button variant="contained" sx={{ my: 1 }} onClick={handleSubmit}>Delete</Button>
            </Box>
        </Dialog>
    )
}

export default Delete;

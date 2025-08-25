import React, { useState, useEffect, useContext } from "react";
import {
    TextField,
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    ButtonGroup,
    MenuItem,
} from "@mui/material";

import axios from "axios";
import { Error, getFullName } from "../../helpers/helpers.js";
import { Alert } from "../../../context/AlertBar/AlertBar.js";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";

const EditAttendance = forwardRef(({ currentItem, setRefresh }, ref) => {
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    useImperativeHandle(
        ref,
        () => ({
            open: () => setOpen(true),
            close: () => setOpen(false),
        }),
        []
    );
    const [open, setOpen] = React.useState(false);
    const [state, setState] = useState();
    const [errors, setErrors] = useState({});

    const handleSubmit = async () => {
        console.log("submitted");
        try {
            const res = await axios.put(
                route("payroll.attendance.update", { attendance: 1 }),
                state
            );
            if (res.status == 200) {
                setOpen(false);
                setMessage("Update Successfully");
                setSeverity("success");
                showAlert(true);
            }
            if (res.status == 203) {
                setErrors(res.data);
                setMessage("Valiation Errros");
                setSeverity("error");
                showAlert(true);
            }
            console.log(res);
        } catch (error) {
            console.log(error.response);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    useEffect(() => {
        console.log("currentItem", currentItem);
        setState(currentItem);
        // getData();
    }, [currentItem]);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>Edit</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    size="small"
                    name="date"
                    margin="dense"
                    label="Date"
                    value={state?.date || ""}
                    onChange={handleChange}
                    type="date"
                    error={"date" in errors}
                    helperText={<Error errors={errors} name="date" />}
                />
                <TextField
                    fullWidth
                    size="small"
                    name="check_in_time"
                    margin="dense"
                    label="Check in Time"
                    value={state?.check_in_time || ""}
                    onChange={handleChange}
                    type="time"
                    error={"check_in_time" in errors}
                    helperText={<Error errors={errors} name="check_in_time" />}
                />
                <TextField
                    fullWidth
                    size="small"
                    name="check_out_time"
                    margin="dense"
                    label="Check Out Time"
                    value={state?.check_out_time || ""}
                    onChange={handleChange}
                    type="time"
                    error={"check_out_time" in errors}
                    helperText={<Error errors={errors} name="check_out_time" />}
                />
                <TextField
                    id="Attendance-type"
                    fullWidth
                    size="small"
                    name="type"
                    margin="dense"
                    label="Attendance Type"
                    value={state?.type || ""}
                    onChange={handleChange}
                    error={"type" in errors}
                    helperText={<Error errors={errors} name="type" />}
                    select
                >
                    <MenuItem key={"working"} value={"working"}>
                        Working
                    </MenuItem>
                    <MenuItem key={"leave"} value={"leave"}>
                        Leave
                    </MenuItem>
                </TextField>
                <TextField
                    fullWidth
                    size="small"
                    name="isPayable"
                    margin="dense"
                    label="Is-Payable?"
                    value={state?.isPayable || ""}
                    onChange={handleChange}
                    error={"isPayable" in errors}
                    helperText={<Error errors={errors} name="isPayable" />}
                    select
                >
                    <MenuItem key={"yes"} value={"yes"}>
                        yes
                    </MenuItem>
                    <MenuItem key={"no"} value={"no"}>
                        no
                    </MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <ButtonGroup>
                    <Button onClick={() => setOpen(false)}>Close</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Update
                    </Button>
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    );
});
export default React.memo(EditAttendance);

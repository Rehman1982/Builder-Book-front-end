import React, { useState, useEffect, useContext } from "react";
import {
    TextField,
    Typography,
    Box,
    Tooltip,
    IconButton,
    Avatar,
    Dialog,
    Autocomplete,
    Stack,
    Button,
    Collapse,
} from "@mui/material";

import axios from "axios";
import { getFullName } from "../../helpers/helpers.js";
import { Alert } from "../../../context/AlertBar/AlertBar.js";

const CreateAttendance = ({ setRefresh }) => {
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [open, setOpen] = React.useState(false);
    const [employees, setEmployees] = useState([]);
    const [state, setState] = useState({
        check_in_time: "",
        datefrm: "",
        dateto: "",
        employee: {
            id: "",
            firstName: "",
            middleName: "",
            LastName: "",
            schedule: { id: "", start_time: "", end_time: "" },
        },
        schedule: "",
    });
    const [errors, setErrors] = useState({});
    const date = new Date();
    const currentTime = date.getHours() + ":" + date.getMinutes();

    const handleSubmit = async () => {
        try {
            const res = await axios.post(
                route("payroll.attendance.store"),
                state
            );
            console.log(res);
            if (res.status == 200) {
                setState({
                    check_in_time: "",
                    date: "",
                    employee: {
                        id: "",
                        firstName: "",
                        middleName: "",
                        LastName: "",
                        schedule: { id: "", start_time: "", end_time: "" },
                    },
                    schedule: "",
                });
                setErrors({});
                setOpen(false);
                setEmployees([]);
                setRefresh(true);
            } else if (res.status == 203) {
                console.log(res.data);
                setErrors(res.data.errors);
            }
        } catch (error) {
            console.log(error.response);
            const {
                status,
                data: { message },
            } = error.response;
            if (status == 403) {
                setMessage(message);
                setSeverity("error");
                showAlert(true);
            }
        }
    };

    const handleClose = () => {
        setState({
            check_in_time: "",
            date: "",
            employee: {
                id: "",
                firstName: "",
                middleName: "",
                LastName: "",
                schedule: { id: "", start_time: "", end_time: "" },
            },
            schedule: "",
        });
        setOpen(false);
    };

    const getData = async () => {
        try {
            const response = await axios.get(
                route("payroll.attendance.create")
            );
            if (response.status == 200) {
                // const response = res.data.data;
                console.log(response.data.data);
                setEmployees(response.data.data);
            } else if (response.status == 203) {
                setErrors(response.data.errors);
            }
        } catch (error) {
            const {
                status,
                data: { message },
            } = error.response;
            setMessage(message);
            setSeverity("error");
            showAlert(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    };

    useEffect(() => {
        getData();
    }, [open]);

    return (
        <>
            <Tooltip title="Employee Attendance">
                <IconButton onClick={() => setOpen(true)}>
                    <Avatar>+</Avatar>
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Make Attendance
                    </Typography>
                    <TextField
                        name="datefrm"
                        type="date"
                        value={state.datefrm}
                        onChange={handleChange}
                        label="Start Date"
                        margin="dense"
                        error={"datefrm" in errors}
                        helperText={
                            "datefrm" in errors &&
                            errors.date.length > 0 &&
                            errors.date.map((v) => v)
                        }
                        fullWidth
                    />
                    <TextField
                        name="dateto"
                        type="date"
                        value={state.dateto}
                        onChange={handleChange}
                        label="End Date"
                        margin="dense"
                        error={"dateto" in errors}
                        helperText={
                            "dateto" in errors &&
                            errors.date.length > 0 &&
                            errors.date.map((v) => v)
                        }
                        fullWidth
                    />
                    <Collapse in={Boolean(state.dateto)}>
                        <Autocomplete
                            options={employees}
                            getOptionLabel={(option) =>
                                getFullName(
                                    option.firstName,
                                    option.middleName,
                                    option.LastName
                                )
                            }
                            value={state.employee}
                            onChange={(e, v) =>
                                setState({ ...state, ["employee"]: v })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Select Employee"
                                    margin="dense"
                                />
                            )}
                        />
                    </Collapse>
                    <Collapse in={Boolean(state.employee.id)}>
                        <Typography variant="caption">
                            From: {state.employee.schedule.start_time} To:{" "}
                            {state.employee.schedule.end_time}
                        </Typography>
                        <TextField
                            margin="dense"
                            fullWidth
                            type="time"
                            label="Check In time"
                            name="check_in_time"
                            value={state.check_in_time}
                            inputProps={{
                                min: state.employee.schedule.start_time,
                                max: state.employee.schedule.end_time,
                            }}
                            error={"check_in_time" in errors}
                            onChange={handleChange}
                        />
                    </Collapse>
                    <Stack direction="row" justifyContent="flex-end" my={1}>
                        <Button onClick={handleSubmit} variant="outlined">
                            Checked IN
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </>
    );
};
export default CreateAttendance;

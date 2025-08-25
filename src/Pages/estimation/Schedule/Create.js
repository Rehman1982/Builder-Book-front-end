import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Dialog,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Error } from "../../helpers/helpers";

const Create = (
    { variant, currentSchedule, setCurrentSchedule, setRefresh },
    ref
) => {
    // Define state
    const [schedule, setSchedule] = useState({
        name: "",
        description: "",
        status: "",
    });
    const [errors, setErrros] = useState({});
    const [open, setOpen] = useState(false);
    const hanldeclose = () => {
        setOpen(false);
        setCurrentSchedule({});
    };
    useImperativeHandle(
        ref,
        () => ({
            open: () => {
                setOpen(true);
            },
        }),
        []
    );
    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSchedule((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        const res = await axios.post(
            route("estimation.schedules.store"),
            schedule
        );
        if (res.status == 203) {
            console.log(res);
            setErrros(res.data);
        }
        if (res.status == 200) {
            console.log(res);
            setRefresh(true);
        }
    };
    useEffect(() => {
        if (variant !== "Add") {
            setSchedule(currentSchedule);
        }
    }, [variant, currentSchedule]);
    return (
        <Dialog open={open} onClose={hanldeclose} fullWidth>
            <DialogTitle>Create Schedule</DialogTitle>
            <DialogContent>
                {/* Name Field */}
                <TextField
                    label="Name"
                    name="name"
                    value={schedule.name || ""}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    required
                    margin="dense"
                    error={"name" in errors}
                    helperText={<Error errors={errors} name="name" />}
                />

                {/* Description Field */}
                <TextField
                    label="Description"
                    name="description"
                    value={schedule.description || ""}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    margin="dense"
                    error={"description" in errors}
                    helperText={<Error errors={errors} name="description" />}
                />

                {/* Status Field */}
                <TextField
                    label="Status"
                    name="status"
                    value={schedule.status || ""}
                    onChange={handleChange}
                    select
                    variant="outlined"
                    fullWidth
                    required
                    margin="dense"
                    error={"status" in errors}
                    helperText={<Error errors={errors} name="status" />}
                >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="1">Active</MenuItem>
                    <MenuItem value="0">In-Active</MenuItem>
                </TextField>

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Save Schedule
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default forwardRef(Create);

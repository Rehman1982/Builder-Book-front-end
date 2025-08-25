import {
    Alert,
    Box,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    Grid,
    Typography,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export const ViewAttendance = ({ data }) => {
    const [open, setOpen] = useState(false);
    useEffect(() => {
        if (data !== null) {
            setOpen(true);
            console.log(data);
        }
    }, [data]);
    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
            {data && card(data)}
        </Dialog>
    );
};
const card = (data) => {
    const d = data.attendenceDetails;
    if (data.attendenceDetails) {
        return (
            <Card>
                <CardHeader title={data.status} />
                <CardContent sx={{ paddingX: 5 }}>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            Date
                        </Grid>
                        <Grid item sm={6}>
                            {d.date}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            Schedule
                        </Grid>
                        <Grid item sm={6}>
                            {d.schedule.start_time} / {d.schedule.end_time}
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item sm={6}>
                            Check In/Out Time
                        </Grid>
                        <Grid item sm={6}>
                            {d.check_in_time} / {d.check_out_time}
                        </Grid>
                    </Grid>
                    {d.type == "leave" && (
                        <>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    Type
                                </Grid>
                                <Grid item sm={6}>
                                    {d.type}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    Payable
                                </Grid>
                                <Grid item sm={6}>
                                    {d.isPayable}
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item sm={6}>
                                    Leave Type
                                </Grid>
                                <Grid item sm={6}>
                                    {d.leave_type.title}
                                </Grid>
                            </Grid>
                        </>
                    )}
                </CardContent>
            </Card>
        );
    }
};

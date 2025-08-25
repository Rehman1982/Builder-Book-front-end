import {
    Typography,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    TableFooter,
    Dialog,
    Button,
    DialogContent,
    DialogTitle,
    Grid,
    Paper,
} from "@mui/material";
import { blue, grey, pink, teal } from "@mui/material/colors";
import axios from "axios";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";

import moment from "moment";
import { round } from "lodash";

const Attendances = forwardRef(
    ({ attendances, setAttendences, year, month }, ref) => {
        useImperativeHandle(
            ref,
            () => ({
                show: () => setOpen(true),
                hide: setOpen(false),
            }),
            []
        );
        const [open, setOpen] = useState(false);
        let totalDH = [];
        return (
            <>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>Attendances</DialogTitle>
                    <DialogContent>
                        <Grid
                            container
                            p={1}
                            justifyContent="flex-start"
                            bgcolor={blue[300]}
                            component={Paper}
                            elevation={3}
                        >
                            <Grid item xs={2}>
                                Date
                            </Grid>
                            <Grid item xs={4}>
                                Project
                            </Grid>
                            <Grid item xs={1.5}>
                                In
                            </Grid>
                            <Grid item xs={1.5}>
                                Out
                            </Grid>
                            <Grid xs={1.5}>Earned HRs</Grid>
                            <Grid xs={1.5}>Nature</Grid>
                        </Grid>
                        <>
                            {generateMonthDates(year, month)?.map((dt) => {
                                return AttData(attendances, dt, totalDH);
                            })}
                        </>
                        <Grid
                            container
                            p={1}
                            justifyContent="flex-start"
                            bgcolor={blue[300]}
                            component={Paper}
                            elevation={3}
                        >
                            <Grid item xs={9}>
                                Total Earned Hours
                            </Grid>
                            <Grid xs={3}>
                                {round(
                                    totalDH.reduce((t, c, i) => (t = t + c), 0),
                                    2
                                )}
                            </Grid>
                        </Grid>
                        {/* </TableBody>
                            <TableFooter>
                                <TableCell
                                    colSpan={4}
                                    children="Total Duty Hours"
                                />
                                <TableCell>
                                    
                                </TableCell>
                                <TableCell />
                            </TableFooter>
                        </Table> */}
                        {/* </TableContainer> */}
                        {/* </Paper> */}
                    </DialogContent>
                </Dialog>
            </>
        );
    }
);

export default Attendances;

function generateMonthDates(year, month) {
    let dates = [];
    let daysInMonth = new Date(year, month, 0).getDate(); // Get the last day of the month

    for (let day = 1; day <= daysInMonth; day++) {
        let formattedDay = day.toString().padStart(2, "0"); // Ensure two-digit day
        let formattedMonth = month.toString().padStart(2, "0"); // Ensure two-digit month
        dates.push(`${year}-${formattedMonth}-${formattedDay}`);
    }

    return dates;
}

const AttData = (array, date, totalDH) => {
    const v = array.find((attenDate) => attenDate.date == date);
    totalDH.push(round(timeDiff(v?.check_in_time, v?.check_out_time)) || 0);

    return v ? (
        <Grid
            container
            p={1}
            justifyContent="flex-start"
            alignItems="center"
            borderBottom={1}
            borderColor={grey[200]}
            component={Paper}
            elevation={3}
            bgcolor={
                v?.isPayable == "no"
                    ? pink[200]
                    : v.type == "leave"
                    ? teal[100]
                    : ""
            }
        >
            <Grid item xs={2}>
                <Typography>{date}</Typography>
                <Typography>{getDayName(date)}</Typography>
            </Grid>
            <Grid item xs={4}>
                {v?.project?.name}
            </Grid>
            <Grid item xs={1.5}>
                <Typography variant="subtitle1">{v?.check_in_time}</Typography>
            </Grid>
            <Grid item xs={1.5}>
                <Typography variant="subtitle1">{v?.check_out_time}</Typography>
            </Grid>

            <Grid item xs={1.5}>
                {round(timeDiff(v?.check_in_time, v?.check_out_time))}
            </Grid>
            <Grid item xs={1.5}>
                <Typography noWrap>
                    {v?.paid == 1 ? "Paid" : "Un-Paid"}
                </Typography>
            </Grid>
        </Grid>
    ) : (
        <Grid
            container
            p={1}
            justifyContent="flex-start"
            alignItems="center"
            borderBottom={1}
            borderColor={grey[200]}
            bgcolor={pink[500]}
            component={Paper}
            elevation={3}
            color={grey[50]}
        >
            <Grid item xs={2}>
                <Typography>{date}</Typography>
                <Typography>{getDayName(date)}</Typography>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="body1"> Found Absent</Typography>
            </Grid>
        </Grid>
    );
};

const timeDiff = (checkin, checkout) => {
    const t1 = moment(checkin, "HH:mm");
    const t2 = moment(checkout, "HH:mm");
    const diffinM = t2.diff(t1, "minutes");
    return round(diffinM / 60, 2);
};

const getDayName = (date) => {
    const date1 = new Date(`${date}`);
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return days[date1.getDay()];
};

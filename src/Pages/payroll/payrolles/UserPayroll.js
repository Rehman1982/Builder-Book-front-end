import { ExpandLessOutlined } from "@mui/icons-material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import {
    Box,
    ListItem,
    ListItemText,
    Typography,
    List,
    TableContainer,
    Table,
    TableRow,
    TableCell,
    TableHead,
    TableBody,
    TableFooter,
    Paper,
    Dialog,
    Avatar,
    Button,
    Divider,
    IconButton,
    Modal,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    Tooltip,
} from "@mui/material";
import {
    amber,
    blue,
    blueGrey,
    green,
    grey,
    lightGreen,
    pink,
    teal,
} from "@mui/material/colors";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import { round } from "lodash";
import FixedAllowances from "./FixedAllowances";
import NonFixedAllowances from "./NonFixedAllowances";
import Attendances from "./Attendences";
import Taxes from "./Taxes";

export const UserPayroll = () => {
    const location = useLocation();
    const { id, year, month } = location.state || {};
    const AttendanceRef = useRef();
    const params = useParams();
    const [attendances, setAttendences] = useState([]);
    const [state, setState] = useState({
        FullName: "",
        designation: "",
        employeeSince: "",
        basicPay: 0,
        attendanceHours: 0,
        Payroll_period: "",
        perHourRate: 0,
        dutyHours: 0,
        payAbleBasiPay: 0,
        fixedallowances: [],
        fixedallowancesTotal: 0,
        nonfixedallowances: [],
        nonfixedallowancesTotal: 0,
        deductions: [],
        deductionsTotal: 0,
        nonDutyHours: 0,
    });
    const [totals, setTotals] = useState(0);
    const getPayrollData = async () => {
        const res = await axios.get(
            route(`payroll.payroll.show`, { payroll: id }),
            {
                params: { type: "data", year: year, month: month },
            }
        );
        if (res.status == 200) {
            console.log(res.data);
            setState(res.data);
            setAttendences(res.data.attendences);
        }
    };
    useEffect(() => {
        console.log(year, month);
        getPayrollData();
    }, [year]);
    return (
        <>
            <Attendances
                ref={AttendanceRef}
                attendances={attendances}
                setAttendences={setAttendences}
                year={year}
                month={month}
            />
            <Box sx={{ p: 3 }}>
                <Header state={state} AttendanceRef={AttendanceRef} />
                <Contents state={state} />
            </Box>
        </>
    );
};

const Header = ({ state, AttendanceRef }) => {
    return (
        <>
            <Box mb={3}>
                <Typography variant="h5" textAlign="center">
                    Respak PVT (LTD)
                </Typography>
                <Typography variant="body1" textAlign="center">
                    Monthly Salary Statement
                </Typography>
                <Typography variant="body1" textAlign="center">
                    ({state.Payroll_period})
                </Typography>
            </Box>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                columns={5}
                mb={2}
            >
                <Grid item xs={1}>
                    <HeaderItem title="Name" value={state.FullName} />
                </Grid>
                <Grid item xs={1}>
                    <HeaderItem title="Designation" value={state.designation} />
                </Grid>
                <Grid item xs={1}>
                    <HeaderItem
                        title="Employee Since"
                        value={state.employeeSince}
                    />
                </Grid>
                <Grid item xs={1}>
                    <HeaderItem
                        title="Total Duty HRs"
                        value={state.attendanceHours}
                    />
                </Grid>
                <Grid item xs={1}>
                    <HeaderItem
                        title="Earned HRs"
                        value={
                            <Typography
                                color={blue[900]}
                                fontWeight={700}
                                sx={{
                                    cursor: "pointer",
                                }}
                                onClick={() => AttendanceRef.current.show()}
                                children={state.dutyHours}
                            />
                        }
                    />
                </Grid>
            </Grid>
        </>
    );
};

const Contents = ({ state }) => {
    return (
        <>
            <Grid
                container
                alignItems="center"
                p={2}
                component={Paper}
                elevation={3}
                bgcolor={blue[200]}
            >
                <Grid item xs={6}>
                    Desp
                </Grid>
                <Grid item xs={1.5}>
                    Total
                </Grid>
                <Grid item xs={1.5}>
                    PH/Rate
                </Grid>
                <Grid item xs={1.5}>
                    Amount
                </Grid>
                <Grid item xs={1.5}>
                    GTotal
                </Grid>
            </Grid>
            <Grid
                container
                alignItems="center"
                p={2}
                component={Paper}
                elevation={3}
            >
                <Grid item xs={6}>
                    Pay
                </Grid>
                <Grid item xs={1.5}>
                    {state.basicPay}
                </Grid>
                <Grid item xs={1.5}>
                    {state.perHourRate}
                </Grid>
                <Grid item xs={1.5}>
                    {round(state.payAbleBasiPay, 0)}
                </Grid>
                <Grid item xs={1.5}>
                    {round(state.payAbleBasiPay, 0)}
                </Grid>
            </Grid>
            <FixedAllowances state={state} />
            <NonFixedAllowances state={state} />
            <Taxes state={state} />
            <Footer state={state} />
        </>
    );
};
const Footer = ({ state }) => {
    return (
        <Grid
            container
            alignItems="center"
            p={2}
            component={Paper}
            elevation={3}
            bgcolor={lightGreen[800]}
            color={grey[50]}
        >
            <Grid item xs={10.5}>
                Net Payable Amount
            </Grid>
            <Grid item xs={1.5}>
                {round(
                    state.nonfixedallowancesTotal +
                        state.fixedallowancesTotal +
                        state.payAbleBasiPay -
                        state.deductionsTotal,
                    0
                )}
            </Grid>
        </Grid>
    );
};

const HeaderItem = ({ title, value }) => (
    <Stack
        direction="column"
        component={Paper}
        elevation={5}
        p={2}
        m={0.2}
        justifyContent="center"
        alignItems="center"
        bgcolor={lightGreen[50]}
    >
        <Typography variant="body1" gutterBottom>
            {title}
        </Typography>
        <Typography variant="body1"> {value}</Typography>
    </Stack>
);

import { CheckBox, SevenK } from "@mui/icons-material";
import {
    List as LI,
    ListItemText,
    Stack,
    Typography,
    Avatar,
    Tabs,
    Tab,
    Button,
    FormControlLabel,
    Box,
    Autocomplete,
    TextField,
    AvatarGroup,
    Grid,
    Paper,
    Fade,
    IconButton,
} from "@mui/material";
import { grey, lightGreen, orange } from "@mui/material/colors";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect, useState, useContext } from "react";
import { Link, NavLink, useNavigate, useNavigation } from "react-router-dom";
import Checkbox from "@mui/material/Checkbox";
import { Alert } from "../../../context/AlertBar/AlertBar";
import { Error, getFullName } from "../../helpers/helpers";
import { auto } from "@popperjs/core";
import PaySalary from "./PaySalary";

export const PayrolList = () => {
    const currentYear = new Date().getFullYear();
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [uppaid, setUnPaid] = useState([]);
    const [paid, setPaid] = useState([]);
    const [selected, setSelected] = useState([]);
    const [activeTab, setActiveTab] = useState(1);
    const [code, setCode] = useState("");
    const [req, setReq] = useState({ year: `${currentYear}`, month: "" });
    const lastFiveYears = Array.from(
        { length: 5 },
        (_, index) => `${currentYear - index}`
    );
    const [errors, setErrors] = useState({});

    const getPayrolls = async () => {
        try {
            const res = await axios.get(
                route("payroll.payroll.index", { type: "data" }),
                { params: req }
            );
            if (res.status == 200) {
                console.log(res.data);
                setUnPaid(res.data.unpaid);
                setPaid(res.data.paid);
            }
            if (res.status == 203) {
                setMessage(res.data.message);
                showAlert(true);
                setSeverity("error");
            }
        } catch (error) {
            console.log(error.response);
        }
    };
    useEffect(() => {
        getPayrolls();
    }, [req]);
    return (
        <>
            <Stack
                sx={{ my: 2 }}
                direction={"row"}
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h5" gutterBottom>
                    PAYROLL
                </Typography>
                <Autocomplete
                    freeSolo
                    sx={{ width: "40%" }}
                    options={lastFiveYears}
                    value={req.year}
                    onChange={(e, v) => setReq({ ...req, year: v })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Year"
                            size="medium"
                            sx={{ padding: "0" }}
                            error={"year" in errors}
                            helperText={<Error errors={errors} name="year" />}
                        />
                    )}
                />
            </Stack>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
                <Tab label={"Payrolls"} value={1} />
                <Tab label={"Generate"} value={0} />
            </Tabs>
            <Box sx={{ mt: 1 }}>
                {/* generate */}
                <TabList value={activeTab} index={0}>
                    <Unpaid
                        uppaid={uppaid}
                        selected={selected}
                        setSelected={setSelected}
                        req={req}
                        setReq={setReq}
                        code={code}
                        setCode={setCode}
                        errors={errors}
                        setErrors={setErrors}
                        refresh={getPayrolls}
                    />
                </TabList>
                {/* payrolls */}
                <TabList value={activeTab} index={1}>
                    <Paid paid={paid} req={req} />
                </TabList>
            </Box>
        </>
    );
};

const TabList = (props) => {
    return props.value === props.index && <>{props.children}</>;
};

const Unpaid = ({
    uppaid,
    selected,
    setSelected,
    req,
    setReq,
    errors,
    setErrors,
    code,
    setCode,
    refresh,
}) => {
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { ...req, ids: selected, code: code };
            console.log(data);
            const res = await axios.post(route("payroll.payroll.store"), data);
            if (res.status == 200) {
                setErrors({});
                console.log(res.data);
                setSelected([]);
                refresh();
            }
            if (res.status == 203) {
                console.log(res);
                setErrors(res.data);
            }
        } catch (error) {
            console.log(error.response);
        }
    };
    const [show, setShow] = useState(false);
    useEffect(() => {
        if (selected.length > 0) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [selected]);
    return (
        <>
            <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                p={2}
                mb={0.5}
                component={Paper}
                elevation={3}
                bgcolor={grey[200]}
            >
                <Grid item xs={auto} px={1}>
                    <FormControlLabel
                        label="Select All"
                        control={
                            <Checkbox
                                size="large"
                                checked={
                                    selected.length == uppaid.length
                                        ? true
                                        : false
                                }
                                onChange={(e, check) => {
                                    if (check) {
                                        let a = [...uppaid];
                                        const b = a.map((v, i) => v.id);
                                        setSelected(b);
                                    } else {
                                        setSelected([]);
                                    }
                                }}
                            />
                        }
                    />
                </Grid>

                <Grid component={Fade} in={show} item xs={4} px={1}>
                    <Autocomplete
                        options={months}
                        value={req.month}
                        onChange={(e, v) => setReq({ ...req, month: v })}
                        renderInput={(params) => (
                            <TextField
                                fullWidth
                                {...params}
                                label="Month"
                                size="small"
                                sx={{ padding: "0" }}
                                // error={"month" in errors}
                            />
                        )}
                    />
                </Grid>
                <Grid component={Fade} in={show} item xs={4} px={1}>
                    <TextField
                        fullWidth
                        size="small"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        label="Signatory Code"
                        // error={"year" in errors}
                        // helperText={<Error errors={errors} name="code" />}
                        required
                    />
                </Grid>
                <Grid component={Fade} in={show} item xs={2} px={1}>
                    <Button
                        fullWidth
                        onClick={handleSubmit}
                        variant="contained"
                        margin="dense"
                    >
                        Generate
                    </Button>
                </Grid>
            </Grid>
            <Box maxHeight={600} overflow={auto}>
                {uppaid.map((v, i) => (
                    <Grid
                        container
                        justifyContent="flex-start"
                        alignItems="center"
                        p={1}
                        mb={0.5}
                        component={Paper}
                        elevation={3}
                        key={v.id}
                    >
                        <Grid item xs={1}>
                            <Checkbox
                                size="large"
                                checked={selected.includes(v.id) ? true : false}
                                onChange={(e, check) => {
                                    if (check) {
                                        setSelected([...selected, v.id]);
                                    } else {
                                        const unsel = selected.filter(
                                            (a) => a !== v.id
                                        );
                                        setSelected(unsel);
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <ListItemText
                                primary={getFullName(
                                    v.firstName,
                                    v.middleName,
                                    v.LastName
                                )}
                                secondary={v.desig}
                            />
                        </Grid>
                        <Grid item xs={9}>
                            <AvatarGroup>
                                {v.attendance.map((a, i) => (
                                    <Avatar
                                        key={i}
                                        component={IconButton}
                                        size="small"
                                        onClick={() =>
                                            navigate(`view`, {
                                                state: {
                                                    id: v.id,
                                                    year: a.Year,
                                                    month: a.Month,
                                                },
                                            })
                                        }
                                    >
                                        {`${a.Month}`}
                                    </Avatar>
                                ))}
                            </AvatarGroup>
                        </Grid>
                    </Grid>
                ))}
            </Box>
        </>
    );
};
const Paid = ({ paid, req }) => {
    const SalaryPaymentForm = useRef();
    const [payrollId, setPayrollId] = useState();
    const SalaryPay = (ID) => {
        setPayrollId(ID);
        SalaryPaymentForm.current.open();
    };
    return (
        <>
            <PaySalary ref={SalaryPaymentForm} payroll_id={payrollId || ""} />
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                columns={15}
                component={Paper}
                elevation={3}
                p={1}
                mb={1}
                spacing={0.5}
            >
                <Grid item xs={1}></Grid>
                <Grid item xs={2} pr={1}></Grid>
                {months.map((month) => (
                    <Grid item xs={1} px={1}>
                        {month}
                    </Grid>
                ))}
            </Grid>
            {paid.map((v, i) => (
                <Grid
                    container
                    justifyContent="flex-start"
                    alignItems="center"
                    key={v.id}
                    columns={15}
                    component={Paper}
                    elevation={3}
                    p={1}
                    mb={1}
                    spacing={0.5}
                >
                    <Grid item xs={1} padding="checkbox">
                        <Avatar>{i + 1}</Avatar>
                    </Grid>
                    <Grid item xs={2} pr={1}>
                        <Typography variant="body1" noWrap>
                            {getFullName(v.firstName, v.middleName, v.LastName)}
                        </Typography>
                        <Typography variant="body2" noWrap>
                            {v.desig}
                        </Typography>
                    </Grid>
                    {months.map((name, index) => (
                        <Grid item xs={1} px={1} justifyContent="center">
                            <IsPayable
                                SalaryPay={SalaryPay}
                                data={v.attendance.find(
                                    (atn) => atn.Month == index + 1
                                )}
                            />
                        </Grid>
                    ))}
                </Grid>
            ))}
        </>
    );
};

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const IsPayable = ({ data, SalaryPay }) => {
    const navigate = useNavigate();
    const [text, setText] = useState("Click to Pay");
    if (data)
        return (
            <>
                {data.payroll_id && (
                    <Stack
                        direction="column"
                        alignItems="center"
                        justifyContent="space-between"
                        component={Paper}
                        elevation={3}
                        border={0.5}
                        borderColor={grey[200]}
                    >
                        {data.payrolls_paid && (
                            <CustomButton
                                onClick={() =>
                                    navigate(`view`, {
                                        state: {
                                            id: data.employee_id,
                                            year: data.Year,
                                            month: data.Month,
                                        },
                                    })
                                }
                                size="small"
                                sx={{
                                    bgcolor: lightGreen[400],
                                    fontWeight: 700,
                                }}
                                text={data.payrolls_paid?.payableAmount}
                                hoveredtext="View"
                            />
                        )}
                        {data.payrolls_pending && (
                            <CustomButton
                                text={data.payrolls_pending?.payableAmount || 0}
                                size="small"
                                sx={{ bgcolor: orange[400], fontWeight: 700 }}
                                onClick={() => SalaryPay(data.payroll_id)}
                                hoveredtext="Pay"
                            />
                        )}
                    </Stack>
                )}
            </>
        );
};

const CustomButton = (props) => {
    const [innerText, setInnerText] = useState(props.text);
    return (
        <Button
            onMouseEnter={() => setInnerText(props.hoveredtext)}
            onMouseLeave={() => setInnerText(props.text)}
            {...props}
        >
            {innerText}
        </Button>
    );
};

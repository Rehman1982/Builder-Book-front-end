import React, { useState, useEffect, useContext } from "react";
import {
    Container,
    TextField,
    Grid,
    Typography,
    List,
    ListItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    ListItemText,
    Box,
    Tooltip,
    IconButton,
    Avatar,
    Dialog,
    Autocomplete,
    Stack,
    Button,
    ListItemAvatar,
    LinearProgress,
    Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { getFullName, getYears, getMonths } from "../../helpers/helpers.js";
import { Schedule } from "@mui/icons-material";
import { green, grey } from "@mui/material/colors";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Alert } from "../../../context/AlertBar/AlertBar.js";
import { CollectionsSharp } from "@mui/icons-material";
import CreateAttendance from "./CreateAttendance.js";
import EditAttendance from "./EditAttendance.js";
import { useRef } from "react";
import { useCallback } from "react";

const Attendence = () => {
    const Editform = useRef();
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [data, setData] = useState([]);
    const [schedules, setschedules] = useState([]);
    const [officeLocations, setOfficeLocations] = useState([]);
    const [isBusy, setIsBusy] = useState(false);
    const [currentItem, setCurrentItem] = useState({});
    const [dateFilter, setDateFilter] = useState({
        month: null,
        year: null,
        from_date: null,
        to_date: null,
    });

    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        projectId: "",
        schedule: null,
        officelocation: null,
    });

    const [attendanceFilters, setAttendanceFilters] = useState({
        date: "",
        project: "",
    });

    const getData = async (params) => {
        setIsBusy(true);
        try {
            const response = await axios.get(
                route("payroll.attendance.index", { type: "data" }),
                { params }
            ); // Replace with your API endpoint
            const {
                status,
                data: { attendance, offLocation, schedules },
            } = response;
            if (status == 200) {
                setData(attendance);
                setschedules(schedules);
                setOfficeLocations(offLocation);
                setIsBusy(false);
            }
            if (status == 203) {
                setMessage("Invalid Request monitored");
                setSeverity("error");
                showAlert(true);
                setIsBusy(false);
            }
        } catch (error) {
            const {
                status,
                data: { message },
            } = error.response;
            if (status == 403) {
                setMessage(message);
                setSeverity("error");
                showAlert(true);
                setIsBusy(false);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = { type: "data" };
                await getData();
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const { month, year } = dateFilter;
        (async () => {
            if (month && year) {
                const params = { month: month.name, year: year };
                await getData(params);
            } else if (month == null && year == null) {
                await getData();
            }
        })();
    }, [dateFilter.month, dateFilter.year]);

    useEffect(() => {
        const { to_date, from_date } = dateFilter;
        (async () => {
            if (to_date && from_date) {
                const params = { to_date: to_date, from_date: from_date };
                const filteredData = await axios.get(
                    route("payroll.attendance.index"),
                    { params }
                ); // Replace with your API endpoint
                console.log(filteredData);
                setData(filteredData.data.data);
            } else if (to_date == "" && from_date == "") {
                await getData();
            }
        })();
    }, [dateFilter.to_date, dateFilter.from_date]);

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    const handleAttendanceChange = (e) => {
        setAttendanceFilters({
            ...attendanceFilters,
            [e.target.name]: e.target.value,
        });
    };

    const filteredData = data.filter((item) => {
        return item.attendance.some(
            (att) =>
                (!filters.firstName ||
                    item.firstName
                        .toLowerCase()
                        .includes(filters.firstName.toLowerCase())) &&
                (!filters.lastName ||
                    item.LastName.toLowerCase().includes(
                        filters.lastName.toLowerCase()
                    )) &&
                (filters.schedule == null ||
                    item.schedule.id == filters.schedule.id) &&
                (filters.officelocation == null ||
                    item.office_location.id == filters.officelocation.id)
            // (!filters.projectId || att.project_id === parseInt(filters.projectId))
        );
    });
    const handleEdit = useCallback((attendanceItem) => {
        setCurrentItem(attendanceItem);
        Editform.current.open();
    }, []);
    const currentDate = new Date().toISOString().split("T")[0]; // Get the current date in 'YYYY-MM-DD' format

    return (
        <Container>
            <EditAttendance
                ref={Editform}
                setRefresh=""
                currentItem={currentItem}
            />
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h5">Attendance</Typography>
                <CreateAttendance />
            </Stack>
            <Box sx={{ height: 10 }}>{isBusy && <LinearProgress />}</Box>
            <Grid container spacing={1}>
                <Grid item sm={12} md={4}>
                    <Grid item sm={12} marginBottom={1}>
                        <Autocomplete
                            fullWidth
                            options={getYears(5, "last")}
                            getOptionLabel={(option) => `${option}`}
                            value={dateFilter.year}
                            onChange={(event, value) => {
                                setDateFilter({ ...dateFilter, year: value });
                            }}
                            renderInput={(option) => (
                                <TextField
                                    {...option}
                                    label="Year"
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sm={12}>
                        <Autocomplete
                            fullWidth
                            options={getMonths()}
                            getOptionLabel={(option) => option.name}
                            value={dateFilter.month}
                            onChange={(event, value) => {
                                setDateFilter({ ...dateFilter, month: value });
                            }}
                            renderInput={(option) => (
                                <TextField
                                    {...option}
                                    label="Month"
                                    size="small"
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Grid item sm={12} md={8}>
                    <Grid container spacing={1} mb={1}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="From"
                                variant="outlined"
                                name="from_date"
                                type="date"
                                value={dateFilter.from_date || ""}
                                onChange={(e) =>
                                    setDateFilter({
                                        ...dateFilter,
                                        from_date: e.target.value,
                                    })
                                }
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="To"
                                variant="outlined"
                                name="to_date"
                                type="date"
                                value={dateFilter.to_date || ""}
                                onChange={(e) =>
                                    setDateFilter({
                                        ...dateFilter,
                                        to_date: e.target.value,
                                    })
                                }
                                size="small"
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} mb={1}>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="First Name"
                                variant="outlined"
                                name="firstName"
                                value={filters.firstName}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                label="Last Name"
                                variant="outlined"
                                name="lastName"
                                value={filters.lastName}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Autocomplete
                                fullWidth
                                options={officeLocations}
                                getOptionLabel={(option) => option.name}
                                value={filters.officelocation}
                                onChange={(event, value) => {
                                    setFilters({
                                        ...filters,
                                        officelocation: value,
                                    });
                                }}
                                renderInput={(option) => (
                                    <TextField
                                        {...option}
                                        label="Office"
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Autocomplete
                                fullWidth
                                options={schedules}
                                getOptionLabel={(option) => option.title}
                                value={filters.schedule}
                                onChange={(event, value) => {
                                    setFilters({
                                        ...filters,
                                        schedule: value,
                                    });
                                }}
                                renderInput={(option) => (
                                    <TextField
                                        {...option}
                                        label="Schedule"
                                        size="small"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <List>
                {filteredData.map((employee) => {
                    const hasCurrentDate = employee.attendance.some(
                        (att) => att.date === currentDate
                    );
                    const filteredAttendance = employee.attendance.filter(
                        (att) =>
                            (!attendanceFilters.date ||
                                att.date === attendanceFilters.date) &&
                            (!attendanceFilters.project ||
                                att.project.name
                                    .toLowerCase()
                                    .includes(
                                        attendanceFilters.project.toLowerCase()
                                    ))
                    );
                    // item.LastName.toLowerCase().includes(filters.lastName.toLowerCase()))
                    return (
                        <Accordion key={employee.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls={`panel-${employee.id}-content`}
                                id={`panel-${employee.id}-header`}
                            >
                                <ListItemText
                                    primary={`${getFullName(
                                        employee.firstName,
                                        employee.middleName,
                                        employee.LastName
                                    )}`}
                                    // secondary={ }
                                    primaryTypographyProps={{
                                        style: {
                                            color: hasCurrentDate
                                                ? "inherit"
                                                : "red", // Conditionally set the color to red
                                        },
                                    }}
                                />
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{ backgroundColor: green[100] }}
                            >
                                <Box sx={{ marginBottom: 2 }}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Date"
                                                variant="outlined"
                                                name="date"
                                                value={attendanceFilters.date}
                                                onChange={
                                                    handleAttendanceChange
                                                }
                                                type="date"
                                                size="small"
                                                fullWidth
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Project"
                                                variant="outlined"
                                                name="project"
                                                size="small"
                                                value={
                                                    attendanceFilters.project
                                                }
                                                onChange={
                                                    handleAttendanceChange
                                                }
                                                fullWidth
                                                SelectProps={{
                                                    native: true,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                                <List>
                                    {filteredAttendance.map((att, i) => (
                                        <ListItem key={att.id}>
                                            <ListItemAvatar>
                                                <Avatar>{i + 1}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`Date: ${att.date}`}
                                                secondary={`Project: ${att.project.name}, Check-In: ${att.check_in_time}, Check-Out: ${att.check_out_time}`}
                                            />
                                            <Button
                                                onClick={() => handleEdit(att)}
                                            >
                                                Edit
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </List>
        </Container>
    );
};
export default Attendence;

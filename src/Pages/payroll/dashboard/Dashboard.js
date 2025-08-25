import React, { PureComponent, useCallback, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Chip,
  Stack,
  CardMedia,
  Typography,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  AppBar,
  IconButton,
  Toolbar,
  Drawer,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  Grid,
  TableContainer,
  Table,
  TableBody,
  TextField,
  styled,
  Autocomplete,
  LinearProgress,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassDisabledIcon from "@mui/icons-material/HourglassDisabled";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import {
  amber,
  green,
  indigo,
  red,
  orange,
  lightGreen,
  yellow,
  pink,
  blue,
} from "@mui/material/colors";
import { Link, NavLink, Outlet } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Layout from "./Layout";
import axios from "axios";
import { getFullName } from "../../helpers/helpers";
import { Schedule } from "@mui/icons-material";
import { ViewAttendance } from "./ViewAttendance";
import moment from "moment";
import API from "../../../api/axiosApi";
const vitalsData = [
  { label: "Total Employees", value: 0, color: "#1976d2" },
  { label: "onTime", value: 0, color: "#2e7d32" },
  { label: "Late", value: 0, color: "#f57c00" },
  { label: "Absent", value: 0, color: "#ff1744" },
  { label: "On Leave", value: 0, color: "#ad1457" },
  { label: "Holiday", value: 0, color: "#e91e63" },
];
const Dashboard = () => {
  const [colors, setColors] = useState([
    { color: "#1976d2" },
    { color: "#f57c00" },
    { color: "#2e7d32" },
    { color: "#6d4c41" },
  ]);
  const [cardData, setCardData] = useState();
  const [employees, setEmployees] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [vitals, setVitals] = useState(vitalsData);
  const [currentItem, setCurrentItem] = useState(null);
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [isLoading, setIsLoading] = useState(false);
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await API.get("payroll.dashboard.index", {
        params: {
          type: "data",
          date: date,
        },
      });
      if (response.status == 200) {
        console.log(response.data.data);
        setEmployees(response.data.data.employee);
        setAttendances(response.data.data.attendence);
        setVitals((prv) => {
          const { vitals } = response.data.data;
          let a = [...prv];
          a[0]["value"] = vitals.total;
          a[1]["value"] = vitals.onTime ? vitals.onTime : 0;
          a[2]["value"] = vitals.Late ? vitals.Late : 0;
          a[3]["value"] = vitals.Absent ? vitals.Absent : 0;
          a[4]["value"] = vitals.onLeave ? vitals.onLeave : 0;
          a[5]["value"] = vitals.holiday ? vitals.holiday : 0;
          return a;
        });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, [date]);
  return (
    <>
      <ViewAttendance data={currentItem} />
      <Vitals data={vitals} />
      <Divider sx={{ my: 3 }} variant="middle" />
      {isLoading && (
        <Grid item xs={12}>
          <LinearProgress />
        </Grid>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper elevation={16} sx={{ padding: 5 }}>
            <Attendances
              show={setCurrentItem}
              status={vitals}
              data={attendances}
              date={date}
              setDate={setDate}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={12}>
          <Paper elevation={16} sx={{ padding: 5 }}>
            <Employees data={employees} />
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;

const Employees = ({ data }) => {
  const [filter, setFilter] = useState({ name: "", schedule: null });
  const filteredData = data.filter(
    (emp) =>
      (!filter.name ||
        (emp.firstName &&
          emp.firstName.toLowerCase().includes(filter.name.toLowerCase())) ||
        (emp.middleName &&
          emp.middleName.toLowerCase().includes(filter.name.toLowerCase())) ||
        (emp.LastName &&
          emp.LastName.toLowerCase().includes(filter.name.toLowerCase()))) &&
      (filter.schedule == null || emp.scheduleId == filter.schedule.id)
  );
  return (
    <Box>
      <Typography
        variant="h5"
        component="div"
        sx={{ marginBottom: 2, fontWeight: "bold" }}
      >
        Active Employees
      </Typography>

      {/* Search Input */}
      <Stack sx={{ flexDirection: "row", marginBottom: 2 }}>
        <TextField
          sx={{ width: "60%" }}
          label="Search by Name"
          variant="outlined"
          name="firstName"
          fullWidth
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />
        <Autocomplete
          sx={{ width: "40%" }}
          options={[
            { id: "8", title: "Morning Shift" },
            { id: "9", title: "Evening Shift" },
            { id: "10", title: "Night Shift" },
          ]}
          value={filter.schedule}
          onChange={(e, v) => setFilter({ ...filter, schedule: v })}
          getOptionLabel={(option) => option.title}
          renderInput={(params) => <TextField {...params} label="Schedule" />}
        />
      </Stack>
      {/* Data Table */}
      <TableContainer component={Paper} sx={{ height: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" fontWeight={550}>
                  ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight={550}>
                  Full Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight={550}>
                  Schedule
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {getFullName(
                      user.firstName,
                      user.middleName,
                      user.LastName
                    )}
                  </TableCell>
                  <TableCell>{user.schedule.title}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
const Attendances = ({ date, setDate, show, status, data }) => {
  const D = new Date();
  const [filter, setFilter] = useState({ name: "", attendance: null });
  // const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const filteredData = data.filter(
    (attn) =>
      (!filter.name ||
        (attn.firstName &&
          attn.firstName.toLowerCase().includes(filter.name.toLowerCase())) ||
        (attn.middleName &&
          attn.middleName.toLowerCase().includes(filter.name.toLowerCase())) ||
        (attn.LastName &&
          attn.LastName.toLowerCase().includes(filter.name.toLowerCase()))) &&
      (!filter.attendance ||
        attn.status.toLowerCase().includes(filter.attendance.toLowerCase()))
  );
  return (
    <Box>
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{ marginBottom: 2, fontWeight: "bold" }}
        >
          Attendance
        </Typography>
        <TextField
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
        />
      </Stack>

      {/* Search Input */}
      <Box
        sx={{
          marginBottom: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ width: "60%" }}
          label="Search by Name"
          variant="outlined"
          fullWidth
          value={filter.name}
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />
        <Autocomplete
          sx={{ width: "40%" }}
          options={["onTime", "late", "Absent", "OnLeave", "Holiday"]}
          value={filter.attendance}
          onChange={(e, v) => {
            setFilter({ ...filter, attendance: v });
          }}
          renderInput={(params) => <TextField {...params} label="Status" />}
        />
      </Box>
      {/* Data Table */}
      <TableContainer component={Paper} sx={{ height: 800 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="body1" fontWeight={550}>
                  Employee Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1" fontWeight={550}>
                  Status
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell sx={{ p: 0 }}>
                    <ListItemButton onClick={() => show(user)}>
                      <ListItem>
                        <ListItemText
                          primary={
                            <Typography variant="body1" fontWeight={550}>
                              {getFullName(
                                user.firstName,
                                user.middleName,
                                user.LastName
                              )}
                            </Typography>
                          }
                          secondary={`Dy-Time:${user.scheduleTime} / Check-In: ${user.check_in_time}`}
                        />
                      </ListItem>
                    </ListItemButton>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={550}
                      children={user.status}
                      color={user.status == "Absent" && red[700]}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
const Vitals = ({ data }) => {
  return (
    <>
      <Box sx={{ textAlign: "left", my: 2 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            letterSpacing: "0.05em",
            color: "#1976d2", // Adjust to your theme color
            textTransform: "uppercase",
            position: "relative",
            display: "inline-block",
            "&::after": {
              content: '""',
              position: "absolute",
              width: "50%",
              height: "4px",
              backgroundColor: "#1976d2", // Adjust to match your theme color
              bottom: "-5px",
              left: "25%",
            },
          }}
        >
          Dashboard
        </Typography>
      </Box>
      <Grid mt={2} container spacing={3}>
        {data.map((item, i) => (
          <Grid item xs={12} sm={4} md={4} key={item.label}>
            <Paper elevation={10}>
              <Card
                sx={{
                  backgroundColor: item.color,
                  color: "#fff",
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {item.value}
                  </Typography>
                  <Typography variant="subtitle1">{item.label}</Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

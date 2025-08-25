import { Box, Divider, ListItem, Typography, List, ListItemText, ListItemAvatar, Avatar, Stack, Tooltip, IconButton, Dialog, Autocomplete, TextField, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { green, grey } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { NavLink, Outlet, Route, Routes } from 'react-router-dom';

export default function Attendence() {
    const [clock, setClock] = useState(null);
    const [attendedEmployees, setAttendedEmployees] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const liveClock = () => {
        setClock(new Date().toLocaleTimeString());
        setTimeout(liveClock, 1000);
    }
    useEffect(() => {
        liveClock();
        axios.get(route("payroll.attendance.index")).then((res) => {
            if (res.status == 200) {
                if (res.data.success) {
                    console.log(res.data.data);
                    setAttendedEmployees(res.data.data);
                    const a = res.data.data[0].check_in_time;
                    const b = res.data.data[0].check_out_time;
                    console.log("diff",
                        (new Date(res.data.data[0].date + " " + b).getTime() - new Date(res.data.data[0].date + " " + a).getTime()) / 1000);
                }
            }
        });
        setRefresh(false);
    }, [refresh])
    return (
        <>
            <Stack color={green[600]} direction="row" alignItems="center" spacing={1} justifyContent="flex-end">
                <AccessTimeIcon />
                <Typography variant='h6'> {clock}</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant='h5'>Attendance</Typography>
                <CreateAttendance setRefresh={setRefresh} />
            </Stack>
            <Stack direction="row" spacing={2} justifyContent="flex-start" alignItems="center">
                <Link to="scdwise">ScheduleWize</Link>
            </Stack>
            <Routes>
                <Route path="/" element={<Outlet />}>
                    <Route path="scdwise" element={<h1>Scheduel Wise Data</h1>} />
                </Route>
            </Routes>
            <Box>
                <List>
                    {attendedEmployees.map((v, i) =>
                        <ListItem key={v.id} divider alignItems='center'>
                            <ListItemAvatar>
                                <Avatar>{i + 1}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={v.employee.firstName + " " + v.employee.middleName + " " + v.employee.LastName}
                                secondary={"Check In Time " + v.check_in_time}
                                primaryTypographyProps={{ fontSize: "1.1rem" }}
                                secondaryTypographyProps={{ fontSize: "1rem" }}
                            />
                            <IconButton>
                                <Avatar
                                    sx={{ backgroundColor: "transparent", border: 1, borderColor: grey[600], color: grey[600] }}
                                >
                                    {Math.round(((new Date(v.date + " " + v.check_out_time).getTime() - new Date(v.date + " " + v.check_in_time).getTime()) / 1000) / 3600)}
                                </Avatar>
                            </IconButton>
                        </ListItem>
                    )}
                </List>
            </Box>
        </>
    )
}
const CreateAttendance = ({ setRefresh }) => {
    const [open, setOpen] = React.useState(false);
    const [employees, setEmployees] = useState([]);
    const [state, setState] = useState({ id: "", firstName: "", middleName: "", LastName: "", check_in_time: "" });
    const date = new Date();
    const currentTime = date.getHours() + ":" + date.getMinutes();
    const handleSubmit = () => {
        axios.post(route("payroll.attendance.store"), state).then((res) => {
            if (res.status == 200) {
                if (res.data.success) {
                    console.log(res.data.data);
                    setState({ id: "", firstName: "", middleName: "", LastName: "", check_in_time: "" })
                    setOpen(false);
                    setEmployees([]);
                    setRefresh(true);
                }
            }
        });
    }
    useEffect(() => {
        axios.get(route("payroll.attendance.create")).then(res => {
            if (res.status == 200) {
                const response = res.data.data;
                console.log(response);
                setEmployees(response);
            }
        }
        );
    }, [open])
    return (
        <>
            <Tooltip title="Employee Attendance">
                <IconButton onClick={() => setOpen(true)}>
                    <Avatar>+</Avatar>
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
            >
                <Box sx={{ p: 3 }}>
                    <Typography variant='h6' gutterBottom>Make Attendance</Typography>
                    <Autocomplete
                        options={employees}
                        getOptionLabel={(option) => option.firstName +
                            " " + option.middleName +
                            " " + option.LastName
                        }
                        value={state}
                        onChange={(e, v) => setState(v)}
                        renderInput={(params) =>
                            <TextField
                                {...params}
                                label="Select Employee"
                                margin='dense'
                            />
                        }
                    />
                    <TextField
                        margin='dense'
                        disabled
                        fullWidth
                        type='time'
                        label="Check In time"
                        name="chek_in_time"
                        defaultValue={currentTime}
                    />
                    <Stack direction="row" justifyContent="flex-end" my={1}>
                        <Button onClick={handleSubmit} variant='outlined'>Checked IN</Button>
                    </Stack>
                </Box>
            </Dialog>
        </>
    )
}
const ScheduleWise = (schedule) => {
    const [state, setState] = useState([]);
    return (
        <h5>Schedule Wise Data</h5>
    )
}


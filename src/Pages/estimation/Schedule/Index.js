import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Button,
    Card,
    CardContent,
    CardActions,
    Grid,
    IconButton,
} from "@mui/material";
import Schedule from "./Create";
import { useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { DeleteForeverRounded, Edit } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import DeleteSchedule from "./Delete";
const Schedules = () => {
    const CreateRef = useRef();

    // State to manage the list of schedules
    const [schedules, setSchedules] = useState([
        // {
        //     name: "MRS-2023",
        //     description: ";alkdjsflsdfjdslf",
        //     status: "Active",
        // },
    ]);
    const [variant, setVariant] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState({
        id: "",
        name: "",
        description: "",
        status: "",
    });
    // CReate UPdate Read Delete Operations
    const CURD = (action, data) => {
        console.log(data);
        if (action == "Edit") {
            setVariant("Edit");
            setCurrentSchedule(data);
            CreateRef.current.open();
        }
        if (action == "View") {
            setVariant("View");
            setCurrentSchedule(data);
            CreateRef.current.open();
        }
        if (action == "Add") {
            setVariant("Add");
            setCurrentSchedule({});
            CreateRef.current.open();
        }
    };
    const getSchedules = async () => {
        try {
            const res = await axios.get(
                route("estimation.schedules.index", { type: "data" })
            );
            if (res.status == 200) {
                setSchedules(res.data);
            }
            // console.log(res);
        } catch (error) {
            console.log(error.response);
        }
    };
    useEffect(() => {
        getSchedules();
    }, []);
    useEffect(() => {
        if (refresh) {
            getSchedules();
            setRefresh(false);
        }
    }, [refresh]);
    return (
        <Box>
            <Button
                onClick={() => {
                    CreateRef.current.open();
                }}
            >
                Create
            </Button>
            <Schedule
                ref={CreateRef}
                variant={variant}
                currentSchedule={currentSchedule}
                setCurrentSchedule={setCurrentSchedule}
                setRefresh={setRefresh}
            />
            <Box sx={{ maxHeight: "100vh", overflow: "auto" }}>
                <Grid container spacing={2}>
                    {schedules.map((schedule, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        {schedule.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {schedule.description}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mt: 1,
                                            fontWeight: "bold",
                                            color: "blue",
                                        }}
                                    >
                                        {schedule?.status == 1
                                            ? "Active"
                                            : "In-Active"}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        component={Link}
                                        to="items"
                                        state={{
                                            scheduleId: schedule.id,
                                            name: schedule.name,
                                        }}
                                        sx={{
                                            border: 1,
                                            borderColor: blue[600],
                                        }}
                                    >
                                        Items
                                    </Button>
                                    <Button
                                        onClick={() => CURD("View", schedule)}
                                        sx={{
                                            border: 1,
                                            borderColor: blue[600],
                                        }}
                                    >
                                        <Edit />
                                    </Button>
                                    <DeleteSchedule
                                        id={schedule.id}
                                        setRefresh={setRefresh}
                                    />
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {schedules.length === 0 && (
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        No schedules available. Add one to get started!
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default Schedules;

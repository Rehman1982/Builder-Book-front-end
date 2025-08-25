import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Typography,
    Button,
    ButtonGroup,
    Dialog,
    TextField,
    Divider,
    duration,
    Tooltip,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteForever from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

import React, { useEffect, useState } from "react";
import { red, orange, pink, lightGreen } from "@mui/material/colors";
import { useContext } from "react";
import { Alert } from "../../../context/AlertBar/AlertBar";

export default function Schedules() {
    const [schedules, setSchedules] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [editId, setEditId] = useState(null);
    const { setMessage, showAlert, setSeverity } = useContext(Alert);
    const getData = async () => {
        try {
            const response = await axios.get(route("payroll.schedule.index"));
            if (response.status == 200) {
                console.log(response.data.data);
                setSchedules(response.data.data);
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
            }
        }
    };
    useEffect(() => {
        setRefresh(false);
        getData();
    }, [refresh]);
    return (
        <Box sx={{ p: 2 }}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="h6">Schedules</Typography>
                <CreateOrEditForm
                    setRefresh={setRefresh}
                    editId={editId}
                    setEditId={setEditId}
                />
            </Stack>
            <List>
                {schedules.map((v, i) => (
                    <ListItem divider key={v.id}>
                        <ListItemAvatar>
                            <Avatar>{i + 1}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={v.title}
                            secondary={v.start_time + "->" + v.end_time}
                        />
                        <RightMenu setEditId={setEditId} id={v.id} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
// same form will be used for Edit
const CreateOrEditForm = ({ setRefresh, editId, setEditId }) => {
    const { setMessage, showAlert, setSeverity } = useContext(Alert);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        id: null,
        title: "",
        start_time: "",
        end_time: "",
    });
    const [errors, setErrors] = useState({});
    const [header, setHeader] = useState("");
    const handleClose = () => {
        setState({ id: null, title: "", start_time: "", end_time: "" });
        setErrors({});
        setOpen(false);
        setEditId(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                route("payroll.schedule.store"),
                state
            );
            if (response.status == 200) {
                setState({ id: null, title: "", start_time: "", end_time: "" });
                setRefresh(true);
                setOpen(false);
                setEditId(null);
            } else if (response.status == 203) {
                console.log(response);
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
    useEffect(() => {
        if (editId !== null) {
            axios
                .get(
                    route("payroll.schedule.edit", { schedule: 1, id: editId })
                )
                .then((res) => {
                    if (res.status == 200) {
                        if (res.data.success) {
                            setHeader("Edit Schedule");
                            setState(res.data.data);
                        } else {
                            console.log(res.data);
                        }
                    }
                });
            setOpen(true);
        } else {
            setHeader("Create Schedule");
        }
    }, [editId]);
    return (
        <>
            <Tooltip title="Create New Schedule">
                <IconButton onClick={() => setOpen(true)}>
                    <Avatar
                        sx={{ backgroundColor: lightGreen[300] }}
                        children={<AddIcon />}
                    />
                </IconButton>
            </Tooltip>
            <Dialog open={open} onClose={handleClose} fullWidth>
                <Box component="form" sx={{ p: 3 }}>
                    <Divider sx={{ mb: 2 }}>
                        <Typography variant="h5">{header}</Typography>
                    </Divider>
                    <TextField
                        required
                        name="title"
                        type="text"
                        label="Title"
                        margin="dense"
                        value={state.title}
                        onChange={(e) =>
                            setState({ ...state, title: e.target.value })
                        }
                        error={"title" in errors}
                        helperText={
                            "title" in errors && errors.title.map((v) => v)
                        }
                        fullWidth
                    />
                    <TextField
                        required
                        name="start_time"
                        type="time"
                        label="Start Time"
                        margin="dense"
                        value={state.start_time}
                        onChange={(e) =>
                            setState({ ...state, start_time: e.target.value })
                        }
                        error={"start_time" in errors}
                        helperText={
                            "start_time" in errors &&
                            errors.start_time.map((v) => v)
                        }
                        fullWidth
                    />
                    <TextField
                        required
                        name="end_time"
                        type="time"
                        label="End Time"
                        margin="dense"
                        value={state.end_time}
                        onChange={(e) =>
                            setState({ ...state, end_time: e.target.value })
                        }
                        error={"end_time" in errors}
                        helperText={
                            "end_time" in errors &&
                            errors.end_time.map((v) => v)
                        }
                        fullWidth
                    />
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        <Button variant="outlined" onClick={handleSubmit}>
                            Submit
                        </Button>
                    </Stack>
                </Box>
            </Dialog>
        </>
    );
};
function RightMenu({ setEditId, id }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleEdit = () => {
        setEditId(id);
    };
    return (
        <>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem
                    key={1}
                    onClick={() => {
                        handleEdit();
                        handleClose();
                    }}
                    divider
                >
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: orange[100] }}>
                            <EditIcon color="warning" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Edit"
                        primaryTypographyProps={{ color: orange[500] }}
                    />
                </MenuItem>
                <MenuItem
                    key={2}
                    onClick={() => {
                        handleClose();
                    }}
                >
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: pink[100] }}>
                            <DeleteForever color="error" />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary="Delete"
                        primaryTypographyProps={{ color: pink[500] }}
                    />
                </MenuItem>
            </Menu>
        </>
    );
}

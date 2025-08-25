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

import React, { useContext, useEffect, useState } from "react";
import { red, orange, pink, lightGreen } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import { Alert } from "../../../context/AlertBar/AlertBar";

export default function Positions() {
    const Navigate = useNavigate();
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [positions, setPositions] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [editId, setEditId] = useState(null);
    const getData = async () => {
        try {
            const response = await axios.get(route("payroll.positions.index"));
            if (response.status == 200) {
                setPositions(response.data.data);
            }
        } catch (error) {
            console.log(error.response);
            if (error.response.status == 403) {
                setMessage(error.response.data.message);
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
                <Typography variant="h6">Positions</Typography>
                <CreateOrEditForm
                    setRefresh={setRefresh}
                    editId={editId}
                    setEditId={setEditId}
                />
            </Stack>
            <List>
                {positions.map((v, i) => (
                    <ListItem divider key={v.id}>
                        <ListItemAvatar>
                            <Avatar>{i + 1}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={v.title} />
                        <RightMenu setEditId={setEditId} id={v.id} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
// same form will be used for Edit
const CreateOrEditForm = ({ setRefresh, editId, setEditId }) => {
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ id: null, title: "" });
    const [errors, setErrors] = useState({});
    const [header, setHeader] = useState("");
    const handleClose = () => {
        setState({ id: null, title: "" });
        setErrors({});
        setOpen(false);
        setEditId(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                route("payroll.positions.store"),
                state
            );
            if (response.status == 200) {
                setState({ id: null, title: "" });
                setRefresh(true);
                setOpen(false);
                setEditId(null);
            } else if (response.status == 203) {
                setErrors(response.data.errors);
            }
        } catch (error) {
            const {
                status,
                data: { message },
            } = error.response;
            if (status == 403) {
                setMessage(message);
                showAlert(true);
                setSeverity("error");
            }
        }
    };
    useEffect(() => {
        if (editId !== null) {
            axios
                .get(
                    route("payroll.positions.edit", { position: 1, id: editId })
                )
                .then((res) => {
                    if (res.status == 200) {
                        if (res.data.success) {
                            setHeader("Edit Position");
                            setState(res.data.data);
                        } else {
                            console.log(res.data);
                        }
                    }
                });
            setOpen(true);
        } else {
            setHeader("Create Position");
        }
    }, [editId]);
    return (
        <>
            <Tooltip title="Create New Position">
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
                        label="Position's Title"
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

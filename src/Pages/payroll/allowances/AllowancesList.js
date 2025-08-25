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
    Autocomplete,
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

export default function AllowancesList() {
    const [allowances, setAllowances] = useState([]);
    const [refresh, setRefresh] = useState(true);
    const [editId, setEditId] = useState(null);
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const getData = async () => {
        try {
            const response = await axios.get(
                route("payroll.allowance.index", { type: "data" })
            );
            if (response.status == 200) {
                console.log(response.data);
                setAllowances(response.data.data);
            } else if (response.status == 203) {
                setSeverity("error");
                setMessage(response.data);
                showAlert(true);
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
                <Typography variant="h6">Allowances</Typography>
                <CreateOrEditForm
                    setRefresh={setRefresh}
                    editId={editId}
                    setEditId={setEditId}
                />
            </Stack>
            <List>
                {allowances.map((v, i) => (
                    <ListItem divider key={v.id}>
                        <ListItemAvatar>
                            <Avatar>{i + 2}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={v.title}
                            secondary={v.fixed == 1 ? "Fixed" : "Non-Fixed"}
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
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        id: null,
        title: "",
        amount: "",
        duration: "",
        fixed: 0,
    });
    const [errors, setErrors] = useState({});
    const [header, setHeader] = useState("");
    const { showAlert, setMessage, setSeverity } = useContext(Alert);

    const handleClose = () => {
        setState({ id: null, title: "", amount: "", duration: "", fixed: 0 });
        setErrors({});
        setOpen(false);
        setEditId(null);
    };
    const handleEdit = () => {};
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                route("payroll.allowance.store"),
                state
            );
            if (response.status == 200) {
                setState({
                    id: null,
                    title: "",
                    amount: "",
                    duration: "",
                    fixed: "",
                });
                setRefresh(true);
                setOpen(false);
                console.log(response.data);
            } else if (response.status == 203) {
                setErrors(response.data.errors);
                // setSeverity("error");
                // setMessage(response.data);
                // showAlert(true);
            }
        } catch (error) {
            const {
                status,
                data: { message },
            } = error.response;
            if (status == 403) {
                setSeverity("error");
                setMessage(message);
                showAlert(true);
            }
        }
    };
    useEffect(() => {
        if (editId !== null) {
            axios
                .get(
                    route("payroll.allowance.edit", {
                        allowance: 1,
                        id: editId,
                    })
                )
                .then((res) => {
                    if (res.status == 200) {
                        if (res.data.success) {
                            setHeader("Edit Allowance");
                            setState(res.data.data);
                        } else {
                            console.log(res.data);
                        }
                    }
                });

            setOpen(true);
        } else {
            setHeader("Create Allowance");
        }
    }, [editId]);
    return (
        <>
            <Tooltip title="Create New Allowance">
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
                        label="Title of Allowance"
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
                    <Autocomplete
                        options={[
                            { fixed: 1, title: "Fixed" },
                            { fixed: 0, title: "Non-fixed" },
                        ]}
                        getOptionLabel={(option) => option.title}
                        value={
                            state.fixed == 1
                                ? { fixed: 1, title: "Fixed" }
                                : { fixed: 0, title: "Non-Fixed" }
                        }
                        onChange={(e, v) => {
                            setState({ ...state, fixed: v.fixed });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Fixed"
                                margin="dense"
                            />
                        )}
                    />
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                    >
                        <ButtonGroup>
                            {editId != null ? (
                                <Button onClick={handleCreate}>
                                    Update Changes
                                </Button>
                            ) : (
                                <Button onClick={handleCreate}>Create</Button>
                            )}
                        </ButtonGroup>
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

import React, { useEffect, useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, MenuItem,
    Avatar,
    AvatarGroup,
    IconButton,
    ButtonBase
} from '@mui/material';
import axios from 'axios';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { grey, pink, yellow } from '@mui/material/colors';

// Sample initial data
const initialData = [
    { id: 1, title: "Paid Leave", no_of_days: 10, nature: "paid" },
    { id: 2, title: "Unpaid Leave", no_of_days: 5, nature: "unpaid" }
];
const baseUrl = "payroll.leaves.entitles";
const Entitlement = () => {
    const [entitles, setEntitles] = useState([]);
    const [current, setCurrent] = useState({ id: null, title: '', no_of_days: '', nature: '' });
    const [currentDelId, setCurrentDelId] = useState(null);

    // Handle delete leave
    const handleDelete = (id) => {
        setEntitles(entitles.filter(leave => leave.id !== id));
    };
    const getData = async () => {
        const response = await axios.get(route(`${baseUrl}.index`), { params: { type: "data" } });
        console.log(response.data);
        if (response.status == 200) {
            setEntitles(response.data);
        }
    }
    useEffect(() => {
        getData();
    }, [])
    return (
        <div>
            <CreateOrEdit
                current={current}
                setCurrent={setCurrent}
            />
            <DeleteComponent
                currentDelId={currentDelId}
                setCurrentDelId={setCurrentDelId}
            />
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: grey[200] }}>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Days / Year</TableCell>
                            <TableCell>Nature</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {entitles.length > 0 && entitles.map((leave) => (
                            <TableRow key={leave.id}>
                                <TableCell>{leave.title}</TableCell>
                                <TableCell>{leave.no_of_days}</TableCell>
                                <TableCell>{leave.nature}</TableCell>
                                <TableCell>
                                    <AvatarGroup spacing={1}>
                                        <Avatar
                                            component={ButtonBase}
                                            sx={{ backgroundColor: yellow[100] }}
                                            onClick={() => setCurrent(leave)}
                                        >
                                            <EditOutlined color="warning" />
                                        </Avatar>
                                        <Avatar
                                            component={ButtonBase}
                                            sx={{ backgroundColor: pink[100] }}
                                            onClick={() => setCurrentDelId(leave.id)}

                                        >
                                            <DeleteOutline color='error' />
                                        </Avatar>
                                    </AvatarGroup>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Create/Edit */}

        </div>
    );
};

export default Entitlement;

const CreateOrEdit = ({ current, setCurrent }) => {
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [errors, setErrors] = useState({});
    // Handle open dialog
    const handleOpen = (leave = null) => {
        setOpen(true);
    };
    // Handle close dialog
    const handleClose = () => {
        setOpen(false);
        setCurrent({ id: null, title: '', no_of_days: '', nature: '' });
        setEditMode(false);
    };
    // Handle form submission for create/edit
    const handleSubmit = async () => {
        const response = await axios.post(route(`${baseUrl}.store`), current);
        if (response.status == 200) {
            handleClose();
        }
        if (response.status == 203) {
            setErrors(response.data.errors);
        }
    };
    useEffect(() => {
        if (current.id !== null) {
            handleOpen();
            setEditMode(true);
        }
    }, [current])
    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add Leave
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Edit' : 'Create'}</DialogTitle>
                <DialogContent dividers>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        name="title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={current.title}
                        onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                        error={"title" in errors}
                        helperText={("title" in errors && errors.title.length > 0) && errors.title.map(e => e)}
                    />
                    <TextField
                        name="no_of_days"
                        margin="dense"
                        label="No. of Days"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={current.no_of_days}
                        onChange={(e) => setCurrent({ ...current, no_of_days: e.target.value })}
                        error={"no_of_days" in errors}
                        helperText={("no_of_days" in errors && errors.no_of_days.length > 0) && errors.no_of_days.map(e => e)}
                    />
                    <TextField
                        name="nature"
                        select
                        margin="dense"
                        label="Nature"
                        fullWidth
                        variant="outlined"
                        value={current.nature}
                        onChange={(e) => setCurrent({ ...current, nature: e.target.value })}
                        error={"nature" in errors}
                        helperText={("nature" in errors && errors.nature.length > 0) && errors.nature.map(e => e)}
                    >
                        <MenuItem value="paid">Paid</MenuItem>
                        <MenuItem value="unpaid">Unpaid</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSubmit} color="primary">{editMode ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const DeleteComponent = ({ currentDelId, setCurrentDelId }) => {
    const [code, setCode] = useState("");
    const [id, setId] = useState("");
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setErrors({});
        setOpen(false);
        setCode("");
        setCurrentDelId(null);
    }
    const hanldeDelete = async () => {
        const response = await axios.delete(route(`${baseUrl}.destroy`, { entitle: "1" }), { params: { code: code, id: id } });
        console.log(response);
        if (response.status == 200) {
            handleClose();
        }
        if (response.status == 203) {
            setErrors(response.data.errors);
        }
    }

    useEffect(() => {
        if (currentDelId !== null) {
            setId(currentDelId);
            handleOpen();

        }
    }, [currentDelId])
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
        >
            <DialogTitle>This action can't be undo.</DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    label='Signatore Code'
                    margin='dense'
                    size='small'
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    error={"code" in errors}
                    helperText={("code" in errors && errors.code.length > 0) && errors.code.map(e => e)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={hanldeDelete} variant='contained'>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, IconButton, Typography,
    Box,
    Autocomplete,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    TableFooter,
    LinearProgress
} from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import BadgeIcon from '@mui/icons-material/Badge';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import { blue, green, grey } from '@mui/material/colors';

const initialData = [
    {
        id: 1,
        name: "Aadam Material Supplier",
        status: "deactive",
        type_id: 64,
        type_name: "24001 : Suppliers Account"
    },
    {
        id: 2,
        name: "Aamir Dadex PVC",
        status: "active",
        type_id: 64,
        type_name: "24001 : Suppliers Account"
    },
    {
        id: 3,
        name: "Adil Associates Cement Supplier",
        status: "deactive",
        type_id: 64,
        type_name: "24001 : Suppliers Account"
    }
];
const SupplierCRUD = () => {
    const [data, setData] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const tableRef = useRef(null);
    const handleEdit = useCallback((item) => {
        setEditItem(item);
    }, [])
    const handleDelete = useCallback((id) => {
        setData(data.filter(item => item.id !== id));
    }, []);
    const getData = async () => {
        if (!hasMore) return;
        setIsLoading(true);
        const response = await axios.get(route("vendors.index"), { params: { type: "data", "page": page } });
        console.log(page);
        if (response.status == 200) {
            const freshData = response.data.data;
            setData(prv => [...prv, ...freshData]);
            if (freshData.length < 100) {
                setHasMore(false);
            }
            setIsLoading(false);
        }
    }
    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
        console.log("scroll Top", scrollTop, "Scroll Height", scrollHeight, "Client Height", clientHeight)
        if (scrollTop + clientHeight >= scrollHeight) {
            setPage(prv => prv + 1);
        }
    };
    useEffect(() => {
        // getData();
        tableRef.current.addEventListener('scroll', handleScroll);
        return () => {
            // Clean up the event listener on component unmount
            tableRef.current.removeEventListener('scroll', handleScroll);
        };
    }, [])
    useEffect(() => {
        getData();
    }, [page])
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Supplier Management
            </Typography>
            <CrateorEdit editItem={editItem} />
            <TableContainer component={Paper} style={{ marginTop: 20, height: "50vh" }} ref={tableRef}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 &&
                            <RenderData data={data} onEdit={handleEdit} onDel={handleDelete} />
                        }
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>
                                {isLoading && <LinearProgress />}
                                {/* <Button onClick={getData}>Get More</Button> */}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
};

const CrateorEdit = ({ editItem }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [state, setState] = useState(null);
    const handleClose = () => {
        setOpen(false);
        setIsEditing(false);
        setState(null);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };
    const handleSave = () => {
        if (isEditing) {
            setData(data.map(item => item.id === state.id ? state : item));
        } else {
            setData([...data, { ...state, id: data.length + 1 }]);
        }
        handleClose();
    };
    useEffect(() => {
        if (editItem) {
            console.log("edit Called");
            setState(editItem);
            handleOpen();
        }
    }, [editItem])
    return (
        <Box>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Supplier
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Supplier Name"
                        type="text"
                        fullWidth
                        value={state?.name || ''}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        options={[{ id: 1, acctname: "20115-abbbbc", type: "liability" }, { id: 2, acctname: "20115-44656", type: "liability" }]}
                        getOptionLabel={option => option.acctname}
                        renderInput={params => <TextField {...params} label="Account" margin='dense' />}
                    />
                    <TextField
                        margin="dense"
                        name="cnic"
                        label="CNIC #"
                        type="text"
                        fullWidth
                        value={state?.cnic || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="mob_no"
                        label="Mobile Number"
                        type="text"
                        fullWidth
                        value={state?.mob_no || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="address"
                        label="Address"
                        type="text"
                        fullWidth
                        multiline
                        rows={5}
                        value={state?.address || ''}
                        onChange={handleChange}
                    />
                    <Autocomplete
                        options={[{ id: 1, title: "active" }, { id: 2, title: "deactive" }]}
                        getOptionLabel={option => option.title}
                        renderInput={params => <TextField {...params} label="Status" margin='dense' />}
                    // value={state?.status || ''}
                    // onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} color="primary">
                        {isEditing ? "Update" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

const RenderData = memo(({ data, onEdit, onDel }) => {
    return (data.map((item) =>
        <TableRow key={item.id}>
            <TableCell>
                <ListItem disableGutters disablePadding>
                    <ListItemAvatar>
                        <Avatar />
                    </ListItemAvatar>
                    <ListItemText
                        primary={<Typography variant='subtitle1' fontWeight={500}>{item.name}</Typography>}
                        secondary={
                            <Box>
                                <Typography variant='subtitle2'>ID: VID-{item.id}</Typography>
                                {item.cnic &&
                                    <Typography variant='subtitle2' gutterBottom={false} alignItems='center'>
                                        {/* <IconButton size='small' sx={{ mr: 1, border: 1, borderColor: grey[300], backgroundColor: blue[100] }}> */}
                                        <BadgeIcon fontSize='0.7rem' color='primary' sx={{ mr: 1 }} />
                                        {/* </IconButton> */}
                                        {item.cnic}
                                    </Typography>
                                }
                                {item.mob_no &&
                                    <Typography variant='subtitle2' gutterBottom={false} alignItems='center'>
                                        {/* <IconButton size='small' sx={{ mr: 1, border: 1, borderColor: grey[300], backgroundColor: green[100] }}> */}
                                        <CallIcon fontSize='0.7rem' color='success' sx={{ mr: 1 }} />
                                        {/* </IconButton> */}
                                        {item.mob_no}
                                    </Typography>
                                }
                            </Box>
                        }
                        secondaryTypographyProps={{ component: "div" }}
                    />
                </ListItem>
            </TableCell>
            <TableCell>{item.status}</TableCell>
            <TableCell>
                {console.log("map called")}
                <IconButton color="primary" onClick={() => onEdit(item)}>
                    <Edit />
                </IconButton>
                <IconButton color="secondary" onClick={() => onDel(item.id)}>
                    <Delete />
                </IconButton>
            </TableCell>
        </TableRow>
    ))
});
export default SupplierCRUD;

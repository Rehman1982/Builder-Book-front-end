import React, { useState } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, List, ListItem, Typography,
    Menu,
    ListItemText
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useEffect } from 'react';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const initialData = [
    {
        id: 6,
        name: "Emergency Response Procedure",
        code: "06",
        iso_forms: [
            {
                id: 10,
                DC: "RESPAK-EP-F01",
                FormName: "Emergency Response Team",
                Procudure_id: "6",
                attachment: [
                    {
                        attachment_type: "isoForm",
                        attachment_id: "10",
                        url: "isoforms/IsDlXFppdlTRyDqW70Qif88bK66FycMY59ew9G2d.doc"
                    }
                ]
            },
            {
                id: 11,
                DC: "RESPAK-EP-F02",
                FormName: "Emergency Numbers",
                Procudure_id: "6",
                attachment: [
                    {
                        attachment_type: "isoForm",
                        attachment_id: "11",
                        url: "isoforms/x12SyAH9W6POn8uUUAPSsEMj1QmlBPNMTiOm9nBO.doc"
                    }
                ]
            },
            // Add more ISO forms here
        ]
    },
    {
        id: 6,
        name: "Emergency Response Procedure",
        code: "06",
        iso_forms: [
            {
                id: 10,
                DC: "RESPAK-EP-F01",
                FormName: "Emergency Response Team",
                Procudure_id: "6",
                attachment: [
                    {
                        attachment_type: "isoForm",
                        attachment_id: "10",
                        url: "isoforms/IsDlXFppdlTRyDqW70Qif88bK66FycMY59ew9G2d.doc"
                    }
                ]
            },
            {
                id: 11,
                DC: "RESPAK-EP-F02",
                FormName: "Emergency Numbers",
                Procudure_id: "6",
                attachment: [
                    {
                        attachment_type: "isoForm",
                        attachment_id: "11",
                        url: "isoforms/x12SyAH9W6POn8uUUAPSsEMj1QmlBPNMTiOm9nBO.doc"
                    }
                ]
            },
            // Add more ISO forms here
        ]
    },
    {
        id: 6,
        name: "Emergency Response Procedure",
        code: "06",
        iso_forms: [
            {
                id: 10,
                DC: "RESPAK-EP-F01",
                FormName: "Emergency Response Team",
                Procudure_id: "6",
                attachment: [
                    {
                        attachment_type: "isoForm",
                        attachment_id: "10",
                        url: "isoforms/IsDlXFppdlTRyDqW70Qif88bK66FycMY59ew9G2d.doc"
                    }
                ]
            },
            {
                id: 11,
                DC: "RESPAK-EP-F02",
                FormName: "Emergency Numbers",
                Procudure_id: "6",
                attachment: [
                    {
                        attachment_type: "isoForm",
                        attachment_id: "11",
                        url: "isoforms/x12SyAH9W6POn8uUUAPSsEMj1QmlBPNMTiOm9nBO.doc"
                    }
                ]
            },
            // Add more ISO forms here
        ]
    },
    // Add more procedures here
];

function IsoProcedures() {
    const [data, setData] = useState(initialData);
    const [open, setOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', code: '', iso_forms: [] });
    const [forms, setForms] = useState(null);

    const handleOpen = (item = null) => {
        setCurrentItem(item);
        setNewItem(item ? { ...item } : { name: '', code: '', iso_forms: [] });
        setIsEdit(!!item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentItem(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleSave = () => {
        if (isEdit) {
            setData(data.map((item) => (item.id === currentItem.id ? newItem : item)));
        } else {
            setData([...data, { ...newItem, id: Date.now() }]);
        }
        handleClose();
    };

    const handleDelete = (id) => {
        setData(data.filter(item => item.id !== id));
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                Add New Procedure
            </Button>
            <IsoForms forms={forms} setForms={setForms} />
            <List>
                {data.map((item) => (
                    <Paper elevation={5}>
                        <ListItem key={item.id} divider>
                            <ListItemText
                                primary={`${item.code}: ${item.name}`}
                                secondary={<Button onClick={() => setForms(item.iso_forms)}>View Forms</Button>}
                                secondaryTypographyProps={{ component: "div" }}
                            />
                            <IconButton onClick={() => handleOpen(item)}>
                                <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(item.id)}>
                                <Delete />
                            </IconButton>
                        </ListItem>
                    </Paper>
                ))}
            </List>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEdit ? 'Edit Procedure' : 'Add New Procedure'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {isEdit ? 'Edit the details of the procedure.' : 'Enter the details of the new procedure.'}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Name"
                        name="name"
                        value={newItem.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        label="Code"
                        name="code"
                        value={newItem.code}
                        onChange={handleChange}
                        fullWidth
                    />
                    {/* You can add more fields for ISO forms if needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const IsoForms = ({ forms, setForms }) => {
    const [isoForms, setIsoForms] = useState([]);
    const [open, setOpen] = useState(false);
    const handleClose = () => {
        setForms(null);
        setOpen(false);
    }
    useEffect(() => {
        if (forms) {
            setIsoForms(forms);
            setOpen(true)
        }
    }, [forms])
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
            >
                <DialogTitle>{"ISO Forms"}</DialogTitle>
                <DialogContent>
                    <List>
                        {
                            isoForms.map((form) => (
                                <ListItem key={form.id} divider>
                                    <ListItemText
                                        primary={form.FormName}
                                        secondary={form.DC}
                                    />
                                    <IconButton onClick={() => alert("Edit ISO Form feature")}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => alert("Delete ISO Form feature")}>
                                        <Delete />
                                    </IconButton>
                                    <IconButton component="a" href={form.attachment[0]?.url} target="_blank" rel="noopener noreferrer">
                                        <CloudDownloadIcon />
                                    </IconButton>
                                </ListItem>
                            ))
                        }
                    </List >
                </DialogContent>
            </Dialog>
        </>
    )
}
export default IsoProcedures;

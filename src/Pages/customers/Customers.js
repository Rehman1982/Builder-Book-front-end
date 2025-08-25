import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Grid,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Stack,
} from "@mui/material";
import {
    Add,
    Call,
    Delete,
    Edit,
    MobileFriendlyOutlined,
    RemoveRedEye,
} from "@mui/icons-material";
import { blue, orange } from "@mui/material/colors";
import { Customer } from "./Customer";
import { useEffect } from "react";
import { useCallback } from "react";
import axios from "axios";

// Mock Data
const initialCustomers = [
    // {
    //     id: 1,
    //     name: "John Doe",
    //     ntn: "123",
    //     strn: "456",
    //     address: "123 St",
    //     landline: "123456789",
    //     mobile: "987654321",
    //     www: "example.com",
    //     email: "john@example.com",
    // },
];

const Customers = () => {
    const [customers, setCustomers] = useState(initialCustomers);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [variant, setVariant] = useState(null); // "create" or "update"]

    const handleDialogOpen = (type, customer = null) => {
        setDialogType(type);
        setSelectedCustomer(customer);
        setOpenDialog(true);
    };

    const handleSave = (customerData) => {
        if (dialogType === "create") {
            setCustomers([...customers, { id: Date.now(), ...customerData }]);
        } else if (dialogType === "update") {
            setCustomers(
                customers.map((customer) =>
                    customer.id === selectedCustomer.id
                        ? { ...customer, ...customerData }
                        : customer
                )
            );
        }
        handleDialogClose();
    };

    const handleDelete = (id) => {
        setCustomers(customers.filter((customer) => customer.id !== id));
    };
    const getAllCustomers = useCallback(async () => {
        try {
            const res = await axios.get(
                route("customers.index", { type: "data" })
            );
            if (res.status === 200) {
                setCustomers(res.data);
            }
            console.log(res);
        } catch (error) {}
    }, []);
    useEffect(() => {
        getAllCustomers();
    }, []);
    return (
        <Box>
            <Customer
                variant={variant}
                setVariant={setVariant}
                selectedCustomer={selectedCustomer}
                setSelectedCustomer={setSelectedCustomer}
                refresh={getAllCustomers}
            />
            <Box>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                >
                    <IconButton
                        onClick={() => setVariant("Create")}
                        sx={{
                            backgroundColor: blue[300],
                            ":hover": { backgroundColor: blue[500] },
                        }}
                    >
                        <Add />
                    </IconButton>
                    <TextField />
                </Stack>
                <List
                    subheader={<Typography variant="h5">Customers</Typography>}
                    disablePadding
                >
                    {customers.map((customer) => (
                        <ListItem divider key={customer.id}>
                            <ListItemText
                                disableTypography
                                primary={customer.name}
                                secondary={
                                    <Stack
                                        direction="row"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                    >
                                        <Avatar
                                            sx={{
                                                height: 20,
                                                width: 20,
                                                mr: 1,
                                                backgroundColor: blue[200],
                                            }}
                                        >
                                            <Call sx={{ fontSize: "0.8rem" }} />
                                        </Avatar>
                                        {customer.mobile}
                                    </Stack>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    onClick={() => {
                                        setSelectedCustomer(customer);
                                        setVariant("View");
                                    }}
                                    sx={{
                                        backgroundColor: blue[300],
                                        ":hover": {
                                            backgroundColor: blue[600],
                                        },
                                    }}
                                >
                                    <RemoveRedEye sx={{ color: "white" }} />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {dialogType === "create"
                        ? "Create Customer"
                        : "Update Customer"}
                </DialogTitle>
                <DialogContent>
                    <CustomerForm
                        customer={selectedCustomer}
                        onSave={(data) => handleSave(data)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                </DialogActions>
            </Dialog> */}
        </Box>
    );
};

// const CustomerForm = ({ customer, onSave }) => {
//     const [formData, setFormData] = useState(
//         customer || {
//             name: "",
//             ntn: "",
//             strn: "",
//             address: "",
//             landline: "",
//             mobile: "",
//             www: "",
//             email: "",
//         }
//     );

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = () => {
//         onSave(formData);
//     };

//     return (
//         <Box component="form" noValidate autoComplete="off">
//             <Grid container spacing={2}>
//                 {Object.keys(formData).map((key) => (
//                     <Grid item xs={12} key={key}>
//                         <TextField
//                             fullWidth
//                             label={key.charAt(0).toUpperCase() + key.slice(1)}
//                             name={key}
//                             value={formData[key]}
//                             onChange={handleChange}
//                         />
//                     </Grid>
//                 ))}
//             </Grid>
//             <Box mt={2}>
//                 <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={handleSubmit}
//                 >
//                     Save
//                 </Button>
//             </Box>
//         </Box>
//     );
// };

export default Customers;

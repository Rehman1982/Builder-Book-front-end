import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Stack,
    TextField,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Error } from "../helpers/helpers";

export const Customer = ({
    variant,
    setVariant,
    selectedCustomer,
    setSelectedCustomer,
    refresh,
}) => {
    const [open, setOpen] = useState(false);
    const handleDialogClose = () => {
        setOpen(false);
        setVariant(null);
        setSelectedCustomer(null);
    };
    useEffect(() => {
        if (variant) setOpen(true);
    }, [variant]);
    return (
        <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {variant === "View" && selectedCustomer?.name}
                {variant === "Create" && "Create Customer"}
                {variant === "Edit" && "Update Customer"}
            </DialogTitle>
            <DialogContent>
                <CustomerForm
                    customer={selectedCustomer}
                    variant={variant}
                    refresh={refresh}
                    handleDialogClose={handleDialogClose}
                />
            </DialogContent>
        </Dialog>
    );
};

const CustomerForm = ({ customer, variant, refresh, handleDialogClose }) => {
    const [currenVariant, setCurrentVariant] = useState(variant);
    const [formData, setFormData] = useState(
        customer || {
            name: "",
            ntn: "",
            strn: "",
            address: "",
            landline: "",
            mobile: "",
            www: "",
            email: "",
        }
    );
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCreate = async () => {
        try {
            setBusy(true);
            const res = await axios.post(route("customers.store"), formData);
            if (res.status === 203) {
                setErrors(res.data);
                setBusy(false);
            }
            if (res.status === 200) {
                setBusy(false);
                handleDialogClose();
                refresh();
            }
        } catch (error) {
            console.log(error.response);
            setBusy(false);
        }
    };
    return (
        <Box component="form" noValidate autoComplete="off">
            <Grid container>
                {Object.keys(formData).map((key) => (
                    <Grid item xs={12} key={key}>
                        <TextField
                            required={
                                key == "name" || key == "address" ? true : false
                            }
                            disabled={currenVariant == "View" ? true : false}
                            fullWidth
                            label={key.toUpperCase()}
                            name={key}
                            value={formData[key] || ""}
                            onChange={handleChange}
                            margin="dense"
                            error={key in errors}
                            helperText={<Error errors={errors} name={key} />}
                        />
                    </Grid>
                ))}
            </Grid>
            <Stack mt={2} direction="row" justifyContent="flex-end">
                {currenVariant == "Create" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        disabled={busy}
                    >
                        {busy && <CircularProgress size={15} sx={{ mr: 2 }} />}
                        Save
                    </Button>
                )}
                {currenVariant == "Edit" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        disabled={busy}
                    >
                        {busy && <CircularProgress size={15} sx={{ mr: 2 }} />}
                        Update
                    </Button>
                )}
                {currenVariant == "View" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setCurrentVariant("Edit")}
                        children="Edit"
                    />
                )}
            </Stack>
        </Box>
    );
};

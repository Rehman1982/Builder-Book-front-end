import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { blue, grey, pink } from "@mui/material/colors";
import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import CONTEXT from "./context";
import { Error } from "../helpers/helpers";
import { Delete } from "@mui/icons-material";

export const DeleteInvoice = ({ closeForm }) => {
    const {
        invoice,
        errors,
        setErrors,
        showAlert,
        setMessage,
        setSeverity,
        getInvoiceData,
        refresh,
        setRefresh,
        allInvoices,
        setAllInvoices,
    } = useContext(CONTEXT);
    const [open, setOpen] = useState(false);
    const [signatoryCode, setSignatoryCode] = useState("");
    const handleFormClose = () => {
        setOpen(false);
    };
    const handleDelete = async () => {
        setErrors({});
        const payload = {
            invoice: 1,
            invoiceData: invoice,
            signatoryCode: signatoryCode,
        };
        console.log(payload);
        const res = await axios.delete(
            route("invoicing.invoices.destroy", payload)
        );
        if (res.status == 203) {
            console.log(res);
            setErrors(res.data);
            setMessage("Something Went Wrong");
            setSeverity("error");
            showAlert(true);
        }
        if (res.status == 200) {
            let filteredData = allInvoices.filter(
                (v, i) => v.id !== invoice.id
            );
            setAllInvoices(filteredData);
            setMessage("Delete Successful!");
            setOpen(false);
            closeForm();
            showAlert(true);
            setRefresh(true);
        }
    };
    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
                sx={{
                    backgroundColor: pink[600],
                    "&:hover": { backgroundColor: pink[800] },
                }}
                children={<Delete sx={{ color: grey[50] }} />}
            />
            <Dialog open={open} onClose={handleFormClose}>
                <DialogTitle>Are you Sure?</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        This action will delete the invoice permnantly and can
                        not be undone. Are you sure to proceed further?
                    </Typography>
                    <TextField
                        fullWidth
                        name="signatorycode"
                        value={signatoryCode}
                        onChange={(e) => setSignatoryCode(e.target.value)}
                        label="Signatory Code"
                        helperText={
                            <Error name="signatoryCode" errors={errors} />
                        }
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Button variant="text" onClick={handleFormClose}>
                        Dismiss without Action
                    </Button>
                    <Button
                        onClick={handleDelete}
                        sx={{
                            background: pink[600],
                            color: grey[50],
                            "&:hover": { background: pink[500] },
                        }}
                    >
                        Yes Iam Sure!
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

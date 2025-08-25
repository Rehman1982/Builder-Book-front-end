import {
    Stack,
    IconButton,
    Dialog,
    DialogTitle,
    Typography,
    DialogContent,
    Autocomplete,
    TextField,
    Box,
    Grid,
    DialogActions,
    Button,
    LinearProgress,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";

import BillingDetails from "./BillingDetails";
import Taxes from "./Taxes";
import CONTEXT from "./context";
import { Error } from "../helpers/helpers";
import { Alert } from "../../context/AlertBar/AlertBar";
import { InvoiceDetails } from "./InvoiceDetails";
import { FixedTaxes } from "./FixedTaxes";

export const CreateInvoice = ({ variant }) => {
    const {
        projects,
        customers,
        invoicePrefix,
        invoice,
        billingDetails,
        setBillingDetails,
        taxesDetails,
        setTaxesDetails,
        setInvoice,
        errors,
        setErrors,
        setRefresh,
        includedTaxes,
        allInvoices,
        setAllInvoices,
        getInvoiceData,
        getData,
    } = useContext(CONTEXT);
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        getData();
    }, [getData]);
    const handleStore = async () => {
        setBusy(true);
        const res = await axios.post(route("invoicing.invoices.store"), {
            invoice,
            billingDetails,
            includedTaxes,
            taxesDetails,
        });
        console.log(res);
        if (res.status == 203) {
            setErrors(res.data);
            console.log(res.data);
            setBusy(false);
        }
        if (res.status == 200) {
            let freshInvoice = { ...res.data, fresh: 1 };
            setAllInvoices([freshInvoice, ...allInvoices]);
            setRefresh(true);
            setMessage("Invoice Created");
            showAlert(true);
            handleFormClose();
            setBusy(false);
        }
    };
    const handleFormClose = () => {
        setInvoice({ project: null, customer: null, invoiceType: null });
        setBillingDetails([]);
        setTaxesDetails([]);
        setOpen(false);
    };
    return (
        <>
            {/* <Stack direction="row" justifyContent="flex-end" paddingY="0.5rem"> */}
            <IconButton
                onClick={() => setOpen(true)}
                sx={{ border: 1, borderColor: blue[200] }}
            >
                <AddIcon />
            </IconButton>
            {/* </Stack> */}
            <Dialog
                open={open}
                onClose={handleFormClose}
                fullWidth
                maxWidth="md"
            >
                {busy && <LinearProgress />}
                <DialogTitle>Create Invoice</DialogTitle>
                <DialogContent>
                    <InvoiceDetails variant={variant} />
                    <BillingDetails variant={variant} />
                    <FixedTaxes variant={variant} />
                    <Taxes variant={variant} />
                </DialogContent>
                <DialogActions>
                    <Button
                        // disabled={busy}
                        onClick={handleStore}
                        variant="contained"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

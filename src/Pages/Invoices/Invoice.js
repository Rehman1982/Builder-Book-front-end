import {
    Build,
    Edit,
    HomeWork,
    Person2,
    Print,
    Receipt,
    SupervisorAccount,
} from "@mui/icons-material";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    Typography,
    Button,
} from "@mui/material";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import BillingDetails from "./BillingDetails";
import { useContext } from "react";
import CONTEXT from "./context";
import axios from "axios";
import Taxes from "./Taxes";
import { blue, grey, orange } from "@mui/material/colors";
import { InvoiceDetails } from "./InvoiceDetails";
import { FixedTaxes } from "./FixedTaxes";
import { DeleteInvoice } from "./Deleteinvoice";
import { Link } from "react-router-dom";
import { PrintInvoice } from "./PrintInvoice";
import { useReactToPrint } from "react-to-print";
import { Error } from "../helpers/helpers";
import TransDetails from "./paymentReceived/TransDetails";
import Attachments from "../Attachments/Attachment";

export const Invoice = ({ currentInvoice, setCurrentInvoice, variant }) => {
    const contentRef = useRef();
    const {
        invoice,
        billingDetails,
        billingDetailsTotal,
        taxesDetails,
        getInvoiceData,
        includedTaxes,
        setErrors,
        setMessage,
        showAlert,
        allInvoices,
        setAllInvoices,
    } = useContext(CONTEXT);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentVariant, setCurrentVariant] = useState(variant);
    useEffect(() => {
        console.log("INVOICE", invoice);
        if (currentInvoice !== null) {
            setOpen(true);
            getInvoiceData(currentInvoice);
        }
    }, [currentInvoice, currentVariant]);
    const handleFormClose = () => {
        setCurrentInvoice(null);
        setOpen(false);
        setCurrentVariant("view");
    };
    const handleUpdate = async () => {
        const res = await axios.put(
            route("invoicing.invoices.update", {
                invoice: 1,
            }),
            {
                invoice,
                billingDetails,
                includedTaxes,
                taxesDetails,
            }
        );
        if (res.status == 203) {
            setErrors(res.data);
        }
        if (res.status == 200) {
            let updateInvoice = { ...res.data, updated: 1 };
            let index = allInvoices.findIndex((v, i) => v.id === res.data.id);
            console.log("index", index);
            let a = [...allInvoices];
            a[index] = { ...updateInvoice };
            setAllInvoices(a);
            handleFormClose();
            setMessage("Details Updated");
            showAlert(true);
        }
    };
    const handlePrint = useReactToPrint({ contentRef });
    return (
        <>
            <div className="d-none">
                <PrintInvoice
                    ref={contentRef}
                    invoice={invoice}
                    billingDetails={billingDetails}
                    totalbill={billingDetailsTotal}
                    includedTaxes={includedTaxes}
                    taxesDetails={taxesDetails}
                />
            </div>
            <Dialog
                open={open}
                onClose={handleFormClose}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Invoice No.{" "}
                    {!loading &&
                        invoice.invoiceType +
                            "-" +
                            invoice.date +
                            "-" +
                            invoice.number}{" "}
                </DialogTitle>
                <DialogContent>
                    <Attachments table={"invoice"} id={invoice.id} />
                    <TransDetails transactions={[]} />
                    <InvoiceDetails variant={currentVariant} />
                    <BillingDetails variant={currentVariant} />
                    <FixedTaxes variant={currentVariant} />
                    <Taxes variant={currentVariant} />
                    <DialogActions sx={{ mt: 2 }}>
                        <DeleteInvoice closeForm={handleFormClose} />
                        {currentVariant !== "edit" && (
                            <IconButton
                                onClick={handlePrint}
                                sx={{
                                    backgroundColor: blue[800],
                                    "&:hover": { backgroundColor: blue[900] },
                                }}
                            >
                                <Print sx={{ color: grey[50] }} />
                            </IconButton>
                        )}
                        {currentVariant !== "edit" && (
                            <IconButton
                                sx={{
                                    backgroundColor: orange[800],
                                    "&:hover": { backgroundColor: orange[900] },
                                }}
                                onClick={() => setCurrentVariant("edit")}
                            >
                                <Edit sx={{ color: grey[50] }} />
                            </IconButton>
                        )}
                        {currentVariant == "edit" && (
                            <Button
                                sx={{
                                    backgroundColor: orange[600],
                                    "&:hover": { backgroundColor: orange[800] },
                                    color: grey[50],
                                }}
                                onClick={handleUpdate}
                            >
                                Update
                            </Button>
                        )}
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </>
    );
};

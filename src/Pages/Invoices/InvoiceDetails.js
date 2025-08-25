import React from "react";
import { useContext } from "react";
import CONTEXT from "./context";
import { useState } from "react";
import {
    Grid,
    Stack,
    Typography,
    IconButton,
    Autocomplete,
    TextField,
    CircularProgress,
    LinearProgress,
    Button,
} from "@mui/material";
import {
    HomeWork,
    Person2,
    Receipt,
    SupervisorAccount,
    Update,
} from "@mui/icons-material";
import { blue, grey } from "@mui/material/colors";
import { Error } from "../helpers/helpers";
import { useEffect } from "react";
import axios from "axios";

export const InvoiceDetails = ({ variant }) => {
    const {
        invoice,
        setInvoice,
        projects,
        setProjects,
        customers,
        setCustomers,
        invoicePrefix,
        setInvoicePrefix,
        errors,
        setErrors,
        showAlert,
        setMessage,
        setSeverity,
    } = useContext(CONTEXT);
    const [loading, setLoading] = useState(false);
    const [busy, setBusy] = useState(false);
    return (
        <>
            {variant == "view" && (
                <div>
                    <Grid container mb={1}>
                        <Grid
                            item
                            xs={6}
                            sx={{ border: 0.5, borderColor: grey[300] }}
                        >
                            <Stack direction="row" spacing={2}>
                                <IconButton
                                    sx={{
                                        background: blue[500],
                                        borderRadius: 0,
                                    }}
                                >
                                    <Person2 sx={{ color: grey[50] }} />
                                </IconButton>
                                <Typography variant="body1" sx={{ py: 1 }}>
                                    {invoice.user && invoice.user.user}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            sx={{ border: 0.5, borderColor: grey[300] }}
                        >
                            <Stack direction="row" spacing={2}>
                                <IconButton
                                    sx={{
                                        background: blue[500],
                                        borderRadius: 0,
                                    }}
                                >
                                    <Receipt sx={{ color: grey[50] }} />
                                </IconButton>
                                <Typography
                                    variant="body1"
                                    sx={{ py: 1 }}
                                ></Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container mb={1}>
                        <Grid
                            item
                            xs={12}
                            sx={{ border: 0.5, borderColor: grey[300] }}
                        >
                            <Stack direction="row" spacing={2}>
                                <IconButton
                                    sx={{
                                        background: blue[500],
                                        borderRadius: 0,
                                    }}
                                >
                                    <HomeWork sx={{ color: grey[50] }} />
                                </IconButton>
                                <Typography variant="body1" sx={{ py: 1 }}>
                                    {invoice.project && invoice.project.name}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Grid container mb={1}>
                        <Grid
                            item
                            xs={12}
                            sx={{ border: 0.5, borderColor: grey[300] }}
                        >
                            <Stack direction="row" spacing={2}>
                                <IconButton
                                    sx={{
                                        background: blue[500],
                                        borderRadius: 0,
                                    }}
                                >
                                    <SupervisorAccount
                                        sx={{ color: grey[50] }}
                                    />
                                </IconButton>
                                <Typography variant="body1" sx={{ py: 1 }}>
                                    {invoice?.invoiceType?.type}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </div>
            )}
            {(variant == "create" || variant == "edit") && (
                <div>
                    {busy && <LinearProgress />}
                    <Grid
                        container
                        spacing={{ xs: 0, md: 1 }}
                        alignItems="center"
                    >
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={projects}
                                getOptionLabel={(option) => option.name}
                                value={invoice.project}
                                onChange={(e, v) => {
                                    let a = { ...invoice, project: v };
                                    setInvoice(a);
                                }}
                                renderInput={(option) => (
                                    <TextField
                                        {...option}
                                        label="Select Project"
                                        margin="dense"
                                        size="small"
                                        helperText={
                                            <Error
                                                name="invoice.project.id"
                                                errors={errors}
                                            />
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={customers}
                                getOptionLabel={(option) => option.name}
                                value={invoice.customer}
                                onChange={(e, v) => {
                                    let a = { ...invoice, customer: v };
                                    setInvoice(a);
                                }}
                                renderInput={(option) => (
                                    <TextField
                                        {...option}
                                        label="Select Customer"
                                        margin="dense"
                                        size="small"
                                        helperText={
                                            <Error
                                                name="invoice.customer.id"
                                                errors={errors}
                                            />
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Autocomplete
                                options={invoicePrefix}
                                getOptionLabel={(option) => option.type}
                                value={invoice.invoiceType}
                                onChange={(e, v) => {
                                    let a = { ...invoice, invoiceType: v };
                                    setInvoice(a);
                                }}
                                renderInput={(option) => (
                                    <TextField
                                        {...option}
                                        label="Inv Type"
                                        margin="dense"
                                        size="small"
                                        helperText={
                                            <Error
                                                name="invoice.invoiceType.id"
                                                errors={errors}
                                            />
                                        }
                                    />
                                )}
                            />
                        </Grid>
                        {/* {variant == "edit" && (
                            <Grid item xs={12} md={1} justifyContent="flex-end">
                                <IconButton
                                    sx={{
                                        background: blue[300],
                                        "&:hover": { background: blue[500] },
                                        borderRadius: 2,
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    onClick={handleAdd}
                                >
                                    <Update
                                        fontSize="1.5rem"
                                        sx={{ color: grey[50] }}
                                    />
                                </IconButton>
                            </Grid>
                        )} */}
                    </Grid>
                </div>
            )}
        </>
    );
};

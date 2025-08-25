import { Edit } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import axios from "axios";
import { reduce } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Error } from "../../helpers/helpers";
import { useContext } from "react";
import { Alert } from "../../../context/AlertBar/AlertBar";

export const Post = ({ currentInvoice, setCurrentInvoice, refresh }) => {
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [state, setState] = useState([]);
    const [invoice, setInvoice] = useState();
    const [signatoryCode, setSignatoryCode] = useState("");
    const [errors, setErrors] = useState({});
    const [currentIndex, setCurrentIndex] = useState(null);
    const [accounts, setAccounts] = useState({
        assets: [],
        liability: [],
        cogs: [],
        income: [],
    });
    const hanldeSubmit = async () => {
        try {
            const res = await axios.post(route("invoicing.postinvoice.store"), {
                signatoryCode: signatoryCode,
                invoice: invoice,
                data: state,
            });
            if (res.status == 200) {
                setErrors({});
                setCurrentInvoice(null);
                setCurrentIndex(null);
                setMessage("Invoice Posted Successfully!");
                showAlert(true);
                refresh();
                console.log(res.data);
            }
            if (res.status == 203) {
                setErrors(res.data);
                setMessage("Something went wrong");
                setSeverity("error");
                showAlert(true);
                console.log(res);
            }
        } catch (error) {
            console.log(error.response);
        }
    };
    const getInvData = async (invId) => {
        const res = await axios.get(
            route("invoicing.postinvoice.create", { invoice_id: invId })
        );
        if (res.status == 200) {
            setData(res, setState);
            setInvoice(res.data.invoice);
            setAccounts(res.data.accounts);
        }
        console.log(res);
    };
    useEffect(() => {
        getInvData(currentInvoice);
    }, [currentInvoice]);
    return (
        <Dialog
            open={Boolean(currentInvoice)}
            onClose={() => setCurrentInvoice(null)}
            fullWidth
        >
            <Box>
                <EditAccount
                    state={state}
                    setState={setState}
                    accounts={accounts}
                    index={currentIndex}
                    setIndex={setCurrentIndex}
                />
                <DialogTitle>Post Invoice</DialogTitle>
                <DialogContent>
                    <Table padding="normal">
                        <TableHead sx={{ backgroundColor: blue[50] }}>
                            <TableRow
                                sx={{ border: 1, borderColor: grey[300] }}
                            >
                                <TableCell>AC</TableCell>
                                <TableCell align="right">DR</TableCell>
                                <TableCell align="right">CR</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {state.map((data, i) => (
                                <TableRow
                                    key={i}
                                    sx={{ border: 1, borderColor: grey[300] }}
                                >
                                    <TableCell>
                                        <Grid
                                            container
                                            alignItems="center"
                                            justifyContent="flex-start"
                                        >
                                            <Grid item xs={1.5}>
                                                <IconButton
                                                    onClick={() =>
                                                        setCurrentIndex(i)
                                                    }
                                                    size="small"
                                                    sx={{
                                                        backgroundColor:
                                                            blue[200],
                                                        ":hover": {
                                                            backgroundColor:
                                                                blue[400],
                                                        },
                                                    }}
                                                    children={
                                                        <Edit fontSize="0.5rem" />
                                                    }
                                                />
                                            </Grid>
                                            <Grid item xs={10.5}>
                                                <Typography
                                                    gutterBottom
                                                    variant="caption"
                                                    children={data.desp}
                                                />
                                                <Typography
                                                    variant="body1"
                                                    fontSize="0.8rem"
                                                    children={
                                                        data.account.name ||
                                                        "No Account Selected"
                                                    }
                                                />
                                                <Error
                                                    errors={errors}
                                                    name={`data.${i}.account.id`}
                                                />
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                    <TableCell align="right">
                                        {data.debit}
                                    </TableCell>
                                    <TableCell align="right">
                                        {data.credit}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        mt={1}
                        spacing={2}
                    >
                        <TextField
                            type="password"
                            size="small"
                            name="signatoryCode"
                            value={signatoryCode}
                            onChange={(e) => setSignatoryCode(e.target.value)}
                            margin="dense"
                            required
                            color="primary"
                            fullWidth
                            label="Signatory Code"
                            helperText={
                                <Error errors={errors} name="signatoryCode" />
                            }
                        />
                        <Button onClick={hanldeSubmit} variant="contained">
                            Submit
                        </Button>
                    </Stack>
                </DialogContent>
            </Box>
        </Dialog>
    );
};

const setData = (response, setState) => {
    const { invoice, details, includedTaxes, Taxes, settings } = response.data;
    console.log(
        "setDATA",
        settings[settings.findIndex((v) => v.type == "income")]["account"]
    );
    let JRDATA = [];
    const invoiceNo = `${invoice.prefix}-${invoice.date}-${invoice.number}`;
    JRDATA.push({
        acType: "income",
        desp: `Invoice No.${invoiceNo}`,
        project_id: invoice.project_id,
        account:
            settings[settings.findIndex((v) => v.type == "income")]["account"],
        debit: 0,
        credit: details,
    });
    if (includedTaxes.length > 0) {
        includedTaxes.map((v) =>
            JRDATA.push({
                acType: "liability",
                desp: v.tax.desp + "@" + v.tax_rate + "INV#" + invoiceNo,
                account: v.tax.account,
                project_id: invoice.project_id,
                debit: 0,
                credit: v.tax_value,
            })
        );
        JRDATA.push({
            acType: "cogs",
            desp: "Cost of Taxes on INV # " + invoiceNo,
            account:
                settings[settings.findIndex((v) => v.type == "cogs")][
                    "account"
                ],
            project_id: invoice.project_id,
            debit: includedTaxes.reduce(
                (t, c, i) => (t = t + parseInt(c.tax_value)),
                0
            ),
            credit: 0,
        });
    }
    Taxes.map((v) =>
        JRDATA.push({
            acType: "liability",
            desp: v.tax.desp + "INV#" + invoiceNo,
            project_id: invoice.project_id,
            account: v.tax.account,
            debit: 0,
            credit: v.amount,
        })
    );
    // const { assetaccount } = invoice.project;
    JRDATA.push({
        acType: "assets",
        desp: "Payable Amount of INV#" + invoiceNo,
        account:
            settings[settings.findIndex((v) => v.type == "assets")]["account"],
        project_id: invoice.project_id,
        debit: Taxes.reduce(
            (t, c, i) => (t = t + parseInt(c.amount)),
            parseInt(details)
        ),
        credit: 0,
    });
    setState(JRDATA);
    // setState((prv) => {
    //     let a = { ...prv };
    //     a.income.desp = `Invoice No.${invoiceNo}`;
    //     a.income.project_id = invoice.project_id;
    //     a.income.credit = details;
    //     a.includedTaxes = includedTaxes.map((v) => {
    //         return {
    //             desp: v.tax.desp + "@" + v.tax_rate + "INV#" + invoiceNo,
    //             account: v.tax.account,
    //             project_id: invoice.project_id,
    //             debit: 0,
    //             credit: v.tax_value,
    //         };
    //     });
    //     a.includedTaxes.push({
    //         desp: "Cost of Taxes on INV # " + invoiceNo,
    //         account: { id: "", name: "" },
    //         debit: a.includedTaxes.reduce((t, c, i) => (t = t + c.credit), 0),
    //         credit: 0,
    //     });
    //     a.Taxes = Taxes.map((v) => {
    //         return {
    //             desp: v.tax.desp + "INV#" + invoiceNo,
    //             account: v.tax.account,
    //             debit: 0,
    //             credit: v.amount,
    //         };
    //     });
    //     a.assets.desp = "Payable Amount of INV#" + invoiceNo;
    //     a.assets.debit = Taxes.reduce((t, c, i) => (t = t + c.amount), details);
    //     return a;
    // });
};

const EditAccount = ({ state, setState, accounts, index, setIndex }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState();
    const handleUpdate = () => {
        setState((prv) => {
            let a = [...prv];
            a[index]["account"] = data.account;
            a[index]["desp"] = data.desp;
            return a;
        });
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
        setIndex(null);
        setData();
    };
    useEffect(() => {
        console.log("EDitAcc", state[index], accounts, index);
        if (index !== null) {
            setData(state[index]);
            setOpen(true);
        }
    }, [index]);
    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogContent>
                <TextField
                    multiline
                    rows={5}
                    value={data?.desp}
                    onChange={(e) => setData({ ...data, desp: e.target.value })}
                    label="Description"
                    margin="dense"
                    fullWidth
                />
                <Autocomplete
                    options={data ? accounts[data.acType] : []}
                    getOptionLabel={(ops) => ops.name}
                    value={data?.account}
                    onChange={(e, v) => setData({ ...data, account: v })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Accounts"
                            margin="dense"
                        />
                    )}
                />

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    mt={2}
                >
                    <ButtonGroup>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleUpdate} variant="contained">
                            Update
                        </Button>
                    </ButtonGroup>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

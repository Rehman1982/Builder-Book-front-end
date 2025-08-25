import React, { useEffect, useState } from "react";
import { Add, DeleteForever } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Grid,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import AddJREntries from "./AddJREntries";
import { blue, grey, red } from "@mui/material/colors";

const JREntries = ({ accounts, data, invoice, setCurrentInvoice, refresh }) => {
    const [busy, setBusy] = useState(false);
    const [limitAmount, setLimitAmount] = useState(0);
    const [paid, setPaid] = useState(false);
    const [paidType, setPaidType] = useState("partial"); // partial, full
    const [paidEntry, setPaidEntry] = useState(null);
    const [totals, setTotals] = useState({ dr: 0, cr: 0 });
    const [state, setState] = useState([]);
    const validate = () => {
        let allData = [paidEntry, ...state];
        let response = true;
        allData.map((v) => {
            if (
                (v.debit == 0 && v.credit == 0) ||
                (v.debit > 0 && v.credit > 0)
            ) {
                response = false;
            }
        });
        return response;
    };
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setState((prv) => {
            let a = [...prv];
            a[index][name] = value;
            a.reduce(
                (t, c, i) => {
                    const Index = t.findIndex(
                        (v) => v.accounts.id == c.accounts.id
                    );
                    if (Index > -1) {
                        t[Index]["credit"] =
                            parseInt(t[Index]["credit"]) + parseInt(c.credit);

                        t[Index]["debit"] =
                            parseInt(t[Index]["debit"]) + parseInt(c.debit);
                    } else {
                        t.push(c);
                    }
                    return t;
                },
                [
                    {
                        id: "",
                        accounts: { id: "", name: "", type: "" },
                        debit: 0,
                        credit: 0,
                    },
                ]
            );
            return a;
        });
    };
    const hanldeSubmit = async () => {
        setBusy(true);
        if (!validate()) {
            alert("errors");
            setBusy(false);
            return;
        }
        const formData = [paidEntry, ...state];
        let Total = formData.reduce(
            (t, c, i) => {
                t.cr = t.cr + parseInt(c.credit);
                t.dr = t.dr + parseInt(c.debit);
                return t;
            },
            { cr: 0, dr: 0 }
        );
        if (Total.cr !== Total.dr) {
            alert("check Credits and Debits");
            setBusy(false);
            return;
        }
        if (paidEntry.credit > limitAmount) {
            alert("Amount Exceeded from Payable Amount");
            setBusy(false);
            return;
        }
        try {
            const res = await axios.post(
                route("invoicing.paymentreceived.store"),
                {
                    paid: paid,
                    jrs: formData,
                    invoice: invoice,
                }
            );
            if (res.status == 200) {
                setBusy(false);
                setCurrentInvoice(null);
                refresh();
                console.log(res);
            }
        } catch (error) {
            console.log(error.response.data);
        }
    };
    const hanldeDelete = (index) => {
        setState(state.filter((_, i) => i !== index));
    };
    useEffect(() => {
        if (paidEntry) {
            if (paidEntry.credit > limitAmount) {
                setPaidType("");
                alert("Amount Exceeded from Payable Amount");
            } else if (paidEntry.credit < limitAmount) {
                setPaidType("Partial Payment");
            } else if (paidEntry.credit == limitAmount) {
                setPaid(true);
                setPaidType("Full Payment");
            }
        }
    }, [paidEntry]);

    useEffect(() => {
        const total = [...state].reduce(
            (total, current, index) => {
                total.dr += parseInt(current.debit);
                total.cr += parseInt(current.credit);
                return total;
            },
            { dr: 0, cr: 0 }
        );
        setTotals(total);
        let VALUE = { debit: 0, credit: 0 };
        if (total.dr > total.cr) {
            VALUE.credit = total.dr - total.cr;
        } else {
            VALUE.debit = total.cr - total.dr;
        }
        if (paidEntry) {
            setPaidEntry({
                ...paidEntry,
                ...VALUE,
            });
        } else {
            const [firstJR] = data;
            // console.log(firstJR.journals);
            const Index = firstJR["journals"].findIndex(
                (v, i) => v.accounts.type == "assets"
            );
            const account = firstJR.journals[Index]["accounts"];
            console.log("indexss", Index, account);
            const Limit = data
                .flatMap((trans) => trans.journals)
                .reduce(
                    (t, c, l) => {
                        if (c["account_id"] == account["id"]) {
                            let credit = parseInt(c["credit"]);
                            let debit = parseInt(c["debit"]);
                            t["cr"] = parseInt(t["cr"] + credit);
                            t["dr"] = parseInt(t["dr"] + debit);
                        }
                        return t;
                    },
                    { dr: 0, cr: 0 }
                );
            console.log("first effect", Limit);
            setLimitAmount(Limit.dr - Limit.cr);
            setPaidEntry({
                id: "",
                accounts: account,
                desp: `Payment Received in Inv#: ${invoice.prefix}-${invoice.date}-${invoice.number}`,
                ...VALUE,
            });
        }
    }, [state]);
    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography
                    variant="h6"
                    my={2}
                    children={"JR Details"}
                    accounts={accounts}
                />
                <AddJREntries
                    jrs={state}
                    setJrs={setState}
                    accounts={accounts}
                />
            </Stack>
            {paidEntry !== null &&
                (paidEntry.debit > 0 || paidEntry.credit > 0) && (
                    <>
                        <Grid container alignItems="center" py={0.5}>
                            <Grid item xs={6} sm={8}>
                                <Typography
                                    variant="body2"
                                    children="Desp / Ac"
                                    fontWeight={800}
                                />
                            </Grid>
                            <Grid item xs={3} sm={2}>
                                <Typography
                                    variant="body2"
                                    children="DR"
                                    fontWeight={800}
                                />
                            </Grid>
                            <Grid item xs={3} sm={2}>
                                <Typography
                                    variant="body2"
                                    children="CR"
                                    fontWeight={800}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            sx={{ py: 1 }}
                            borderBottom={1}
                            borderTop={1}
                            borderColor={grey[400]}
                            alignItems="center"
                        >
                            <Grid item xs={6} sm={8}>
                                <Typography
                                    variant="body2"
                                    children={paidEntry.desp}
                                />
                                <Typography
                                    variant="body2"
                                    children={"AC: " + paidEntry.accounts.name}
                                />
                            </Grid>
                            <Grid item xs={3} sm={2}>
                                <Typography
                                    variant="body2"
                                    children={paidEntry.debit}
                                />
                            </Grid>
                            <Grid item xs={3} sm={2}>
                                <Typography
                                    variant="body2"
                                    children={paidEntry.credit}
                                />
                            </Grid>
                        </Grid>
                    </>
                )}
            {state.map((v, i) => (
                <Grid
                    container
                    key={i}
                    borderBottom={1}
                    borderColor={grey[400]}
                    alignItems="center"
                >
                    <Grid item xs={1} sm={1}>
                        <IconButton
                            sx={{
                                border: 1,
                                borderColor: red[600],
                                my: 0.5,
                            }}
                            size="small"
                            onClick={() => hanldeDelete(i)}
                            children={<DeleteForever color="error" />}
                        />
                    </Grid>
                    <Grid item xs={5} sm={7}>
                        <Typography variant="body2" children={v.desp} />
                        <Typography
                            variant="body2"
                            children={"AC: " + v.accounts.name}
                        />
                    </Grid>
                    <Grid item xs={3} sm={2}>
                        <Typography variant="body2" children={v.debit} />
                    </Grid>
                    <Grid item xs={3} sm={2}>
                        <Typography variant="body2" children={v.credit} />
                    </Grid>
                </Grid>
            ))}
            {/* <Grid
                container
                borderBottom={1}
                borderColor={grey[400]}
                alignItems="center"
                color={blue[600]}
                py={0.5}
            >
                <Grid item xs={6} sm={8}>
                    <Typography
                        variant="body2"
                        children="Total"
                        fontWeight={800}
                    />
                </Grid>
                <Grid item xs={3} sm={2}>
                    <Typography
                        variant="body2"
                        children={totals.dr}
                        fontWeight={800}
                    />
                </Grid>
                <Grid item xs={3} sm={2}>
                    <Typography
                        variant="body2"
                        children={totals.cr}
                        fontWeight={800}
                    />
                </Grid>
            </Grid> */}
            {state.length > 0 && paidType !== "" && (
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography>{paidType}</Typography>
                    <Button
                        onClick={hanldeSubmit}
                        variant="outlined"
                        sx={{ mt: 1 }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            {busy && (
                                <CircularProgress size={20} sx={{ mr: 2 }} />
                            )}
                            <Typography variant="button">Submit</Typography>
                        </Stack>
                    </Button>
                </Stack>
            )}
        </Box>
    );
};
export default JREntries;

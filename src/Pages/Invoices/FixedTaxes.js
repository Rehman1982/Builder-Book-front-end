import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableRow,
    TextField,
    IconButton,
    TableContainer,
    Stack,
    Autocomplete,
    Dialog,
    DialogContent,
    Button,
    Typography,
    Box,
} from "@mui/material";
import { blue, grey, pink } from "@mui/material/colors";
import React, { useContext, useEffect, useState } from "react";
import CONTEXT from "./context";
import { round } from "lodash";
import { Delete, Edit } from "@mui/icons-material";

export const FixedTaxes = ({ variant }) => {
    const {
        taxes,
        billingDetailsTotal,
        valueExludingTax,
        setValueExludingTax,
        includedTaxes,
        setIncludedTaxes,
        invoicePrefix,
        setInvoicePrefix,
        invoice,
        setInvoice,
    } = useContext(CONTEXT);

    useEffect(() => {
        console.log("afasdfdsafdsfdsf");
        if (variant == "create") {
            // if (invoice?.invoiceType?.id) {
            const a = taxes.filter((v, i) => v.included == 1);
            const b = a.map((v, i) => {
                v["tax"] = { id: v.id, name: v.name };
                v["tax_rate"] = v.tax_rate;
                v["tax_value"] = (valueExludingTax * v.tax_rate) / 100;
                v["id"] = "";
                return v;
            });
            setIncludedTaxes(b);
            // }
        }
    }, []);

    useEffect(() => {
        const VBT = round(getBeforTaxValue(billingDetailsTotal, includedTaxes));
        setValueExludingTax(VBT);
    }, [billingDetailsTotal]);
    useEffect(() => {
        console.log(includedTaxes);
    }, [includedTaxes]);
    const handleDelete = (index) => {
        const newInclTaxes = includedTaxes.filter((v, i) => i !== index);
        setIncludedTaxes(newInclTaxes);
    };

    return (
        <Box>
            {billingDetailsTotal > 0 && includedTaxes.length > 0 && (
                <TableContainer>
                    <Table>
                        <TableBody>
                            {includedTaxes.map((v, i) => (
                                <TableRow key={i}>
                                    <TableCell size="small">
                                        {v?.tax?.name +
                                            " @ " +
                                            v.tax_rate +
                                            "%"}
                                    </TableCell>
                                    <TableCell
                                        size="small"
                                        align="right"
                                    ></TableCell>
                                    <TableCell
                                        size="small"
                                        align="right"
                                    ></TableCell>
                                    <TableCell size="small" align="right">
                                        {(valueExludingTax * v.tax_rate) / 100}
                                    </TableCell>
                                    {variant !== "view" && (
                                        <TableCell
                                            size="small"
                                            padding="checkbox"
                                        >
                                            <Stack
                                                direction="row"
                                                spacing={0.5}
                                                justifyContent="flex-end"
                                                width="100%"
                                            >
                                                <EditTaxRate
                                                    includedTaxes={
                                                        includedTaxes
                                                    }
                                                    setIncludedTaxes={
                                                        setIncludedTaxes
                                                    }
                                                    index={i}
                                                    valueExludingTax={
                                                        valueExludingTax
                                                    }
                                                />
                                                <IconButton
                                                    onClick={() =>
                                                        handleDelete(i)
                                                    }
                                                    sx={{
                                                        color: "white",
                                                        bgcolor: pink[500],
                                                        "&:hover": {
                                                            bgcolor: pink[200],
                                                        },
                                                    }}
                                                    size="small"
                                                    children={
                                                        <Delete
                                                            color="inherit"
                                                            fontSize="10px"
                                                        />
                                                    }
                                                />
                                            </Stack>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter sx={{ backgroundColor: grey[200] }}>
                            <TableRow>
                                <TableCell size="small">
                                    Value Exluding Sales Tax
                                </TableCell>
                                <TableCell
                                    size="small"
                                    align="right"
                                ></TableCell>
                                <TableCell
                                    size="small"
                                    align="right"
                                ></TableCell>
                                <TableCell size="small" align="right">
                                    {valueExludingTax}
                                </TableCell>
                                {variant !== "view" && (
                                    <TableCell size="small"></TableCell>
                                )}
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};
const getBeforTaxValue = (AfterTaxValue, taxes) => {
    const TotalTaxRate = taxes.reduce(
        (total, current, index) => (total += parseInt(current.tax_rate)),
        0
    );
    const TotalTaxesInRation = TotalTaxRate / 100 + 1;
    const BeforeTaxValue = AfterTaxValue / TotalTaxesInRation;
    return BeforeTaxValue;
};
const EditTaxRate = ({
    includedTaxes,
    setIncludedTaxes,
    valueExludingTax,
    index,
}) => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState(includedTaxes[index]["tax_rate"]);
    const handleUpdate = () => {
        setIncludedTaxes((prv) => {
            let a = [...prv];
            a[index]["tax_rate"] = state;
            a[index]["tax_value"] = (valueExludingTax * state) / 100;
            return a;
        });
        setOpen(false);
    };
    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
                size="small"
                sx={{
                    background: blue[200],
                    "&:hover": { background: blue[400] },
                }}
                children={<Edit fontSize="0.7rem" />}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <TextField
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        label="Tax Rate"
                        fullWidth
                        margin="dense"
                    />
                    <Button onClick={handleUpdate} variant="contained">
                        Update
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
};

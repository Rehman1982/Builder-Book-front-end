import {
    Box,
    Button,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
import CONTEXT from "./context";
import { Invoice } from "./Invoice";

export const PrintInvoice = React.forwardRef((props, ref) => {
    return (
        <Stack ref={ref} direction="column" margin={10}>
            <Typography variant="h3" gutterBottom>
                SALE TAX INVOICE
            </Typography>
            <Box mt={4}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Grid container>
                        <Grid item xs={6}>
                            <Typography variant="h6" gutterBottom>
                                {props.invoice?.company?.legalname}
                            </Typography>
                            <Typography fontSize="1rem">
                                {props.invoice?.company?.address}
                            </Typography>
                            {/* <Typography fontSize="1rem">
                                Arbab Road University Town Peshawar
                            </Typography> */}
                        </Grid>
                        <Grid item xs={6}>
                            <Stack direction="row" justifyContent="flex-end">
                                <Box
                                    component={Paper}
                                    width="100px"
                                    height="100px"
                                    sx={{
                                        borderRadius: 50,
                                        overflow: "hidden",
                                    }}
                                >
                                    <img
                                        width="100%"
                                        height="100%"
                                        src="../images/logo4.jpeg"
                                    />
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </Stack>
            </Box>
            <Box mt={4}>
                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <BuyerDetails data={props.invoice} />
                    </Grid>
                    <Grid item xs={6}>
                        <SupplierDetails data={props.invoice} />
                    </Grid>
                </Grid>
            </Box>
            <Box mt={4}>
                <BillingDetails
                    data={props.billingDetails}
                    total={props.totalbill}
                />
            </Box>
            <Box>
                <IncludedTaxes
                    data={props.includedTaxes}
                    billTotal={props.totalbill}
                />
            </Box>
            <Box>
                <Taxes data={props.taxesDetails} billTotal={props.totalbill} />
            </Box>
        </Stack>
    );
});
const BuyerDetails = () => {
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell
                        padding="none"
                        colSpan={2}
                        size="small"
                        width="20%"
                    >
                        <Typography fontSize="1rem" gutterBottom>
                            Buyer's Details
                        </Typography>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="20%">
                        Name
                    </TableCell>
                    <TableCell size="small" width="80%">
                        SINOHYDRO CORPORATION LIMITED
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="20%">
                        Address
                    </TableCell>
                    <TableCell size="small" width="80%">
                        61-A Nazim ud din road, Block LF 7/4, Blue Area
                        Islamabad Pakistan
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="20%">
                        Telephone
                    </TableCell>
                    <TableCell size="small" width="80%">
                        0300-5977893
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="20%">
                        NTN
                    </TableCell>
                    <TableCell size="small" width="80%">
                        1234678910
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="20%">
                        STRN
                    </TableCell>
                    <TableCell size="small" width="80%">
                        1234678910
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};
const SupplierDetails = ({ data }) => {
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell padding="none" colSpan={2} size="small">
                        <Typography fontSize="1rem" gutterBottom>
                            Invoice Details
                        </Typography>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="30%">
                        Date
                    </TableCell>
                    <TableCell size="small" width="70%">
                        {data?.date}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="30%">
                        Invoice NO.
                    </TableCell>
                    <TableCell size="small" width="70%">
                        {data?.invoiceType?.type +
                            "-" +
                            data?.date +
                            "-" +
                            data?.number}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="30%">
                        NTN
                    </TableCell>
                    <TableCell size="small" width="70%">
                        {data?.company?.ntn}
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell size="small" width="30%">
                        STRN
                    </TableCell>
                    <TableCell size="small" width="70%">
                        {data?.company?.strn}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};
const BillingDetails = ({ data, total }) => {
    return (
        <Box>
            <Typography variant="h6">Billing Details</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell size="small" width="40%">
                            <Typography variant="subtitle1" fontWeight={700}>
                                Description
                            </Typography>
                        </TableCell>
                        <TableCell size="small" align="right">
                            <Typography variant="subtitle1" fontWeight={700}>
                                Qty
                            </Typography>
                        </TableCell>
                        <TableCell size="small" align="right">
                            <Typography variant="subtitle1" fontWeight={700}>
                                Rate
                            </Typography>
                        </TableCell>
                        <TableCell size="small" align="right">
                            <Typography variant="subtitle1" fontWeight={700}>
                                Amount
                            </Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                {data.length > 0 && (
                    <>
                        <TableBody>
                            {data.map((v, i) => (
                                <TableRow key={"details" + i}>
                                    <TableCell size="small" width="40%">
                                        <Typography variant="body1">
                                            {i + 1 + " "}
                                            {v.desp}
                                        </Typography>
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <Typography variant="body1">
                                            {v.qty}
                                        </Typography>
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <Typography variant="body1">
                                            {v.rate}
                                        </Typography>
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <Typography variant="body1">
                                            {v.amount}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell size="small" width="40%">
                                    <Typography
                                        variant="body1"
                                        fontWeight={700}
                                    >
                                        Total Included Tax
                                    </Typography>
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
                                    <Typography
                                        variant="body1"
                                        fontWeight={700}
                                    >
                                        {total}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </>
                )}
            </Table>
        </Box>
    );
};
const IncludedTaxes = ({ data, billTotal }) => {
    return (
        <Box>
            <Table>
                {data.length > 0 && (
                    <>
                        <TableBody>
                            {data.map((v, i) => (
                                <TableRow key={"it" + i}>
                                    <TableCell
                                        colSpan={3}
                                        size="small"
                                        align="right"
                                    >
                                        <Typography fontSize="1rem">
                                            {v.tax?.name +
                                                "@" +
                                                v.tax_rate +
                                                "%"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <Typography fontSize="1rem">
                                            {v.tax_value}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={3} size="small" width="40%">
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                    >
                                        Total Before Tax
                                    </Typography>
                                </TableCell>
                                <TableCell size="small" align="right">
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={700}
                                    >
                                        {data.reduce(
                                            (t, v, i) => (t -= v.tax_value),
                                            billTotal
                                        )}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </>
                )}
            </Table>
        </Box>
    );
};
const Taxes = ({ data, billTotal }) => {
    return (
        <Grid container>
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
                <Table>
                    {data.length > 0 && (
                        <TableBody>
                            {data.map((v, i) => (
                                <TableRow key={"tax" + i}>
                                    <TableCell size="small">
                                        {v.tax?.name + " @ " + v.percent + "%"}
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        {v.amount}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    )}
                    <TableFooter>
                        <TableRow>
                            <TableCell size="small">
                                <Typography variant="h6">
                                    Payable Amount
                                </Typography>
                            </TableCell>
                            <TableCell size="small" align="right">
                                <Typography variant="h6">
                                    {data.reduce(
                                        (t, v, i) => (t += v.amount),
                                        billTotal
                                    )}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Grid>
        </Grid>
    );
};

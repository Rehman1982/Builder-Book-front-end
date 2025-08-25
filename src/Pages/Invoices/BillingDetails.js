import React, { useState } from "react";
import {
    Box,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { blue, grey, pink } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AddBillingDetails } from "./AddBillingDetails";
import { EditBillingDetails } from "./EditBillingDetails";
import { useContext } from "react";
import CONTEXT from "./context";
import { useEffect } from "react";
import { Error } from "../helpers/helpers";
import { FixedTaxes } from "./FixedTaxes";

const BillingDetails = ({ variant }) => {
    const { billingDetails, setBillingDetails, billingDetailsTotal, errors } =
        useContext(CONTEXT);
    const [state, setState] = useState(null);
    const [currentItem, setCurrentItem] = useState(null); // add time to edit
    const [deleteItem, setDeleteItem] = useState(null);
    const handleDelete = (index) => {
        const a = billingDetails.filter((_, i) => i !== index);
        setBillingDetails(a);
    };
    const handleEdit = (i, v) => {
        setCurrentItem({ index: i, value: v });
    };
    return (
        <Box>
            <Stack
                justifyContent="space-between"
                alignItems="center"
                direction="row"
                paddingY="8px"
            >
                <Typography variant="body1">Billing Details</Typography>
                {(variant == "create" || variant == "edit") && (
                    <>
                        <AddBillingDetails
                            setBillingDetails={setBillingDetails}
                            variant={variant}
                        />
                        <EditBillingDetails
                            currentItem={currentItem}
                            variant={variant}
                        />
                    </>
                )}
            </Stack>
            {billingDetailsTotal > 0 && (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: grey[200] }}>
                                <TableRow>
                                    <TableCell size="small">
                                        Description
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        Qty
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <Typography variant="body1">
                                            Rate
                                        </Typography>
                                        <Typography variant="caption">
                                            (Tax Included)
                                        </Typography>
                                    </TableCell>
                                    <TableCell size="small" align="right">
                                        <Typography variant="body1">
                                            Amount
                                        </Typography>
                                        <Typography variant="caption">
                                            (Tax Included)
                                        </Typography>
                                    </TableCell>
                                    {variant !== "view" && (
                                        <TableCell size="small"></TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billingDetails.map((v, i) => (
                                    <TableRow key={i}>
                                        <TableCell size="small">
                                            {v.desp}
                                        </TableCell>
                                        <TableCell size="small" align="right">
                                            {v.qty}
                                        </TableCell>
                                        <TableCell size="small" align="right">
                                            {v.rate}
                                        </TableCell>
                                        <TableCell size="small" align="right">
                                            {v.qty * v.rate}
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
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleEdit(i, v)
                                                        }
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                blue[300],
                                                        }}
                                                    >
                                                        <EditIcon
                                                            fontSize="10px"
                                                            sx={{
                                                                color: "#FFFFFF",
                                                            }}
                                                        />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() =>
                                                            handleDelete(i)
                                                        }
                                                        size="small"
                                                        sx={{
                                                            backgroundColor:
                                                                pink[500],
                                                        }}
                                                    >
                                                        <DeleteIcon
                                                            fontSize="10px"
                                                            sx={{
                                                                color: "#FFFFFF",
                                                            }}
                                                        />
                                                    </IconButton>
                                                </Stack>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter sx={{ backgroundColor: grey[200] }}>
                                <TableRow>
                                    <TableCell size="small">
                                        Total Included Sale Tax
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
                                        {billingDetailsTotal}
                                    </TableCell>
                                    {variant !== "view" && (
                                        <TableCell size="small"></TableCell>
                                    )}
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                    {/* <FixedTaxes variant={variant} /> */}
                </>
            )}
        </Box>
    );
};
export default BillingDetails;

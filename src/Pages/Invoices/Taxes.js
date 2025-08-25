import { Add } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    TextField,
    Typography,
} from "@mui/material";
import { blue, grey, orange } from "@mui/material/colors";
import React from "react";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import { useContext } from "react";
import CONTEXT from "./context";
import { round } from "lodash";

const Taxes = ({ variant }) => {
    const {
        taxesDetails,
        setTaxesDetails,
        taxesDetailsTotal,
        billingDetails,
        billingDetailsTotal,
        valueExludingTax,
    } = useContext(CONTEXT);
    const handleDelete = (index) => {
        const newTaxes = taxesDetails.filter((v, i) => i !== index);
        setTaxesDetails(newTaxes);
    };
    return (
        <Box>
            {billingDetailsTotal > 0 && (
                <Grid container>
                    <Grid item xs={6}>
                        <Typography variant="body1">Instructions</Typography>
                    </Grid>
                    <Grid item xs={6} component={Paper}>
                        {/* {variant !== "view" && (
                            <Stack
                                direction="row"
                                justifyContent="flex-end"
                                alignItems="center"
                                my={1}
                            >
                                <AddTax />
                            </Stack>
                        )} */}
                        <TableContainer>
                            <Table>
                                <TableBody>
                                    {variant !== "view" && (
                                        <TableRow>
                                            <TableCell
                                                size="small"
                                                align="right"
                                                colSpan={4}
                                            >
                                                <AddTax />
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {taxesDetails.map((v, i) => (
                                        <TableRow key={i}>
                                            <TableCell size="small">
                                                {v.tax && v.tax.name}
                                            </TableCell>
                                            <TableCell
                                                size="small"
                                                align="right"
                                            >
                                                {v.percent}%
                                            </TableCell>
                                            <TableCell
                                                size="small"
                                                align="right"
                                            >
                                                {v.amount}
                                            </TableCell>
                                            {variant !== "view" && (
                                                <TableCell
                                                    size="small"
                                                    align="right"
                                                >
                                                    <IconButton
                                                        onClick={() =>
                                                            handleDelete(i)
                                                        }
                                                        size="small"
                                                        sx={{
                                                            border: 1,
                                                            borderColor:
                                                                blue[100],
                                                        }}
                                                    >
                                                        <DeleteIcon
                                                            color="error"
                                                            fontSize="10px"
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                                <TableFooter
                                    sx={{ backgroundColor: orange[50] }}
                                >
                                    <TableRow>
                                        <TableCell size="small">
                                            <Typography
                                                variant="body1"
                                                color={orange[900]}
                                            >
                                                Payable Amount
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            size="small"
                                            align="right"
                                        ></TableCell>
                                        <TableCell size="small" align="right">
                                            <Typography
                                                variant="body1"
                                                color={orange[900]}
                                            >
                                                {billingDetailsTotal +
                                                    taxesDetailsTotal}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            size="small"
                                            align="right"
                                            padding="none"
                                        ></TableCell>
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};
export const AddTax = () => {
    const {
        taxes,
        taxesDetails,
        setTaxesDetails,
        billingDetails,
        billingDetailsTotal,
        valueExludingTax,
    } = useContext(CONTEXT);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        id: "",
        tax: { id: 1, name: "" },
        percent: 0,
        amount: 0,
    });
    const handleAdd = () => {
        setTaxesDetails((prv) => {
            const newState = [...prv, state];
            return newState;
        });
        setState({
            tax: null,
            percent: 0,
            amount: 0,
        });
        setOpen(false);
    };
    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
                size="small"
                sx={{ bgcolor: blue[400] }}
                children={<Add fontSize="7px" />}
            />
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>Add Tax</DialogTitle>
                <DialogContent>
                    <Autocomplete
                        options={taxes.filter((v, i) => v.included == 0)}
                        getOptionLabel={(option) => option.name}
                        value={state.tax}
                        onChange={(e, v) => {
                            setState({ ...state, tax: v });
                        }}
                        renderInput={(option) => (
                            <TextField
                                {...option}
                                label="Select Tax"
                                margin="dense"
                                size="small"
                            />
                        )}
                    />
                    <TextField
                        fullWidth
                        name="percent"
                        value={state.percent}
                        onChange={(e) =>
                            setState({
                                ...state,
                                percent: e.target.value,
                                amount: round(
                                    (valueExludingTax * e.target.value) / 100
                                ),
                            })
                        }
                        label="Tax Rate"
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        name="amount"
                        value={state.amount}
                        label="Tax Amount"
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleAdd}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default Taxes;

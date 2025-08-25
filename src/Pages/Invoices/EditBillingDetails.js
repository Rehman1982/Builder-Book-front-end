import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { blue } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import { useEffect } from "react";
import { useContext } from "react";
import CONTEXT from "./context";
import axios from "axios";
import { Error } from "../helpers/helpers";
const defaultState = {
    desp: "",
    qty: "",
    rate: "",
    amount: "",
};
export const EditBillingDetails = ({ currentItem, variant }) => {
    const { setBillingDetails, invoice, errors, setErrors } =
        useContext(CONTEXT);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState(defaultState);
    const handleUpdate = () => {
        setBillingDetails((prv) => {
            let prvState = [...prv];
            prvState[currentItem.index]["desp"] = state.desp;
            prvState[currentItem.index]["qty"] = state.qty;
            prvState[currentItem.index]["rate"] = state.rate;
            prvState[currentItem.index]["amount"] = state.amount;
            return prvState;
        });
        setState(defaultState);
        setOpen(false);
        // }
    };
    useEffect(() => {
        if (currentItem) {
            setState(currentItem.value);
            setOpen(true);
        }
    }, [currentItem]);
    return (
        <>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                sx={{ padding: 5 }}
            >
                <DialogTitle>Update Detail</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        name="desp"
                        value={state.desp}
                        onChange={(e) =>
                            setState({ ...state, desp: e.target.value })
                        }
                        helperText={
                            <Error name="details.desp" errors={errors} />
                        }
                    />
                    <TextField
                        name="qty"
                        value={state.qty}
                        onChange={(e) =>
                            setState({ ...state, qty: e.target.value })
                        }
                        margin="dense"
                        fullWidth
                        label="Qty"
                        helperText={
                            <Error name="details.qty" errors={errors} />
                        }
                    />
                    <TextField
                        name="rate"
                        value={state.rate}
                        onChange={(e) =>
                            setState({ ...state, rate: e.target.value })
                        }
                        margin="dense"
                        fullWidth
                        label="Rate"
                        helperText={
                            <Error name="details.rate" errors={errors} />
                        }
                    />
                    <TextField
                        name="amount"
                        value={state.qty * state.rate}
                        onChange={(e) =>
                            setState({ ...state, amount: e.target.value })
                        }
                        margin="dense"
                        fullWidth
                        label="Amount"
                    />
                </DialogContent>
                {state.qty && state.rate && (
                    <DialogActions>
                        <Button onClick={handleUpdate} variant="contained">
                            Update
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
};

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
    id: "",
    desp: "",
    qty: "",
    rate: "",
    amount: "",
};
export const AddBillingDetails = ({ variant }) => {
    const { setBillingDetails, invoice, errors, setErrors } =
        useContext(CONTEXT);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState(defaultState);
    const handleAdd = () => {
        // if (variant == "create") {
        setBillingDetails((prv) => {
            let newArray = [...prv, state];
            return newArray;
        });
        setOpen(false);
        setState(defaultState);
        // }
        // if (variant == "edit") {
        //     const details = state;
        //     (async () => {
        //         const res = await axios.put(
        //             route("invoiceNew.update", {
        //                 invoiceNew: 1,
        //                 reqType: "detail_add",
        //             }),
        //             {
        //                 invoice,
        //                 details,
        //             }
        //         );
        //         if (res.status == 200) {
        //             alert("success");
        //             setOpen(false);
        //             setState(defaultState);
        //         }
        //         if (res.status == 203) {
        //             console.log(res.data);
        //             setErrors(res.data);
        //         }
        //     })();
        // }
    };
    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
                size="small"
                sx={{
                    border: 1,
                    borderColor: blue[200],
                }}
            >
                <AddIcon fontSize="10px" />
            </IconButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                sx={{ padding: 5 }}
            >
                <DialogTitle>Add Detail</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        name="desp"
                        helperText={<Error name="desp" errors={errors} />}
                        value={state.desp}
                        onChange={(e) =>
                            setState({ ...state, desp: e.target.value })
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
                        helperText={<Error name="qty" errors={errors} />}
                    />
                    <TextField
                        name="rate"
                        value={state.rate}
                        onChange={(e) =>
                            setState({ ...state, rate: e.target.value })
                        }
                        margin="dense"
                        fullWidth
                        label="Rate (Tax Inclusive)"
                        helperText={<Error name="rate" errors={errors} />}
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
                        <Button onClick={handleAdd} variant="contained">
                            Add
                        </Button>
                    </DialogActions>
                )}
            </Dialog>
        </>
    );
};

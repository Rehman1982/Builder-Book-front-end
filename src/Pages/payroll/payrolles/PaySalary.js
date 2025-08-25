import {
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
} from "@mui/material";
import { lightGreen } from "@mui/material/colors";
import axios from "axios";
import React, { forwardRef, useEffect } from "react";
import { useState } from "react";
import { useImperativeHandle } from "react";
import { Error } from "../../helpers/helpers";

const PaySalary = forwardRef(({ payroll_id }, ref) => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        desp: "",
        ref: "",
    });
    const [errors, setErrors] = useState({});
    const handleClose = () => {
        setState({});
        setOpen(false);
    };
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => handleClose(),
    }));
    const getPayrollData = async () => {
        try {
            const res = await axios.get(
                route("payroll.payment.show", { payment: 1 }),
                { params: { payroll_id: payroll_id } }
            );
            if (res.status == 200) {
                setState(res.data);
            }
            console.log(res.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(route("payroll.payment.store"), state);
            if (res.status == 200) {
                console.log("Call in Success", res.data);
            }
            if (res.status == 203) {
                console.log("Validattion Errors", res.data);
                setErrors(res.data);
            }
        } catch (error) {
            console.log(error.response);
        }
    };
    useEffect(() => {
        console.log(payroll_id);
        getPayrollData();
    }, [payroll_id]);
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Pay Salary</DialogTitle>
            <DialogContent>
                <TextField
                    name="payableAmount"
                    label="Payable Salary"
                    defaultValue={state.payableAmount || ""}
                    disabled
                    fullWidth
                    margin="dense"
                />
                <TextField
                    name="Amount"
                    label="Payment Amount"
                    defaultValue={state.payableAmount || ""}
                    fullWidth
                    margin="dense"
                    disabled
                />
                <TextField
                    name="ref"
                    label="Payment ref number e.g (cheque, payment voucher etc)"
                    value={state.ref}
                    onChange={(e) =>
                        setState({ ...state, ref: e.target.value })
                    }
                    fullWidth
                    margin="dense"
                    error={"ref" in errors}
                    helperText={<Error errors={errors} name="ref" />}
                />
                <TextField
                    name="desp"
                    label="Notation"
                    value={state.desp}
                    onChange={(e) =>
                        setState({ ...state, desp: e.target.value })
                    }
                    fullWidth
                    margin="dense"
                    multiline
                    rows={3}
                    error={"desp" in errors}
                    helperText={<Error errors={errors} name="desp" />}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={() => setOpen(false)}>
                    Close
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    sx={{
                        bgcolor: lightGreen[700],
                        ":hover": { bgcolor: lightGreen[500] },
                    }}
                >
                    Submit to Pay
                </Button>
            </DialogActions>
        </Dialog>
    );
}, []);

export default React.memo(PaySalary);

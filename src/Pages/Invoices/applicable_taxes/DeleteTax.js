import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
} from "@mui/material";
import { blue, grey, pink } from "@mui/material/colors";
import axios from "axios";
import React, { useContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Delete } from "@mui/icons-material";
import { Error } from "../../helpers/helpers";

export const DeleteTax = ({ taxes, setTaxes, deleteItem }) => {
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const [state, setState] = useState(null);
    const [signatoryCode, setSignatoryCode] = useState("");
    const handleFormClose = () => {
        setOpen(false);
        setState(null);
        setSignatoryCode("");
        setErrors({});
    };
    const handleDelete = async () => {
        setErrors({});
        const payload = {
            applicabletax: 1,
            taxData: state,
            signatoryCode: signatoryCode,
        };
        console.log(payload);
        const res = await axios.delete(
            route("invoicing.applicabletaxes.destroy", payload)
        );
        if (res.status == 203) {
            console.log(res);
            setErrors(res.data);
            setMessage("Something Went Wrong");
            setSeverity("error");
            showAlert(true);
        }
        if (res.status == 200) {
            console.log(res);
            let filteredData = taxes.filter((v, i) => v.id !== state.id);
            setTaxes(filteredData);
            handleFormClose();
        }
    };
    useEffect(() => {
        if (deleteItem !== null) {
            setState(deleteItem);
            setOpen(true);
        }
    }, [deleteItem]);
    return (
        <>
            <Dialog open={open} onClose={handleFormClose}>
                <DialogTitle>Are you Sure?</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        This action will delete the Tax permnantly and can not
                        be undone. Are you sure to proceed further?
                    </Typography>
                    <TextField
                        fullWidth
                        name="signatorycode"
                        value={signatoryCode}
                        onChange={(e) => setSignatoryCode(e.target.value)}
                        label="Signatory Code"
                        helperText={
                            <Error name="signatoryCode" errors={errors} />
                        }
                    />
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                    }}
                >
                    <Button variant="text" onClick={handleFormClose}>
                        Dismiss without Action
                    </Button>
                    <Button
                        onClick={handleDelete}
                        sx={{
                            background: pink[600],
                            color: grey[50],
                            "&:hover": { background: pink[500] },
                        }}
                    >
                        Yes Iam Sure!
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

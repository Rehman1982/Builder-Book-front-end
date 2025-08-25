import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Dialog,
    DialogContent,
    Modal,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { Button } from "@mui/material";
import { BOQContext } from "./BOQContext";
import axios from "axios";
import { Error } from "../helpers/helpers";

export default function Delete(props) {
    const { toggles, setToggles, showAlert, setMessage } =
        useContext(BOQContext);
    const [state, setState] = useState({ id: "", code: "" });
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setErrors({});
        setState({ id: "", code: "" });
        setToggles({ ...toggles, deleteForm: false });
    };
    const handleYes = async () => {
        await axios
            .delete(route("estimation.boq.destroy", { boq: 1, ...state }))
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.errors) {
                        setErrors(res.data.errors);
                        console.log(res.data.errors);
                    } else {
                        console.log(res.data);
                        setMessage("Delete Sucessfull!");
                        showAlert(true);
                        props.data.setRefresh(true);
                        handleClose();
                    }
                }
            });
    };
    const handleNo = () => {
        handleClose();
    };
    useEffect(() => {
        if (toggles.deleteForm) {
            // console.log(props.data.selectItem.id);
            setState({ ...state, id: props.data.selectItem.id });
            handleOpen();
        }
    }, [toggles.deleteForm]);
    return (
        <>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Typography variant="h5">
                        Are your sure to delete BOQ Item?
                    </Typography>
                    <Typography variant="body1">
                        This action will perminantly delete the Item and can't
                        be undo.
                    </Typography>
                    <TextField
                        sx={{ mt: 2 }}
                        required={true}
                        type="number"
                        fullWidth={true}
                        value={state.code}
                        onChange={(e) => {
                            setState({ ...state, code: e.target.value });
                        }}
                        label="Signatory Code"
                        error={"code" in errors}
                        helperText={<Error errors={errors} name="code" />}
                    ></TextField>
                    <Stack
                        mt={2}
                        direction="row"
                        justifyContent="end"
                        spacing={2}
                    >
                        <Button variant="contained" onClick={handleYes}>
                            Yes
                        </Button>
                        <Button variant="outlined" onClick={handleNo}>
                            No
                        </Button>
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
}

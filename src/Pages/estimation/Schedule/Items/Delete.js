import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
} from "@mui/material";
import React, { useState } from "react";
import { Error } from "../../../helpers/helpers";
import axios from "axios";

const Delete = ({ id, setRefresh, closeParentForm }) => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ id: id, code: "" });
    const [errors, setErrors] = useState({});
    const handleDelete = async () => {
        const res = await axios.delete(
            route("estimation.schedules.items.destroy", { item: 1 }),
            { data: state }
        );
        if (res.status == 203) {
            setErrors(res.data);
        }
        if (res.status == 200) {
            console.log(res.data);
            setOpen(false);
            setErrors({});
            closeParentForm(false);
            setState({ id: "", code: "" });
            setRefresh(true);
        }
        console.log(res);
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="outlined"
                color="error"
            >
                Delete
            </Button>
            <Dialog open={open} sx={{ p: 3 }} onClose={() => setOpen(false)}>
                <DialogTitle>
                    Are you Sure to Delete? This action can't be undone!
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        name="code"
                        value={state.code}
                        onChange={(e) =>
                            setState({ ...state, code: e.target.value })
                        }
                        margin="dense"
                        label="Signatory Code"
                        error={"code" in errors}
                        helperText={<Error errors={errors} name="code" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} variant="outlined">
                        I am not Sure
                    </Button>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                    >
                        I am Sure
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default Delete;

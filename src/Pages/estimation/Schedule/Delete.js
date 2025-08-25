import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { Alert } from "../../../context/AlertBar/AlertBar";
import { Error } from "../../helpers/helpers";
import { DeleteForever } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

const Delete = ({ id, setRefresh }) => {
    const [open, setOpen] = useState(false);
    const { showAlert, setMessage, setSevirty } = useContext(Alert);
    const [state, setState] = useState({ id: id, code: "" });
    const [errors, setErrors] = useState({});
    const handleChange = (event) => {
        const { name, value } = event.target;
        setState({ ...state, [name]: value });
    };
    const handleDelete = async () => {
        const res = await axios.delete(route("estimation.schedules.destroy"), {
            data: state,
        });
        console.log(res);
        if (res.status == 200) {
            setMessage("Delete Successfull");
            showAlert(true);
            setRefresh(true);
            setOpen(false);
        }
        if (res.status == 203) {
            setErrors(res.data);
        }
    };
    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                sx={{
                    border: 1,
                    borderColor: blue[600],
                }}
            >
                <DeleteForever />
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} sx={{ p: 2 }}>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Are you sure? this action can't be undone
                    </Typography>
                    <TextField
                        name="code"
                        label="Signatory Code"
                        value={state.code}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        error={"code" in errors}
                        helperText={<Error errors={errors} name="code" />}
                    />
                </DialogContent>
                <DialogActions>
                    <ButtonGroup>
                        <Button
                            onClick={() => setOpen(false)}
                            variant="outlined"
                        >
                            I am Not Sure
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="contained"
                            color="error"
                        >
                            I am Sure!
                        </Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default Delete;

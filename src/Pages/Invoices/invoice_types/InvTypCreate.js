import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import { blue } from "@mui/material/colors";
import { useEffect } from "react";
import axios from "axios";
import { Error } from "../../helpers/helpers";
import { memo } from "react";
import { useCallback } from "react";
export const InvoiceTypeCreate = React.memo(
    ({ types, setTypes, currentType, setCurrentType }) => {
        const [open, setOpen] = useState(false);
        const [errors, setErrors] = useState({});
        const [state, setState] = useState({
            id: "",
            type: "",
            status: "",
        });
        const closeForm = () => {
            setState({
                id: "",
                type: "",
                status: "",
            });
            setOpen(false);
            setCurrentType(null);
        };
        const hanldeSave = async () => {
            const res = await axios.post(route("invoicing.invoicetype.store"), {
                ...state,
            });
            if (res.status == 203) {
                setErrors(res.data);
            }
            if (res.status == 200) {
                let index = types.findIndex((v, i) => v.id == res.data.id);
                if (index !== -1) {
                    let updatedTax = { ...res.data, update: 1 };
                    let a = [...types];
                    a[index] = { ...updatedTax };
                    setTypes(a);
                } else {
                    let freshTax = { ...res.data, fresh: 1 };
                    setTypes((prv) => {
                        let a = [freshTax, ...prv];
                        return a;
                    });
                }
                closeForm();
            }
        };
        useEffect(() => {
            if (currentType !== null) {
                setState(currentType);
                setOpen(true);
            }
        }, [currentType]);
        return (
            <>
                <IconButton
                    sx={{ border: 1, borderColor: blue[800] }}
                    onClick={() => setOpen(true)}
                >
                    <Add />
                </IconButton>
                <Dialog open={open} onClose={closeForm}>
                    <DialogTitle>
                        {currentType ? "Edit " : "Create"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            name="type"
                            value={state.type}
                            onChange={(e) =>
                                setState({ ...state, type: e.target.value })
                            }
                            label="Invoice Type"
                            margin="dense"
                            helperText={<Error name="type" errors={errors} />}
                            fullWidth
                        />
                        <TextField
                            select
                            name="status"
                            value={state.status}
                            onChange={(e) =>
                                setState({ ...state, status: e.target.value })
                            }
                            label="Status"
                            margin="dense"
                            fullWidth
                            helperText={<Error name="status" errors={errors} />}
                        >
                            <MenuItem key="active" value="active">
                                Active
                            </MenuItem>
                            <MenuItem key="deactive" value="deactive">
                                De-Active
                            </MenuItem>
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Stack direction="row" justifyContent="flex-end">
                            <Button variant="contained" onClick={hanldeSave}>
                                Save
                            </Button>
                        </Stack>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
);

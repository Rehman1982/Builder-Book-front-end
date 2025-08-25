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

export const ApplicableTaxCreate = React.memo(
    ({ taxes, setTaxes, currentTax, setCurrentTax }) => {
        const [open, setOpen] = useState(false);
        const [errors, setErrors] = useState({});
        const [accounts, setAccounts] = useState([
            // { id: 1, name: "", type: "liability" },
        ]);
        const closeForm = () => {
            setState({
                id: "",
                name: "",
                desp: "",
                tax_rate: "",
                tax_type: "",
                included: "",
                account: { id: "", name: "", type: "" },
            });
            setOpen(false);
            setCurrentTax(null);
        };
        const [state, setState] = useState({
            id: "",
            name: "",
            desp: "",
            tax_rate: "",
            tax_type: "",
            included: "",
            account: { id: "", name: "", type: "" },
        });
        const hanldeSave = async () => {
            const res = await axios.post(
                route("invoicing.applicabletaxes.store"),
                {
                    ...state,
                }
            );
            if (res.status == 203) {
                setErrors(res.data);
            }
            if (res.status == 200) {
                let index = taxes.findIndex((v, i) => v.id == res.data.id);
                if (index !== -1) {
                    let updatedTax = { ...res.data, update: 1 };
                    let a = [...taxes];
                    a[index] = { ...updatedTax };
                    setTaxes(a);
                } else {
                    let freshTax = { ...res.data, fresh: 1 };
                    setTaxes((prv) => {
                        let a = [freshTax, ...prv];
                        return a;
                    });
                }
                closeForm();
            }
        };
        const getAccounts = useCallback(async () => {
            const res = await axios.get(
                route("invoicing.applicabletaxes.create")
            );
            console.log(res);
            if (res.status == 200) {
                setAccounts(res.data);
            }
            console.log(res.data);
        });
        useEffect(() => {
            getAccounts();
        }, []);
        useEffect(() => {
            if (currentTax !== null) {
                setState(currentTax);
                setOpen(true);
            }
        }, [currentTax]);
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
                        {currentTax ? "Edit Tax " : "Create Tax"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            name="name"
                            value={state.name}
                            onChange={(e) =>
                                setState({ ...state, name: e.target.value })
                            }
                            label="Name"
                            margin="dense"
                            helperText={<Error name="name" errors={errors} />}
                            fullWidth
                        />
                        <TextField
                            name="desp"
                            value={state.desp}
                            onChange={(e) =>
                                setState({ ...state, desp: e.target.value })
                            }
                            multiline
                            rows={5}
                            label="Description"
                            margin="dense"
                            fullWidth
                            helperText={<Error name="desp" errors={errors} />}
                        />
                        <TextField
                            name="tax_rate"
                            value={state.tax_rate}
                            onChange={(e) =>
                                setState({ ...state, tax_rate: e.target.value })
                            }
                            label="Rate in Percent"
                            margin="dense"
                            fullWidth
                            helperText={
                                <Error name="tax_rate" errors={errors} />
                            }
                        />
                        <TextField
                            select
                            name="tax_type"
                            value={state.tax_type}
                            onChange={(e) =>
                                setState({ ...state, tax_type: e.target.value })
                            }
                            label="Type"
                            margin="dense"
                            fullWidth
                            helperText={
                                <Error name="tax_type" errors={errors} />
                            }
                        >
                            <MenuItem key="indirect" value="indirect">
                                Indirect
                            </MenuItem>
                            <MenuItem key="direct" value="direct">
                                Direct
                            </MenuItem>
                        </TextField>
                        <TextField
                            select
                            name="included"
                            value={state.included}
                            onChange={(e) =>
                                setState({ ...state, included: e.target.value })
                            }
                            label="Included in Rate"
                            margin="dense"
                            fullWidth
                            helperText={
                                <Error name="included" errors={errors} />
                            }
                        >
                            <MenuItem key="1" value="1">
                                Yes
                            </MenuItem>
                            <MenuItem key="0" value="0">
                                NO
                            </MenuItem>
                        </TextField>
                        <Autocomplete
                            options={accounts}
                            getOptionLabel={(option) => option.name}
                            value={state.account}
                            onChange={(e, v) =>
                                setState({ ...state, account: v })
                            }
                            renderInput={(option) => (
                                <TextField
                                    {...option}
                                    fullWidth
                                    margin="dense"
                                    label="Select Account"
                                    helperText={
                                        <Error
                                            name="account.id"
                                            errors={errors}
                                        />
                                    }
                                />
                            )}
                        />
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

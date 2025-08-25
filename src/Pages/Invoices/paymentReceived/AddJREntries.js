import { Add } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
const defaultState = {
    id: "",
    desp: "",
    accounts: { id: "", name: "", type: "" },
    debit: 0,
    credit: 0,
};
const AddJREntries = ({ jrs, setJrs, accounts }) => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState(defaultState);

    const hanldeAdd = (remainOpen = true) => {
        let shouldAdd = true;
        if (state.debit == 0 && state.credit == 0) {
            alert("Debit and Credit cant be Zero");
            shouldAdd = false;
            return;
        }
        if (state.debit > 0 && state.credit > 0) {
            alert("Eiter Credit or Debit shall be used");
            shouldAdd = false;
            return;
        }
        if (shouldAdd) {
            let newState = [...jrs];
            newState.push(state);
            const matching = newState.reduce((t, c, i) => {
                const Index = t.findIndex(
                    (find) => find.accounts.id == c.accounts.id
                );
                if (Index !== -1) {
                    t[Index]["credit"] =
                        parseInt(t[Index]["credit"]) + parseInt(c.credit);
                    t[Index]["debit"] =
                        parseInt(t[Index]["debit"]) + parseInt(c.debit);
                } else {
                    t.push(c);
                }
                return t;
            }, []);
            setJrs(matching);
            setState(defaultState);
            setOpen(remainOpen);
        }
    };
    return (
        <Box>
            <IconButton
                onClick={() => setOpen(true)}
                size="small"
                children={<Add />}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <TextField
                        value={state.desp}
                        onChange={(e) =>
                            setState({ ...state, desp: e.target.value })
                        }
                        multiline
                        rows={4}
                        fullWidth
                        margin="dense"
                        label="Description"
                    />

                    <Autocomplete
                        options={accounts}
                        getOptionLabel={(opt) => opt.name}
                        value={state.accounts}
                        onChange={(e, v) => {
                            setState({ ...state, accounts: v });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Account"
                                size="small"
                                margin="dense"
                            />
                        )}
                    />
                    <TextField
                        value={state.debit}
                        name="debit"
                        onChange={(e) =>
                            setState({ ...state, debit: e.target.value })
                        }
                        margin="dense"
                        label="Debit"
                        size="small"
                    />
                    <TextField
                        value={state.credit}
                        name="credit"
                        onChange={(e) =>
                            setState({ ...state, credit: e.target.value })
                        }
                        margin="dense"
                        label="Credit"
                        size="small"
                    />
                    <Stack
                        mt={1}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Button
                            variant="contained"
                            onClick={() => hanldeAdd(false)}
                            children="Add & Close"
                            sx={{ mr: 2 }}
                        />
                        <Button
                            variant="contained"
                            onClick={() => hanldeAdd(true)}
                            children="Add & Remain Open"
                        />
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default AddJREntries;

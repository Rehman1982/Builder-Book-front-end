import {
    Autocomplete,
    Button,
    ButtonGroup,
    Dialog,
    DialogContent,
    Stack,
    TextField,
} from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const EditJREntry = ({ state, setState, accounts, index, setIndex }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState();
    const handleUpdate = () => {
        setState((prv) => {
            let a = [...prv];
            a[index]["account"] = data.account;
            a[index]["desp"] = data.desp;
            return a;
        });
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
        setIndex(null);
        setData();
    };
    useEffect(() => {
        console.log("EDitAcc", state[index], accounts, index);
        if (index !== null) {
            setData(state[index]);
            setOpen(true);
        }
    }, [index]);
    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogContent>
                <TextField
                    multiline
                    rows={5}
                    value={data?.desp}
                    onChange={(e) => setData({ ...data, desp: e.target.value })}
                    label="Description"
                    margin="dense"
                    fullWidth
                />
                <Autocomplete
                    options={data ? accounts[data.acType] : []}
                    getOptionLabel={(ops) => ops.name}
                    value={data?.account}
                    onChange={(e, v) => setData({ ...data, account: v })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Accounts"
                            margin="dense"
                        />
                    )}
                />

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    mt={2}
                >
                    <ButtonGroup>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleUpdate} variant="contained">
                            Update
                        </Button>
                    </ButtonGroup>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};
export default EditJREntry;

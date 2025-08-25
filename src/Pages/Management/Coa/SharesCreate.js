import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    IconButton,
    Typography,
    Icon,
    Stack,
    Grid,
    TextField,
    Autocomplete,
    DialogActions,
    Button,
} from "@mui/material";

import { blue, grey, orange } from "@mui/material/colors";
import axios from "axios";
import _ from "lodash";
import { Error } from "../../helpers/helpers";

const CreateShare = ({ data, project_id, refresh }) => {
    const [open, setOpen] = useState(false);
    const [projectId, setProjectId] = useState(null);
    const [state, setState] = useState([...data]);
    const [errors, setErrors] = useState({});
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const addRow = () => {
        setState([
            ...state,
            {
                id: "",
                user_id: "",
                account_id: "",
                share: "",
            },
        ]);
    };
    const deleteRow = (i) => {
        setState(_.filter(state, (_, index) => index !== i));
    };
    const getData = async () => {
        try {
            const result = await axios.get(route("management.shares.create"));
            setUsers(result.data.users);
            setAccounts(result.data.accounts);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSave = async () => {
        try {
            const result = await axios.post(route("management.shares.store"), {
                project_id: projectId,
                shares: state,
            });
            if (result.status == 203) {
                setErrors(result.data);
            }
            if (result.status == 200) {
                refresh();
                setOpen(false);
                setErrors({});
                setState([]);
            }
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        setProjectId(project_id);
        setState(data);
        getData();
    }, [open]);
    return (
        <>
            <IconButton
                onClick={() => setOpen(true)}
                sx={{ border: 2, borderColor: blue[800] }}
            >
                <Icon color="primary" children="edit" />
            </IconButton>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    bgcolor={blue[600]}
                    sx={{ color: grey[100], px: 2, py: 1 }}
                >
                    <Typography variant="h6">Update Shares</Typography>
                    <IconButton
                        onClick={() => setOpen(false)}
                        children={<Icon sx={{ color: grey[100] }}>close</Icon>}
                    />
                </Stack>
                <DialogContent>
                    <IconButton
                        sx={{ border: 2, borderColor: blue[800], mb: 1 }}
                        onClick={addRow}
                        children={<Icon color="primary" children="add" />}
                    />
                    {state?.map((v, i) => (
                        <Grid key={i} container alignItems={"center"}>
                            <Grid item xs={4}>
                                <Autocomplete
                                    fullWidth
                                    options={users}
                                    getOptionLabel={(opt) => opt.user}
                                    value={
                                        users.find((u) => u.id == v.user_id) ||
                                        null
                                    }
                                    onChange={(e, v) =>
                                        setState((prv) => {
                                            let newArray = [...prv];
                                            newArray[i]["user_id"] = v.id;
                                            return newArray;
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="User"
                                            margin="dense"
                                            fullWidth
                                            size="small"
                                            error={_.has(`shares.${i}.user_id`)}
                                            helperText={
                                                <Error
                                                    errors={errors}
                                                    name={`shares.${i}.user_id`}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete
                                    fullWidth
                                    options={accounts}
                                    getOptionLabel={(opt) => opt.acctname}
                                    value={
                                        accounts.find(
                                            (a) => a.id == v.account_id
                                        ) || null
                                    }
                                    onChange={(e, v) =>
                                        setState((prv) => {
                                            let newArray = [...prv];
                                            newArray[i]["account_id"] = v.id;
                                            return newArray;
                                        })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Equity Account"
                                            margin="dense"
                                            fullWidth
                                            size="small"
                                            error={_.has(
                                                `shares.${i}.account_id`
                                            )}
                                            helperText={
                                                <Error
                                                    errors={errors}
                                                    name={`shares.${i}.account_id`}
                                                />
                                            }
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    name="share"
                                    value={v.share || ""}
                                    onChange={(e) =>
                                        setState((prv) => {
                                            let newArray = [...prv];
                                            newArray[i]["share"] =
                                                e.target.value;
                                            return newArray;
                                        })
                                    }
                                    margin="dense"
                                    label="share in %"
                                    error={_.has(`shares.${i}.share`)}
                                    helperText={
                                        <Error
                                            errors={errors}
                                            name={`shares.${i}.share`}
                                        />
                                    }
                                />
                            </Grid>
                            <Grid item xs={1}>
                                <IconButton
                                    onClick={() => deleteRow(i)}
                                    children={
                                        <Icon
                                            color="error"
                                            children="delete_forever"
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>
                    ))}
                    <Grid
                        container
                        bgcolor={orange[100]}
                        border={1}
                        borderColor={"divider"}
                        p={1}
                    >
                        <Grid item xs={8}>
                            Total
                        </Grid>
                        <Grid item xs={4} textAlign={"right"}>
                            {_.round(
                                _.sumBy(state, (s) => Number(s.share)),
                                2
                            ) + "%"}
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default CreateShare;

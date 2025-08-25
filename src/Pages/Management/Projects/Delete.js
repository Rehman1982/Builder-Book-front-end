import {
    Badge,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import _ from "lodash";
import React from "react";
import { useState } from "react";
import { Error } from "../../helpers/helpers";
import { blue, grey } from "@mui/material/colors";

const Delete = ({ deleteIds, refresh }) => {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ code: "" });
    const [errors, setErrors] = useState({});
    const handleClose = () => {
        setOpen(false);
        setErrors({});
        setState({ code: "" });
    };
    const handleSubmit = async () => {
        try {
            const result = await axios.delete(
                route("management.projects.destroy", { project: "1" }),
                {
                    params: {
                        code: state.code,
                        ids: deleteIds,
                    },
                },
                {
                    method: "destroy",
                }
            );
            if (result.status == 203) {
                setErrors(result.data);
            }
            if (result.status == 200) {
                setOpen(false);
                refresh();
            }
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <Button variant="contained" onClick={() => setOpen(true)}>
                Delete
                <Badge
                    sx={{ ml: 3 }}
                    color="error"
                    badgeContent={deleteIds.length}
                />
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Stack
                    p={2}
                    bgcolor={blue[600]}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography sx={{ color: grey[100] }} variant="h6">
                        Confirm Delete
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        children={<Icon sx={{ color: grey[100] }}>close</Icon>}
                    />
                </Stack>

                <DialogContent>
                    <TextField
                        name="signatoreyCode"
                        value={state.code}
                        onChange={(e) =>
                            setState({ ...state, code: e.target.value })
                        }
                        label="Signatory Code"
                        margin="dense"
                        error={_.has(errors, "code")}
                        helperText={<Error errors={errors} name="code" />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit}>Delete</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
export default Delete;

import {
    Box,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogTitle,
    Icon,
    IconButton,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import _ from "lodash";
import React, { useState } from "react";
import { Error } from "../../helpers/helpers";
import { blue, grey, red } from "@mui/material/colors";

const Delete = ({ deleteIds, refresh }) => {
    const [code, setCode] = useState("");
    const [open, setOpen] = useState(false);
    return (
        <Box>
            <IconButton
                sx={{ border: 2, borderColor: red[600] }}
                children={<Icon color="error">delete</Icon>}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <Stack
                    px={2}
                    py={1}
                    bgcolor={blue[600]}
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography variant="h6">{title}</Typography>
                    <IconButton
                        sx={{ border: 1, BorderColor: blue[600] }}
                        children={<Icon sx={{ color: grey[100] }}>close</Icon>}
                    />
                </Stack>
                <Typography variant="body1" gutterBottom>
                    This action can't be undone. Are you sure you want to delete
                    the selected project(s)?
                </Typography>
                <TextField
                    label="Signatory Code"
                    name="code"
                    value={code || ""}
                    onChange={() => setCode(e.target.value)}
                    margin="dense"
                    error={_.has("code") ? true : false}
                    helperText={<Error errors={errors} name="code" />}
                />
                <DialogActions>
                    <ButtonGroup>
                        <Button>I'm sure Proceed</Button>
                        <Button>Cancel</Button>
                    </ButtonGroup>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
// export default Delete;

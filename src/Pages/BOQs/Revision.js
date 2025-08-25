import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    ButtonGroup,
    Button,
    Dialog,
    Divider,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    TextField,
    TableFooter,
    TableContainer,
    IconButton,
    Stack,
} from "@mui/material";
import { amber, grey, indigo, pink, red } from "@mui/material/colors";
import axios from "axios";
import { BOQContext } from "./BOQContext";
import EditSharpIcon from "@mui/icons-material/EditSharp";
import DeleteOutlineSharpIcon from "@mui/icons-material/DeleteOutlineSharp";
import LinearProgress from "@mui/material/LinearProgress";
//------------------------------------------------------------------------------------------------------------//
function Revision({ selectItem, RefreshParent }) {
    const { toggles, setToggles } = useContext(BOQContext);
    const [open, setOpen] = useState(false);
    const [boq, setBoq] = useState({
        id: "",
        desp: "",
        qty: 0,
        quoted_rate: 0,
    });
    const [revisions, setRevisions] = useState([{ qty: 0 }]);
    const [errors, setErrors] = useState({});
    const [edit, setEdit] = useState({ id: "", qty: "", show: false });
    const [del, setDel] = useState({ id: "", show: false });
    const [refresh, setRefresh] = useState(false);

    const handleClose = () => {
        setOpen(false);
        setToggles({ ...toggles, revisionCreate: false });
        RefreshParent(true);
    };
    const getData = async (boqId) => {
        await axios
            .get(route("estimation.boq.revision", { boq_id: boqId }))
            .then((res) => {
                if (res.status == 200) {
                    if (res.errors) {
                        setErrors(res.errors);
                    } else {
                        // console.log(res.data);
                        setBoq(res.data);
                        setRevisions(res.data.revisions);
                    }
                }
            });
    };
    useEffect(() => {
        setRefresh(false);
        if (toggles.revisionCreate) {
            console.log("revision called");
            getData(selectItem.id);
            // getData(1499);
            setOpen(true);
        }
    }, [toggles.revisionCreate, refresh]);
    return (
        <>
            <UpdateRevision
                edit={edit}
                setEdit={setEdit}
                setRefresh={setRefresh}
            />
            <DeleteRevision del={del} setDel={setDel} setRefresh={setRefresh} />
            <Dialog open={open} onClose={handleClose}>
                <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
                    <Typography
                        gutterBottom={true}
                        variant="h6"
                        textAlign={"center"}
                    >
                        Revision (s)
                    </Typography>
                    <Divider sx={{ mb: 2 }} component={"hr"} variant="middle" />
                    <Grid container columns={12}>
                        <Grid item xs={12} md={12}>
                            <Typography variant="body1" gutterBottom={true}>
                                {" "}
                                Description{" "}
                            </Typography>
                            <Typography
                                gutterBottom
                                variant="subtitle1"
                                align="justify"
                            >
                                {boq.desp ?? ""}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead
                                        sx={{ backgroundColor: amber[200] }}
                                    >
                                        <TableRow>
                                            <TableCell>Type</TableCell>
                                            <TableCell>Qty</TableCell>
                                            <TableCell>Amount</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>BOQ</TableCell>
                                            <TableCell>{boq.qty}</TableCell>
                                            <TableCell>
                                                {boq.qty *
                                                    (boq.quoted_rate /
                                                        (boq.baseQty || 1))}
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        {revisions.map((v, i) => {
                                            return (
                                                <TableRow key={i + 1}>
                                                    <TableCell>{`Rev-${
                                                        i + 1
                                                    }`}</TableCell>
                                                    <TableCell>
                                                        {v.qty}
                                                    </TableCell>
                                                    <TableCell>
                                                        {v.qty *
                                                            (boq.quoted_rate /
                                                                (boq.baseQty ||
                                                                    1))}
                                                    </TableCell>
                                                    <TableCell padding="normal">
                                                        <ButtonGroup size="small">
                                                            <IconButton
                                                                edge="start"
                                                                sx={{
                                                                    backgroundColor:
                                                                        amber[300],
                                                                    mr: 1,
                                                                }}
                                                                onClick={() =>
                                                                    setEdit({
                                                                        id: v.id,
                                                                        qty: v.qty,
                                                                        show: true,
                                                                    })
                                                                }
                                                                children={
                                                                    <EditSharpIcon color="warning" />
                                                                }
                                                            />
                                                            <IconButton
                                                                edge="end"
                                                                sx={{
                                                                    backgroundColor:
                                                                        pink[300],
                                                                }}
                                                                onClick={() =>
                                                                    setDel({
                                                                        id: v.id,
                                                                        show: true,
                                                                    })
                                                                }
                                                                children={
                                                                    <DeleteOutlineSharpIcon color="error" />
                                                                }
                                                            />
                                                        </ButtonGroup>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                    <TableFooter
                                        sx={{ backgroundColor: indigo[100] }}
                                    >
                                        <TableRow>
                                            <TableCell>Total</TableCell>
                                            <TableCell>
                                                {revisions
                                                    .reduce((t, c) => {
                                                        t += parseFloat(c.qty);
                                                        return t;
                                                    }, parseFloat(boq.qty))
                                                    .toFixed(2) || 0}
                                            </TableCell>
                                            <TableCell>
                                                {revisions.reduce((t, c) => {
                                                    t +=
                                                        c.qty *
                                                        (boq.quoted_rate /
                                                            (boq.baseQty || 1));
                                                    return t;
                                                }, parseInt(boq.qty * (boq.quoted_rate / (boq.baseQty || 1)))) ||
                                                    0}
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Typography
                        variant="h6"
                        color={grey[400]}
                        textAlign={"center"}
                        sx={{ marginY: 2 }}
                    >
                        OR
                    </Typography>
                    <AddRevision boqId={boq.id} setRefresh={setRefresh} />
                </Box>
            </Dialog>
        </>
    );
}
export { Revision };
//----------------------------------------------------------------------------------------------------------//
const AddRevision = (props) => {
    const [state, setState] = useState({ id: "", qty: "", req_type: "add" });
    const { showAlert, setMessage } = useContext(BOQContext);
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(false);
    const createRev = () => {
        setProgress(true);
        axios
            .post(route("estimation.boq.revision_update"), state)
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.errors) {
                        setErrors(res.data.errors);
                    } else {
                        // console.log(res.data);
                        props.setRefresh(true);
                        setMessage("Revision Added Successfully");
                        showAlert(true);
                        setErrors({});
                        setState({ id: "", qty: "", req_type: "add" });
                        setProgress(false);
                    }
                }
            });
    };
    useEffect(() => {
        // console.log("Add Callled")
        setState({ ...state, id: props.boqId });
    }, [props]);
    return (
        <>
            <TextField
                required
                fullWidth={true}
                value={state.qty}
                onChange={(e) => setState({ ...state, qty: e.target.value })}
                label={"Enter Quantity to be revised"}
                margin="dense"
                error={errors.qty ? true : false}
                helperText={
                    errors.qty &&
                    errors.qty.length > 0 &&
                    errors.qty.map((e) => e)
                }
            />
            {progress && <LinearProgress sx={{ my: 1 }} />}
            <Stack direction={"row"} sx={{ justifyContent: "end" }}>
                <Button onClick={createRev} variant="contained" color="success">
                    Add Revision
                </Button>
            </Stack>
        </>
    );
};
export { AddRevision };
//---------------------------------------------------------------------------------------------------------//
const UpdateRevision = React.memo((props) => {
    const { showAlert, setMessage } = useContext(BOQContext);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ id: "", qty: 0 });
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(false);
    const handleClose = () => {
        props.setEdit({ id: "", qty: "", show: false });
        setState({ id: 0, qty: 0 });
        setOpen(false);
    };
    const handelSubmit = (e) => {
        state["req_type"] = "update";
        setState(state);
        setProgress(true);
        axios
            .post(route("estimation.boq.revision_update"), state)
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.errors) {
                        console.log(res.data.errors);
                        setErrors(res.data.errors);
                    } else {
                        console.log(res.data);
                        setMessage("Update Successfull!");
                        showAlert(true);
                        handleClose();
                        props.setRefresh(true);
                        setProgress(false);
                    }
                }
            });
    };
    useEffect(() => {
        const { edit } = props;
        if (edit.show) {
            setState(edit);
            setOpen(true);
        }
    }, [props]);
    return (
        <Dialog open={open} onClose={handleClose}>
            <Box sx={{ p: 4 }}>
                <TextField
                    fullWidth
                    label="Change Quantity and Save"
                    margin="normal"
                    value={state.qty}
                    onChange={(e) =>
                        setState({ ...state, qty: e.target.value })
                    }
                    error={errors.req_type || errors.qty ? true : false}
                    helperText={
                        errors.qty &&
                        errors.qty.length > 0 &&
                        errors.qty.map((e) => e)
                    }
                />
                {errors.req_type &&
                    errors.req_type.length > 0 &&
                    errors.req_type.map((e, i) => (
                        <Typography
                            key={i}
                            gutterBottom
                            color={red[500]}
                            variant="body2"
                        >
                            {e}
                        </Typography>
                    ))}
                {progress && <LinearProgress sx={{ my: 1 }} />}
                <ButtonGroup fullWidth>
                    <Button onClick={handelSubmit}>Save</Button>
                    <Button onClick={handleClose}>Close</Button>
                </ButtonGroup>
            </Box>
        </Dialog>
    );
});
export { UpdateRevision };
//--------------------------------------------------------------------------------------------------------//

const DeleteRevision = React.memo((props) => {
    const { showAlert, setMessage } = useContext(BOQContext);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({
        id: "",
        code: "",
        req_type: "destroy",
    });
    const [errors, setErrors] = useState({});
    const [progress, setProgress] = useState(false);
    const handleClose = () => {
        props.setDel({ id: "", show: false });
        setState({ id: "", code: "", req_type: "destroy" });
        setOpen(false);
        setErrors({});
    };
    const handelSubmit = (e) => {
        setProgress(true);
        axios
            .post(route("estimation.boq.revision_update"), state)
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.errors) {
                        console.log(res.data.errors);
                        setErrors(res.data.errors);
                        showAlert(true);
                    } else {
                        handleClose();
                        setMessage("API Call Made to controller");
                        // console.log(res.data);
                        setState({ id: "", code: "", req_type: "destroy" });
                        showAlert(true);
                        props.setRefresh(true);
                        setProgress(false);
                    }
                }
            });
        // handleClose();
    };
    useEffect(() => {
        const { del } = props;
        if (del.show) {
            setState({ ...state, id: del.id });
            setOpen(true);
        }
    }, [props]);
    return (
        <Dialog open={open} onClose={handleClose}>
            <Box sx={{ p: 4 }}>
                <Typography variant="h6" color={pink[500]} gutterBottom={true}>
                    Are You Sure?
                </Typography>
                <TextField
                    fullWidth
                    label="Signatory Code"
                    margin="normal"
                    value={state.code}
                    onChange={(e) =>
                        setState({ ...state, code: e.target.value })
                    }
                    error={errors.code ? true : false}
                    helperText={
                        errors.code &&
                        errors.code.length > 0 &&
                        errors.code.map((e) => e)
                    }
                />
                {progress && <LinearProgress sx={{ my: 1 }} />}
                <ButtonGroup fullWidth>
                    <Button onClick={handelSubmit}>Yes</Button>
                    <Button onClick={handleClose}>NO</Button>
                </ButtonGroup>
            </Box>
        </Dialog>
    );
});
export { DeleteRevision };

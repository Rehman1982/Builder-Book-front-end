import React, { useEffect, useState } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ViewListSharpIcon from "@mui/icons-material/ViewListSharp";
import {
    Modal,
    Typography,
    Autocomplete,
    Divider,
    FormControlLabel,
    IconButton,
    Paper,
    Switch,
    TextField,
    Box,
    Button,
    Grid,
    FormControl,
    Stack,
    Tooltip,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    FormHelperText,
    LinearProgress,
    Fab,
} from "@mui/material";
import { amber, grey, lime, purple, blue } from "@mui/material/colors";
import SaveIcon from "@mui/icons-material/Save";
import { BOQContext } from "./BOQContext";
import axios from "axios";
import EditAnalysis from "./EditAnalysis";
import _ from "lodash";
// menu includes
const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80vh",
    overflow: "auto",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};

const defaulState = {
    id: "",
    project_id: "",
    sno: "",
    schedule_id: { name: "", id: "" },
    parent_id: "",
    Header: false,
    item_code: "",
    desp: "",
    boqbaseQty: "",
    boqunit: "",
    quoted_rate: "",
    qty: 0,
    amount: "",
    cf: "",
    analysis: null,
};
const EditBoq = (props) => {
    const {
        toggles,
        setToggles,
        allProjects,
        showAlert,
        setMessage,
        getProjectBoq,
    } = React.useContext(BOQContext);
    const [sch, setSch] = React.useState([]);
    const [itms, setItms] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [oldstate, setOldState] = useState({});
    const [state, setState] = React.useState(defaulState);
    const [hasAnalysis, setHasAnalysis] = useState(false);
    const [analysis, setAnalysis] = React.useState([]);
    const [baseForAnalysis, setBaseForAnalysis] = useState(null);
    const [scheduelItem, setScheduelItem] = useState(null);
    const [errors, setErrors] = React.useState({});
    const [shouldlock, setShouldLock] = React.useState(false);
    const [progress, setProgress] = useState(false);
    const [renderBtn, setRenderBtn] = useState(false);
    const calculateReqQty = () => {
        const boq_qty = parseFloat(state.qty);
        const conversionFactor = baseForAnalysis
            ? parseFloat(baseForAnalysis.cf)
            : 1;
        const analysisBQ = baseForAnalysis
            ? parseFloat(baseForAnalysis.base_qty)
            : 1;
        const qty = parseFloat((boq_qty * conversionFactor) / analysisBQ);
        setAnalysis((prv) => {
            let a = [...prv];
            a.map((v, i) => {
                if (scheduelItem !== null) {
                    v.qty_for_boq = parseFloat(qty * v.reqQtyForBase);
                    v.amount = parseFloat(v.qty_for_boq * v.rate);
                } else {
                    // v.qty_for_boq = parseFloat(qty * v.reqQtyForBase);
                    v.amount = parseFloat(v.qty_for_boq * v.rate);
                }
                return v;
            });
            return a;
        });
    };
    const handleChange = (e) => {
        let name = e.target.name;
        let val = e.target.value;
        let newState = { ...state, name: `${val}` };
        setState((prv) => {
            let newState = { ...prv };
            newState[name] = val;
            return newState;
        });
    };
    const getboqitem = async (e) => {
        try {
            let updateState = { ...state };
            const boqData = await axios
                .get(
                    route("ItemCode", {
                        schedule_id: state.schedule_id.id,
                        item_code: state.item_code,
                    })
                )
                .then((res) => {
                    if (res.status == 200 && res.data !== "") {
                        if (res.data.errors) {
                            console.log(res.data.errors);
                            setErrors(res.data.errors);
                        } else {
                            console.log(res.data);
                            updateState.desp = res.data.description;
                            // updateState.boqbaseQty = res.data.bs_base_qty;
                            // updateState.boqunit = res.data.bs_boqunit;
                            setState(updateState);
                            setBaseForAnalysis(() => {
                                let x = { ...baseForAnalysis };
                                x["base_qty"] = res.data.bs_base_qty;
                                x["base_unit"] = res.data.bs_unit;
                                return x;
                            });
                            const item_analysis =
                                res.data.schedule_analysis.map((v, i) => {
                                    return {
                                        item_id: v.item,
                                        reqQtyForBase: v.required_qty,
                                        qty_for_boq: 0,
                                        rate: v.rate,
                                    };
                                });
                            setAnalysis(item_analysis);
                            setScheduelItem({
                                id: "",
                                schedule_id: { name: "", id: "" },
                                base_qty: 120,
                                base_unit: "cft",
                                cf: 1,
                            });
                            setShouldLock(true);
                            setErrors({});
                            calculateReqQty();
                        }
                    }
                });
        } catch (error) {
            setMessage(error.message);
            showAlert(true);
        }
    };
    const toggleSwitch = () => {
        let currentToggle = !state.Header;
        setState((prv) => {
            return { ...prv, Header: currentToggle };
        });
        if (currentToggle) {
            setHasAnalysis(false);
        } else {
            setHasAnalysis(true);
        }
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setState(defaulState);
        setAnalysis([]);
        setOpen(false);
        setScheduelItem(null);
        setBaseForAnalysis(null);
        setToggles({ ...toggles, editForm: false });
        setHasAnalysis(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setProgress(true);
        const data = { ...state, req_type: "boq" };
        axios
            .put(route("estimation.boq.update", { boq: 1 }), data)
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.errors) {
                        console.log(res.data.errors);
                        setErrors(res.data.errors);
                        setMessage("Un-valid data passed");
                        showAlert(true);
                    } else {
                        console.log("Backend Response", res.data);
                        setMessage("BOQ Update Success!");
                        showAlert(true);
                        props.data.setRefresh(true);
                        setProgress(false);
                        handleClose();
                    }
                }
            });
    };
    React.useEffect(() => {
        console.log("Edit page Opened");
        if (toggles.editForm) {
            const { schedules, items, selectItem } = props.data;
            axios
                .get(
                    route("boq.edit", {
                        boq: "1",
                        req_type: "boq",
                        boq_id: selectItem.id,
                    })
                )
                .then((res) => {
                    if (res.status == 200) {
                        const { boq } = res.data;
                        let boqData = {
                            ...state,
                            boq_id: boq.id,
                            project_id: boq.project_id,
                            sno: boq.sno,
                            parent_id: boq.parent_id ?? "",
                            Header: boq.Header == 1 ? true : false,
                            item_code: boq.item_code,
                            desp: boq.desp,
                            boqbaseQty: boq.baseQty,
                            boqunit: boq.unit,
                            qty: boq.qty,
                            quoted_rate: boq.quoted_rate,
                            amount: parseInt(boq.qty * boq.quoted_rate),
                            cf: "",
                            analysis: null,
                        };
                        setSch(schedules);
                        setItms(items);
                        setState(boqData);
                        setOldState(boqData);
                    }
                });
            handleOpen();
        }
    }, [toggles.editForm]);
    useEffect(() => {
        console.log("same objects");
        if (_.isEqual(state, oldstate)) {
            setRenderBtn(false);
        } else {
            setRenderBtn(true);
        }
    }, [state]);
    return (
        <div>
            <>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    sx={{ minHeight: "80vh", overflow: "auto" }}
                >
                    <Box sx={style} component={Paper} bgcolor={lime[50]}>
                        <Typography variant="h5" color={blue[500]} gutterBottom>
                            Edit BOQ Item
                        </Typography>
                        <Divider variant="inset" sx={{ my: 2 }} />
                        <Grid container spacing={2}>
                            <Grid item md={hasAnalysis && 5}>
                                <Typography
                                    gutterBottom
                                    noWrap
                                    textAlign={"center"}
                                    variant="h6"
                                >
                                    BOQ Details
                                </Typography>
                                <Stack
                                    direction="row"
                                    useFlexGap={true}
                                    sx={{ justifyContent: "space-between" }}
                                >
                                    <Tooltip title="Header will remove Analysis">
                                        <FormControlLabel
                                            sx={{ width: "50%" }}
                                            control={
                                                <Switch
                                                    checked={state.Header}
                                                    onChange={toggleSwitch}
                                                    size="large"
                                                />
                                            }
                                            label={
                                                <Typography
                                                    variant="body1"
                                                    children={
                                                        !state.Header
                                                            ? "BOQ ITEM"
                                                            : "HEADER"
                                                    }
                                                />
                                            }
                                            labelPlacement="end"
                                        />
                                    </Tooltip>
                                    {!hasAnalysis && (
                                        <IconButton
                                            children={<ControlPointIcon />}
                                            onClick={() => setHasAnalysis(true)}
                                        />
                                    )}
                                </Stack>
                                {progress && <LinearProgress />}
                                <FormControl
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    children={
                                        <Autocomplete
                                            disabled={state.Header}
                                            options={sch}
                                            getOptionLabel={(options) =>
                                                options.name
                                            }
                                            isOptionEqualToValue={(options) =>
                                                options.name
                                            }
                                            value={state.schedule_id}
                                            onChange={(event, abc) => {
                                                setState({
                                                    ...state,
                                                    schedule_id: abc,
                                                });
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    error={
                                                        "schedule_id" in
                                                            errors && true
                                                    }
                                                    helperText={
                                                        "schedule_id" in
                                                            errors &&
                                                        errors.schedule_id.map(
                                                            (er) => er
                                                        )
                                                    }
                                                    {...params}
                                                    label="Schedules"
                                                />
                                            )}
                                        />
                                    }
                                />
                                <TextField
                                    value={state.parent_id}
                                    onChange={handleChange}
                                    name="parent_id"
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    label="Parent Name"
                                />
                                <TextField
                                    value={state.sno}
                                    required={true}
                                    onChange={handleChange}
                                    name="sno"
                                    error={"sno" in errors}
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    label="BOQ S.No"
                                    helperText={
                                        "sno" in errors &&
                                        errors.sno.map((er) => er)
                                    }
                                />
                                <FormControl
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                >
                                    <InputLabel>Item code</InputLabel>
                                    <OutlinedInput
                                        value={state.item_code}
                                        onChange={handleChange}
                                        // onBlur={getboqitem}
                                        disabled={state.Header}
                                        name="item_code"
                                        error={"item_code" in errors}
                                        endAdornment={
                                            <InputAdornment position="start">
                                                <Tooltip title="This will replace the current analysis with schedule analysis">
                                                    <IconButton
                                                        color="error"
                                                        onClick={getboqitem}
                                                        edge="end"
                                                    >
                                                        <ViewListSharpIcon color="warning" />
                                                    </IconButton>
                                                </Tooltip>
                                            </InputAdornment>
                                        }
                                    />
                                    <FormHelperText>
                                        {"item_code" in errors &&
                                            errors.item_code.map((e) => e)}
                                    </FormHelperText>
                                </FormControl>
                                <TextField
                                    value={state.desp}
                                    onChange={handleChange}
                                    name="desp"
                                    fullWidth={true}
                                    margin="dense"
                                    multiline={true}
                                    minRows={4}
                                    label="Description"
                                    error={"desp" in errors}
                                    helperText={
                                        "desp" in errors &&
                                        errors.desp.map((e) => e)
                                    }
                                />
                                <TextField
                                    value={state.boqbaseQty}
                                    onChange={() => {
                                        handleChange(event);
                                    }}
                                    disabled={state.Header}
                                    name="boqbaseQty"
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    label="Base Qty"
                                    error={"boqbaseQty" in errors}
                                    helperText={
                                        "boqbaseQty" in errors &&
                                        errors.boqbaseQty.map((e) => e)
                                    }
                                />
                                <TextField
                                    value={state.qty}
                                    onChange={() => {
                                        handleChange(event);
                                    }}
                                    onBlur={calculateReqQty}
                                    disabled={state.Header}
                                    name="qty"
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    label="BOQ Qty"
                                    error={"qty" in errors}
                                    helperText={
                                        "qty" in errors &&
                                        errors.qty.map((e) => e)
                                    }
                                />
                                <TextField
                                    value={state.boqunit}
                                    onChange={handleChange}
                                    disabled={state.Header}
                                    name="boqunit"
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    label="Unit"
                                    error={"boqunit" in errors}
                                    helperText={
                                        "boqunit" in errors &&
                                        errors.boqunit.map((e) => e)
                                    }
                                />
                                <TextField
                                    value={state.quoted_rate}
                                    onChange={handleChange}
                                    disabled={state.Header}
                                    name="quoted_rate"
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    label="Quoted Rate"
                                    error={"quoted_rate" in errors}
                                    helperText={
                                        "quoted_rate" in errors &&
                                        errors.quoted_rate.map((e) => e)
                                    }
                                />
                                <Stack
                                    direction={"row"}
                                    alignItems={"center"}
                                    mt={1}
                                    spacing={1}
                                >
                                    <TextField
                                        value={
                                            parseInt(
                                                (state.qty *
                                                    state.quoted_rate) /
                                                    state.boqbaseQty
                                            ) || 0
                                        }
                                        onChange={handleChange}
                                        disabled={true}
                                        fullWidth
                                        name="amount"
                                        margin="dense"
                                        label="Amount(Rs)"
                                        error={"amount" in errors}
                                        helperText={
                                            "amount" in errors &&
                                            errors.amount.map((e) => e)
                                        }
                                    />
                                    {renderBtn && (
                                        <Fab
                                            color="primary"
                                            onClick={handleSubmit}
                                            children={<SaveIcon />}
                                        />
                                    )}
                                </Stack>
                            </Grid>
                            <EditAnalysis
                                itms={itms}
                                setHasAnalysis={setHasAnalysis}
                                boqDetails={state}
                            />
                        </Grid>
                        {/* <Grid container>
                            <Grid item>
                                <Fab
                                    color='primary'
                                    onClick={handleSubmit}
                                    children={<SaveIcon />}
                                />
                            </Grid>
                        </Grid> */}
                    </Box>
                </Modal>
            </>
        </div>
    );
};
export default React.memo(EditBoq);

import React, { useEffect, useState } from "react";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
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
    Fab,
} from "@mui/material";
import { amber, blue, grey, lime, purple } from "@mui/material/colors";
import SendIcon from "@mui/icons-material/Send";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { BOQContext } from "./BOQContext";
import axios from "axios";
import Analysis from "./Analysis";
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
    project_id: "",
    sno: "",
    schedule_id: { name: "", id: "" },
    parent_id: "",
    header: false,
    item_code: "",
    desp: "",
    boqbaseQty: "",
    boqunit: "",
    composite: "",
    quoted_rate: "",
    qty: 0,
    amount: "",
    cf: "",
    analysis: null,
};
const defaulAnalysis = { item_id: "", required_qty: "0", rate: "0" };
const Create = (props) => {
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
    const [state, setState] = React.useState(defaulState);
    const [errors, setErrors] = React.useState({});
    const [shouldlock, setShouldLock] = React.useState(false);
    const [baseForAnalysis, setBaseForAnalysis] = useState({
        base_qty: 1,
        base_unit: "",
        cf: 1,
    });
    useEffect(() => {
        console.log(props);
    }, [props]);
    const [analysis, setAnalysis] = React.useState([]);
    const resetForm = () => {
        setState(() => {
            return {
                project_id: state.project_id,
                sno: "",
                schedule_id: state.schedule_id,
                parent_id: state.parent_id,
                header: false,
                item_code: "",
                desp: "",
                boqbaseQty: "",
                boqunit: "",
                composite: "",
                quoted_rate: "",
                qty: 0,
                amount: "",
                analysis: "",
                cf: "",
            };
        });
        setAnalysis([
            {
                item_id: { item: "", id: "" },
                required_qty: 0,
                qty_for_boq: 0,
                rate: 0,
                amount: 0,
            },
        ]);
        setErrors({});
        setBaseForAnalysis([]);
        setShouldLock(false);
    };
    const compareAmountwithAnalysis = () => {
        if (analysis.length > 0) {
            const amount = (state.qty * state.quoted_rate) / state.boqbaseQty;
            const analysisTotal = analysis.reduce((t, c) => {
                t += c.qty_for_boq * c.rate;
                return t;
            }, 0);
            if (amount < analysisTotal) {
                setErrors({
                    ...errors,
                    amount: [
                        `Quoted Rate should be ${
                            analysisTotal / state.qty
                        } per ${state.boqbaseQty} ${state.boqunit}`,
                    ],
                });
            } else {
                delete errors.amount;
                setErrors(errors);
            }
        }
    };
    const calculateReqQty = () => {
        const boq_qty = parseFloat(state.qty);
        const conversionFactor = parseFloat(baseForAnalysis.cf);
        const analysisBQ = parseFloat(baseForAnalysis.base_qty);
        const qty = parseFloat((boq_qty * conversionFactor) / analysisBQ);
        setAnalysis((prv) => {
            let a = [...prv];
            a.map((v, i) => {
                v.qty_for_boq = parseFloat(qty * v.required_qty);
                v.amount = parseFloat(v.qty_for_boq * v.rate);
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
        if (name == "qty") {
            calculateReqQty();
        }
    };
    const getboqitem = (e) => {
        if (state.schedule_id.id > 0) {
            let updateState = { ...state };
            const boqData = axios
                .get(
                    route("ItemCode", {
                        schedule_id: state.schedule_id.id,
                        item_code: e.target.value,
                    })
                )
                .then((res) => {
                    if (res.status == 200 && res.data !== "") {
                        if (res.data.errors) {
                            setErrors(res.data.errors);
                        } else {
                            updateState.desp = res.data.description;
                            setState(updateState);
                            setBaseForAnalysis({
                                ...baseForAnalysis,
                                base_qty: res.data.bs_base_qty,
                                base_unit: res.data.bs_unit,
                            });
                            const item_analysis =
                                res.data.schedule_analysis.map((v, i) => {
                                    return {
                                        item_id: v.item,
                                        required_qty: v.required_qty,
                                        rate: v.rate,
                                    };
                                });
                            setAnalysis(() => {
                                return item_analysis;
                            });
                            setShouldLock(true);
                        }
                    } else {
                        // console.log(res.data);
                        (updateState.desp = ""),
                            (updateState.boqbaseQty = ""),
                            (updateState.boqunit = "");
                        setState(updateState);
                        setAnalysis([
                            {
                                item_id: { item: "", id: "" },
                                required_qty: 0,
                                rate: 0,
                            },
                        ]);
                        setShouldLock(false);
                    }
                });
        } else {
            setErrors({});
        }
    };
    const handleChangeAnalysis = (e, i) => {
        setAnalysis((prv) => {
            let a = [...prv];
            let name = e.target.name;
            let val = e.target.value;
            a[i][name] = val;
            return a;
        });
    };
    const toggleSwitch = () => {
        let currentToggle = !state.header;
        setState((prv) => {
            return { ...prv, header: currentToggle };
        });
    };
    const addAnalysis = () => {
        setShouldLock(false);
        setState({ ...state, header: false });
        const blank = {
            item_id: { item: "", id: "" },
            required_qty: 0,
            rate: 0,
        };
        setAnalysis(analysis.concat(blank));
    };
    const deleteAnalysis = (index) => {
        setAnalysis((prv) => {
            let newEl = [...prv];
            newEl.splice(index, 1);
            return newEl;
        });
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setState(defaulState);
        setAnalysis([]);
        setOpen(false);
        setToggles({ ...toggles, createForm: false });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const boqAmount = state.qty * state.quoted_rate;
        const data = {
            ...state,
            schedule_id: state.schedule_id.id,
            amount: boqAmount,
        };
        if (!state.header) {
            data["cf"] = parseFloat(baseForAnalysis.cf).toFixed(2);
            data["base_qty"] = baseForAnalysis.base_qty;
            data["base_unit"] = baseForAnalysis.base_unit;
            data["analysis"] = analysis.map((v, i) => {
                return {
                    item_id: v.item_id.id,
                    qty_for_boq: v.qty_for_boq,
                    rate: v.rate,
                    required_qty: v.required_qty,
                };
            });
        }
        console.log(data);
        axios.post(route("estimation.boq.store"), data).then((res) => {
            if (res.status == 200) {
                if (res.data.errors) {
                    console.log(res.data.errors);
                    setErrors(res.data.errors);
                } else {
                    // console.log("request returned", res.data);
                    setMessage(res.data.message);
                    // res.data.newRow[0]["childs"] = [];
                    // res.data.newRow[0]["analysis"] = [];
                    // res.data.newRow[0]["amount"] = "";
                    // props.data.setState((prv) => {

                    //     return [...prv, res.data.newRow[0]];
                    // });
                    showAlert(true);
                    resetForm();
                    props.data.setRefresh(true);
                }
            }
        });
    };
    const handleSubmitWithAnalysis = () => {};
    const getProjectName = React.useCallback((project_id) => {
        const project = allProjects.filter((v) => v.id === project_id);
        return project[0]["name"];
    }, []);
    React.useEffect(() => {
        console.log("page Opened");
        if (toggles.createForm) {
            setSch(props.data.schedules);
            setItms(props.data.items);
            setState({
                ...state,
                project_id: props.data.selectItem.project_id,
                parent_id: props.data.selectItem.id,
            });
            console.log(props);
            handleOpen();
        }
        // console.log("create Rendered",props);
    }, [toggles.createForm]);
    useEffect(() => {
        compareAmountwithAnalysis();
    }, [state, analysis]);
    return (
        <div>
            <>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    bgcolor={amber[200]}
                    // sx={{ minHeight: "100vh", overflow: "auto" }}
                >
                    <Box sx={style} component={Paper}>
                        <Typography
                            variant="h5"
                            textAlign={"left"}
                            gutterBottom
                        >
                            Create BOQ Item
                        </Typography>
                        <Grid container spacing={2}>
                            {/* First column */}
                            <Grid
                                item
                                md={
                                    state.header == false &&
                                    analysis.length > 0 &&
                                    5
                                }
                            >
                                <Stack
                                    direction="row"
                                    useFlexGap={true}
                                    sx={{ justifyContent: "space-between" }}
                                >
                                    <FormControlLabel
                                        sx={{ width: "50%" }}
                                        control={
                                            <Switch
                                                checked={state.header}
                                                onChange={toggleSwitch}
                                                size="large"
                                            />
                                        }
                                        label={
                                            <Typography
                                                variant="body1"
                                                children={
                                                    state.header
                                                        ? "HEADER"
                                                        : "BOQ ITEM"
                                                }
                                            />
                                        }
                                        labelPlacement="end"
                                    />
                                    {!analysis.length > 0 && (
                                        <IconButton
                                            children={<ControlPointIcon />}
                                            onClick={addAnalysis}
                                        />
                                    )}
                                </Stack>
                                <FormControl
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    children={
                                        <Autocomplete
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
                                    autoFocus={true}
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
                                <TextField
                                    required
                                    value={state.item_code}
                                    onChange={handleChange}
                                    onBlur={getboqitem}
                                    disabled={state.header}
                                    name="item_code"
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    label="Item Code"
                                    error={"item_code" in errors}
                                    helperText={
                                        "item_code" in errors &&
                                        errors.item_code.map((e) => e)
                                    }
                                />
                                <TextField
                                    required
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
                                    required
                                    value={state.boqbaseQty}
                                    onChange={() => {
                                        handleChange(event);
                                    }}
                                    disabled={state.header}
                                    name="boqbaseQty"
                                    type="number"
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
                                    required
                                    value={state.qty}
                                    onChange={() => {
                                        handleChange(event);
                                    }}
                                    onBlur={calculateReqQty}
                                    disabled={state.header}
                                    name="qty"
                                    type="number"
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
                                    required
                                    value={state.boqunit}
                                    onChange={handleChange}
                                    disabled={state.header}
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
                                    required
                                    value={state.quoted_rate}
                                    onChange={handleChange}
                                    disabled={state.header}
                                    name="quoted_rate"
                                    type="number"
                                    sx={{ width: "50%" }}
                                    margin="dense"
                                    label="Quoted Rate"
                                    error={"quoted_rate" in errors}
                                    helperText={
                                        "quoted_rate" in errors &&
                                        errors.quoted_rate.map((e) => e)
                                    }
                                />
                                <TextField
                                    value={
                                        parseInt(
                                            (state.qty * state.quoted_rate) /
                                                state.boqbaseQty
                                        ) || 0
                                    }
                                    // onChange={check}
                                    disabled={true}
                                    name="amount"
                                    fullWidth={true}
                                    margin="dense"
                                    label="Amount(Rs)"
                                    error={"amount" in errors}
                                    helperText={
                                        "amount" in errors &&
                                        errors.amount.map((e) => e)
                                    }
                                />
                            </Grid>
                            {/* Second column analysis */}
                            {state.header !== true && analysis.length > 0 && (
                                <Analysis
                                    errors={errors}
                                    itms={itms}
                                    sch={sch}
                                    shouldlock={shouldlock}
                                    addAnalysis={addAnalysis}
                                    setAnalysis={setAnalysis}
                                    deleteAnalysis={deleteAnalysis}
                                    analysis={analysis}
                                    baseForAnalysis={baseForAnalysis}
                                    setBaseForAnalysis={setBaseForAnalysis}
                                    calculateReqQty={calculateReqQty}
                                    state={state}
                                    setState={setState}
                                    handleChangeAnalysis={handleChangeAnalysis}
                                />
                            )}
                        </Grid>
                        <Stack
                            direction="row"
                            useFlexGap={true}
                            sx={{ mt: 4, justifyContent: "flex-end" }}
                        >
                            <Fab
                                color="primary"
                                onClick={handleSubmit}
                                variant="circular"
                                children={<SaveIcon />}
                            />
                        </Stack>
                    </Box>
                </Modal>
            </>
        </div>
    );
};
export default Create;

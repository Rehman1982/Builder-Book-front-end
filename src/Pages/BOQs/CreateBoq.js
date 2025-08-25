import React, { useEffect, useState, useContext, useRef } from "react";

import {
    Typography,
    Autocomplete,
    FormControlLabel,
    Switch,
    TextField,
    Button,
    Grid,
    Stack,
    Dialog,
    DialogContent,
    DialogTitle,
    ButtonGroup,
    IconButton,
    FormGroup,
    Checkbox,
} from "@mui/material";
import { amber, blue } from "@mui/material/colors";
import SaveIcon from "@mui/icons-material/Save";

import axios from "axios";

import { BOQContext } from "./BOQContext";
import Analysis from "./Analysis/Analysis";
import { Error } from "../helpers/helpers";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import { Edit } from "@mui/icons-material";
import { Alert } from "../../context/AlertBar/AlertBar";
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
const CreateBoq = forwardRef(
    (
        {
            index,
            setIndex,
            items,
            schedules,
            selectItem,
            clearData,
            setRefresh,
            variant,
            setVariant,
            reload,
        },
        ref
    ) => {
        const { showAlert, setMessage, setSeverity } = useContext(Alert);
        const AnalysisRef = useRef();
        const [open, setOpen] = useState(false);
        const [remainOpen, setRemainOpen] = useState(false);

        const [boq, setBoq] = useState({
            id: "",
            parent_id: "",
            Header: false,
            item_code: "",
        });
        const [boqAnalysis, setBoqAnalysis] = useState([]);
        const [schAnalysis, setSchAnalysis] = useState();

        const [errors, setErrors] = useState({});
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            if (remainOpen == true) {
                setBoq((prv) => {
                    let a = { ...prv };
                    a["item_code"] = "";
                    a["desp"] = "";
                    return a;
                });
            } else {
                setOpen(false);
                setBoq({ id: "", Header: false, item_code: "" });
                clearData({});
            }
            setBoqAnalysis([]);
            setSchAnalysis();
        };
        const handleSubmit = async (e) => {
            const data = {
                boq: {
                    ...boq,
                    project_id: selectItem.project_id,
                },
                boqAnalysis: boqAnalysis,
            };
            console.log("requested data", data);
            try {
                const res = await axios.post(
                    route("estimation.boq.store"),
                    data
                );
                if (res.status == 203) {
                    console.log(res.data);
                    setErrors(res.data);
                    if (Object.keys(res.data).some((key) => "boqAnalysis")) {
                        AnalysisRef.current.openAnalysis();
                    }
                    setMessage("Validation Errors");
                    setSeverity("error");
                    showAlert(true);
                }
                if (res.status == 200) {
                    // console.log("aaaaaaaaaaaa", res.data);
                    // updateIndexData(index, selectItem.id, {
                    //     ...res.data,
                    //     analysis: boqAnalysis,
                    // });

                    handleClose();
                    reload(true);
                    setMessage("Updated Successfully!");
                    showAlert(true);
                }
            } catch (error) {
                console.log(error.response);
            }
        };
        const BoqData = async (boq_id) => {
            try {
                const res = await axios.get(
                    route("estimation.boq.edit", {
                        boq: "1",
                        req_type: "boq",
                        boq_id: boq_id,
                    })
                );
                if (res.status == 200) {
                    console.log("BOQ Details", res.data.boq);
                    const SCHAN = res.data.schItem?.schedule_analysis;
                    const ConvertedHeader =
                        res?.data?.boq?.Header == 1 ? true : false;
                    const Sch = res?.data?.schItem?.schedule;
                    setBoq({
                        ...res.data.boq,
                        Header: ConvertedHeader,
                        schedule: Sch,
                    });
                    setBoqAnalysis(res?.data?.analysis);
                    setSchAnalysis({
                        baseQty: res.data.schItem.bs_base_qty,
                        baseUnit: res.data.schItem.bs_unit,
                        analysis: SCHAN,
                    });
                }
            } catch (error) {
                console.log(res.response);
            }
        };
        useImperativeHandle(ref, () => ({
            open: handleOpen,
        }));
        const updateIndexData = (indexData, id, newData) => {
            const updatedData = updateNestedItem(indexData, id, newData);
            setIndex(updatedData);
        };
        useEffect(() => {
            console.log("Create BOQ rendered");
            console.log(index, "indexData");
            if (variant == "Edit" || variant == "View") {
                {
                    selectItem?.id && BoqData(selectItem.id);
                }
            }
            setBoq({ ...boq, parent_id: selectItem?.id || "" });
        }, [selectItem, variant]);
        useEffect(() => {
            if (variant == "Add") {
                calculateBoqAnalysis(boq, setBoqAnalysis, schAnalysis);
            }
        }, [boq.qty]);
        useEffect(() => {
            console.log("BoQ Updated", boq);
        }, [boq]);
        return (
            <>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <DialogTitle>{variant}</DialogTitle>
                    <DialogContent>
                        <BOQ
                            variant={variant}
                            AnalysisRef={AnalysisRef}
                            errors={errors}
                            boq={boq}
                            setSchAnalysis={setSchAnalysis}
                            setBoq={setBoq}
                            sch={schedules}
                            selectedItem={selectItem || ""}
                            setBoqAnalysis={setBoqAnalysis}
                        />
                        <Analysis
                            variant={variant}
                            ref={AnalysisRef}
                            itms={items}
                            schAnalysis={schAnalysis}
                            boqAnalysis={boqAnalysis}
                            setBoqAnalysis={setBoqAnalysis}
                            boq={boq}
                            errors={errors}
                        />
                        <ActionButtons
                            handleSubmit={handleSubmit}
                            variant={variant}
                            setVariant={setVariant}
                            remainOpen={remainOpen}
                            setRemainOpen={setRemainOpen}
                        />
                    </DialogContent>
                </Dialog>
            </>
        );
    }
);
export default React.memo(CreateBoq);

const BOQ = ({
    sch,
    boq,
    setBoq,
    errors,
    selectedItem,
    setBoqAnalysis,
    setSchAnalysis,
    AnalysisRef,
    variant,
}) => {
    const [disabled, setDisabled] = useState(true);
    const handleChange = (event) => {
        let { name, value } = event.target;
        setBoq({ ...boq, [name]: value });
    };
    const toggleSwitch = () => {
        let currentToggle = !Boolean(boq.Header);
        setBoq((prv) => {
            return { ...prv, Header: currentToggle };
        });
    };
    const handleBlur = (event) => {
        const { name, value } = event.target;
        if ((name === "qty" || name == "unit") && boq.qty > 0) {
            if (variant === "Edit") {
                const Ratio = boq.qty / selectedItem.qty;
                setBoqAnalysis((prv) => {
                    let a = [...prv];
                    console.log("Ratio", a);
                    a.map((v, i) => {
                        v.required_qty =
                            selectedItem.analysis[i]["required_qty"] * Ratio;
                        return v;
                    });
                    return a;
                });
            }
            AnalysisRef.current.openAnalysis();
        }
        if (name == "item_code" && boq.schedule !== undefined) {
            getboqitem(
                boq.schedule.id,
                boq.item_code,
                setBoq,
                setBoqAnalysis,
                setSchAnalysis
            );
        }
    };
    useEffect(() => {
        if (variant !== "View") {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [variant]);
    return (
        <Grid container>
            <Grid item xs={12}>
                <FormControlLabel
                    name="Header"
                    control={
                        <Switch
                            checked={Boolean(boq.Header)}
                            onChange={toggleSwitch}
                            size="large"
                        />
                    }
                    label={
                        <Typography
                            variant="body1"
                            children={boq.Header ? "HEADER" : "BOQ ITEM"}
                        />
                    }
                    labelPlacement="end"
                />
                <Error errors={errors} name="boq.Header" />
            </Grid>
            <Grid item xs={6}>
                <Autocomplete
                    disabled={disabled}
                    options={sch}
                    getOptionLabel={(options) => options.name}
                    isOptionEqualToValue={(opt) => opt.id}
                    value={boq.schedule || null}
                    onChange={(event, value) => {
                        setBoq({
                            ...boq,
                            schedule: value,
                        });
                    }}
                    renderInput={(params) => (
                        <TextField
                            margin="dense"
                            name="schedule_id"
                            error={"schedule_id" in errors && true}
                            helperText={
                                <Error errors={errors} name="schedule_id" />
                            }
                            {...params}
                            label="Schedules"
                        />
                    )}
                />
            </Grid>
            <TextField
                disabled={disabled}
                component={Grid}
                item
                xs={6}
                value={boq.parent_id || ""}
                onChange={handleChange}
                name="parent_id"
                sx={{ width: "50%" }}
                margin="dense"
                label="Parent Name"
            />
            <TextField
                disabled={disabled}
                item
                component={Grid}
                xs={6}
                value={boq.sno || ""}
                autoFocus={true}
                required={true}
                onChange={handleChange}
                name="sno"
                error={"sno" in errors}
                margin="dense"
                label="BOQ S.No"
                helperText={<Error errors={errors} name="boq.sno" />}
            />
            <TextField
                disabled={disabled}
                item
                component={Grid}
                xs={6}
                required
                name="item_code"
                value={boq.item_code || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="dense"
                label="Item Code"
                error={"item_code" in errors}
                helperText={<Error errors={errors} name="boq.item_code" />}
            />
            <TextField
                disabled={disabled}
                item
                component={Grid}
                xs={12}
                required
                value={boq.desp || ""}
                onChange={handleChange}
                name="desp"
                fullWidth={true}
                margin="dense"
                multiline={true}
                minRows={4}
                label="Description"
                error={"desp" in errors}
                helperText={<Error errors={errors} name="boq.desp" />}
            />
            <TextField
                disabled={(boq.Header || disabled) && true}
                item
                component={Grid}
                xs={6}
                required
                value={boq.baseQty || ""}
                onChange={handleChange}
                name="baseQty"
                type="number"
                sx={{
                    display: boq.Header ? "none" : "",
                }}
                margin="dense"
                label="Base Qty"
                error={"baseQty" in errors}
                helperText={<Error errors={errors} name="boq.baseQty" />}
            />
            <TextField
                disabled={(boq.Header || disabled) && true}
                item
                component={Grid}
                xs={6}
                required
                value={boq.unit || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                name="unit"
                sx={{
                    display: boq.Header ? "none" : "",
                }}
                margin="dense"
                label="Unit"
                error={"unit" in errors}
                helperText={<Error errors={errors} name="boq.unit" />}
            />
            <TextField
                disabled={(boq.Header || disabled) && true}
                item
                component={Grid}
                xs={6}
                required
                value={boq.quoted_rate || ""}
                onChange={handleChange}
                name="quoted_rate"
                type="number"
                sx={{
                    display: boq.Header ? "none" : "",
                }}
                margin="dense"
                label="Quoted Rate"
                error={"quoted_rate" in errors}
                helperText={<Error errors={errors} name="boq.quoted_rate" />}
            />
            <Grid item xs={6} display="flex">
                <TextField
                    disabled={(boq.Header || disabled) && true}
                    fullWidth={!boq.qty ? true : false}
                    required
                    value={boq.qty || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="qty"
                    type="number"
                    sx={{
                        display: boq.Header ? "none" : "",
                    }}
                    margin="dense"
                    label="BOQ Qty"
                    error={"qty" in errors}
                    helperText={<Error errors={errors} name="boq.qty" />}
                />
                {boq.qty > 0 && (
                    <Button
                        onClick={() => AnalysisRef.current.openAnalysis()}
                        sx={{ my: 1 }}
                        variant="contained"
                    >
                        Analysis
                    </Button>
                )}
            </Grid>
            <TextField
                disabled={true}
                sx={{
                    display: boq.Header ? "none" : "",
                }}
                item
                component={Grid}
                xs={12}
                value={parseInt((boq.qty * boq.quoted_rate) / boq.baseQty) || 0}
                // onChange={check}
                name="amount"
                fullWidth={true}
                margin="dense"
                label="Amount(Rs)"
            />
        </Grid>
    );
};

const getboqitem = async (
    schedule_id,
    item_code,
    setBoq,
    setBoqAnalysis,
    setSchAnalysis
) => {
    const reqData = { schedule_id, item_code };
    const res = await axios.get(route("ItemCode", reqData));
    if (res.status == 200) {
        console.log(res);
        const {
            bs_base_qty,
            bs_unit,
            description,
            bs_composite,
            schedule_analysis,
        } = res.data;
        const boq = {
            desp: description,
        };
        setBoq((prv) => {
            let obj = { ...prv, ...boq };
            return obj;
        });
        setSchAnalysis({
            baseQty: bs_base_qty,
            baseUnit: bs_unit,
            analysis: schedule_analysis,
        });
    }
};

const calculateBoqAnalysis = (boq, setBoqAnalysis, schAnalysis) => {
    if (schAnalysis && schAnalysis.analysis.length > 0) {
        const BOQAnalays = schAnalysis.analysis.map((v, i) => {
            return {
                item: v.item,
                required_qty: (v.required_qty / schAnalysis.baseQty) * boq.qty,
                rate: v.rate,
            };
        });
        setBoqAnalysis(BOQAnalays);
    }
};

const ActionButtons = ({
    handleSubmit,
    variant,
    setVariant,
    remainOpen,
    setRemainOpen,
}) => {
    return (
        <>
            <Stack
                direction="row"
                useFlexGap={true}
                sx={{ mt: 2, justifyContent: "flex-end" }}
            >
                {variant == "Add" && (
                    <ButtonGroup fullWidth>
                        <Button onClick={handleSubmit}>
                            Save BOQ,Analysis & Add Analysis to Schedule
                        </Button>
                    </ButtonGroup>
                )}
                {variant == "Edit" && (
                    <ButtonGroup>
                        <Button onClick={handleSubmit}>
                            Update BOQ & Analysis
                        </Button>
                    </ButtonGroup>
                )}
                {variant == "View" && (
                    <ButtonGroup>
                        <IconButton
                            sx={{
                                border: 1,
                                borderColor: blue[400],
                                backgroundColor: blue[200],
                            }}
                            size="large"
                            onClick={() => setVariant("Edit")}
                        >
                            <Edit color="primary" />
                        </IconButton>
                    </ButtonGroup>
                )}
            </Stack>
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
            >
                <FormGroup>
                    <FormControlLabel
                        label={
                            <Typography variant="caption">
                                Remain open after save
                            </Typography>
                        }
                        control={
                            <Checkbox
                                checked={remainOpen}
                                onChange={() => setRemainOpen(!remainOpen)}
                            />
                        }
                    />
                </FormGroup>
            </Stack>
        </>
    );
};

const updateNestedItem = (items, id, newData) => {
    return items.map((item) => {
        if (item.id === id) {
            return { ...item, ...newData }; // Update the found item
        }
        if (item.childs && item.childs.length > 0) {
            return {
                ...item,
                childs: updateNestedItem(item.childs, id, newData),
            }; // Recurse into childs
        }
        return item;
    });
};

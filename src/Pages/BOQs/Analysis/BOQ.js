import {
    Grid,
    Stack,
    Typography,
    Divider,
    IconButton,
    Paper,
    Box,
    FormControl,
    Autocomplete,
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    Tabs,
    Tab,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    amber,
    blue,
    green,
    grey,
    lime,
    pink,
    purple,
    red,
} from "@mui/material/colors";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { round } from "lodash";
import { Error, ROUND, TwoDeci } from "../../helpers/helpers";
import Analysis from "../Analysis";

const BOQ = ({
    itms,
    boq,
    boqAnalysis,
    setBoqAnalysis,
    schAnalysis,
    variant,
    errors,
}) => {
    const addAnalysis = () => {
        const blank = {
            id: "",
            item: { item: "", id: "" },
            required_qty: 0,
            rate: 0,
        };
        setBoqAnalysis(boqAnalysis.concat(blank));
    };
    const deleteAnalysis = (index) => {
        setBoqAnalysis((prv) => {
            return prv.filter((analysis, i) => i !== index);
        });
    };
    const handleChang = (event, index) => {
        const { name, value } = event.target;
        setBoqAnalysis((prv) => {
            let Arr = [...prv];
            Arr[index][name] = value;
            return Arr;
        });
    };
    const [cf, setCF] = useState({
        schUnit: "",
        boqUnit: "",
        cf: getConversionFactor(schAnalysis?.baseUnit, boq?.unit),
    });
    useEffect(() => {
        if (variant == "Add") {
            calculateBoqAnalysis(boq, setBoqAnalysis, schAnalysis, cf.cf);
        }
    }, [cf]);
    ///________________________________________
    useEffect(() => {
        console.log("itemssssss", itms);
        if (variant == "Add") {
            if (schAnalysis && schAnalysis.analysis.length > 0) {
                setCF({
                    schUnit: schAnalysis.baseUnit,
                    boqUnit: boq.unit,
                    cf: getConversionFactor(schAnalysis.baseUnit, boq.unit),
                });
            }
        }
    }, []);
    return (
        <>
            <Grid container justifyContent={"space-between"}>
                <Grid item>
                    <IconButton
                        children={<ControlPointIcon />}
                        onClick={addAnalysis}
                    />
                </Grid>
                <Grid item>
                    {schAnalysis && variant == "Add" && (
                        <TextField
                            label={`Conversion Factor  ${cf.schUnit} to ${cf.boqUnit}`}
                            value={cf.cf}
                            onChange={(e) => {
                                setCF({ ...cf, cf: e.target.value });
                            }}
                            size="small"
                        />
                    )}
                </Grid>
            </Grid>
            {boqAnalysis.map((cell, i) => {
                return (
                    <Grid
                        key={i}
                        container
                        columns={12}
                        alignItems="center"
                        spacing={0.3}
                    >
                        <Grid item sm={4}>
                            <Autocomplete
                                size="small"
                                options={itms}
                                getOptionLabel={(options) => {
                                    return `${options.item} (${options.unitinfo?.unit})`;
                                }}
                                value={cell.item}
                                onChange={(event, value) => {
                                    let uPA = [...boqAnalysis];
                                    uPA[i]["item"] = value;
                                    setBoqAnalysis(uPA);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        error={
                                            `boqAnalysis.${i}.item.id` in errors
                                        }
                                        margin="dense"
                                        {...params}
                                        label="Select Item"
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={2}>
                            <TextField
                                fullWidth
                                name="required_qty"
                                value={cell.required_qty}
                                onChange={(e) => {
                                    handleChang(e, i);
                                }}
                                size="small"
                                margin="dense"
                                label="Qty"
                                color="secondary"
                                error={
                                    `boqAnalysis.${i}.required_qty` in errors
                                }
                            />
                        </Grid>
                        <Grid item lg={2}>
                            <TextField
                                value={cell["rate"]}
                                onChange={(e) => {
                                    handleChang(e, i);
                                    // calculateReqQty();
                                }}
                                name="rate"
                                type="number"
                                size="small"
                                margin="dense"
                                label="Rate"
                                error={`boqAnalysis.${i}.rate` in errors}
                                // error={
                                //     `analysis.${i}.rate` in errors
                                // }
                                // helperText={
                                //     `analysis.${i}.rate` in
                                //         errors &&
                                //     errors[
                                //         `analysis.${i}.rate`
                                //     ].map((e) => e)
                                // }
                            />
                        </Grid>
                        <Grid item lg={3}>
                            <TextField
                                disabled
                                value={ROUND(cell.required_qty * cell.rate)}
                                name="amount"
                                size="small"
                                margin="dense"
                                label="Amount"
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton
                                size="small"
                                onClick={() => deleteAnalysis(i)}
                                sx={{
                                    mx: 1,
                                    border: 1,
                                    borderColor: red[500],
                                }}
                            >
                                <DeleteIcon color="error" />
                            </IconButton>
                        </Grid>
                    </Grid>
                );
            })}
            <Grid
                container
                alignItems="center"
                border={0.5}
                borderColor={grey[200]}
                bgcolor={blue[200]}
                px={1}
                py={0.5}
            >
                <Grid item xs={8}>
                    Analysis Rs.
                </Grid>
                <Grid item xs={3} textAlign="center">
                    {round(
                        boqAnalysis.reduce(
                            (t, c, i) => (t += c.required_qty * c.rate),
                            0
                        )
                    )}
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
            <Grid
                container
                alignItems="center"
                border={0.5}
                borderColor={grey[200]}
                bgcolor={blue[200]}
                px={1}
                py={0.5}
            >
                <Grid item xs={8}>
                    BOQ Rs.
                </Grid>
                <Grid item xs={3} textAlign="center">
                    {parseInt(
                        (boq.qty * boq.quoted_rate) / (boq.baseQty || 1)
                    ) || 0}
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid>
            <GetDiffer boq={boq} analysis={boqAnalysis} />
        </>
    );
};
const getConversionFactor = (sch, boq) => {
    if (sch && boq) {
        let scheduleUnit = sch.toLowerCase();
        let boqUnit = boq.toLowerCase();
        if (scheduleUnit == "cft" && boqUnit == "m3") {
            return 35.32;
        }
        if (scheduleUnit == "cum" && boqUnit == "cft") {
            return 0.0283168466;
        }
        if (scheduleUnit == "cft" && boqUnit == "cum") {
            return 35.32;
        }
        if (scheduleUnit == "m2" && boqUnit == "sft") {
            return 0.0929368;
        }
        if (scheduleUnit == "sft" && boqUnit == "m2") {
            return 10.76;
        }
    }
    return 1;
};
export default BOQ;

const calculateBoqAnalysis = (boq, setBoqAnalysis, schAnalysis, cf = 1) => {
    if (schAnalysis && schAnalysis.analysis.length > 0) {
        const BOQAnalays = schAnalysis.analysis.map((v, i) => {
            return {
                id: "",
                item: v.item,
                required_qty:
                    (v.required_qty / schAnalysis.baseQty) * boq.qty * cf,
                rate: v.rate,
            };
        });
        setBoqAnalysis(BOQAnalays);
    }
};

const GetDiffer = ({ boq, analysis }) => {
    const BoqAmount = (boq.qty * boq.quoted_rate) / (boq.baseQty || 1);
    const AnalsysAmount = round(
        analysis.reduce((t, c, i) => (t += c.required_qty * c.rate), 0)
    );
    const Diff = parseInt(BoqAmount - AnalsysAmount);
    return (
        <Grid
            container
            alignItems="center"
            bgcolor={Diff > 0 ? green[200] : pink[200]}
            px={1}
            py={0.5}
        >
            <Grid item xs={8}>
                Diff in Rs.
            </Grid>
            <Grid item xs={3} textAlign="center">
                {Diff}
            </Grid>
            <Grid item xs={1}></Grid>
        </Grid>
    );
};

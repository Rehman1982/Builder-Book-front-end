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
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { amber, grey, lime, purple, red } from "@mui/material/colors";
import React from "react";
import { useState } from "react";

const Header = ({
    shouldlock,
    baseForAnalysis,
    setBaseForAnalysis,
    calculateReqQty,
    errors,
    state,
    setState,
    setAnalysis,
}) => {
    return (
        <Stack direction="row" spacing={2}>
            <TextField
                // disabled={shouldlock}
                name="base_qty"
                value={baseForAnalysis.base_qty}
                onChange={(e) => {
                    setBaseForAnalysis({
                        ...baseForAnalysis,
                        base_qty: e.target.value,
                    });
                }}
                onBlur={calculateReqQty}
                sx={{ width: "33%" }}
                margin="dense"
                size="small"
                label="Base Qty"
                error={"base_qty" in errors}
                helperText={
                    "base_qty" in errors && errors.base_qty.map((e) => e)
                }
            />
            <TextField
                // disabled={shouldlock}
                name="base_unit"
                value={baseForAnalysis.base_unit}
                onBlur={calculateReqQty}
                onChange={(e) => {
                    setBaseForAnalysis({
                        ...baseForAnalysis,
                        base_unit: e.target.value,
                    });
                }}
                sx={{ width: "33%" }}
                margin="dense"
                size="small"
                label="Unit"
                error={"base_unit" in errors}
                helperText={
                    "base_unit" in errors && errors.base_unit.map((e) => e)
                }
            />
            <TextField
                name="cf"
                type="number"
                value={baseForAnalysis.cf}
                onBlur={calculateReqQty}
                onChange={(e) => {
                    setBaseForAnalysis({
                        ...baseForAnalysis,
                        cf: e.target.value,
                    });
                }}
                sx={{ width: "34%" }}
                margin="dense"
                size="small"
                label={`Coversion Factor (${state.boqunit} to ${baseForAnalysis.base_unit})`}
                error={"cf" in errors}
                helperText={"cf" in errors && errors.cf.map((e) => e)}
            />
        </Stack>
    );
};
const Analysis = ({
    shouldlock,
    analysis,
    sch,
    itms,
    errors,
    baseForAnalysis,
    setBaseForAnalysis,
    calculateReqQty,
    state,
    setState,
    setAnalysis,
    handleChangeAnalysis,
}) => {
    const [open, setOpen] = useState(false);
    const addAnalysis = () => {
        const blank = {
            item_id: { item: "", id: "" },
            required_qty: 0,
            rate: 0,
        };
        setAnalysis(analysis.concat(blank));
    };
    const deleteAnalysis = (index) => {
        setAnalysis((prv) => {
            return prv.filter((analysis, i) => i !== index);
        });
    };
    return (
        <>
            <Button
                variant="contained"
                children={"Analysis"}
                onClick={() => setOpen(true)}
            />
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Analysis</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom noWrap variant="h6">
                        {shouldlock && (
                            <Button
                                children={"Edit"}
                                startIcon={<EditIcon variant="outlined" />}
                            />
                        )}
                    </Typography>
                    <Header
                        shouldlock={shouldlock}
                        baseForAnalysis={baseForAnalysis}
                        setBaseForAnalysis={setBaseForAnalysis}
                        calculateReqQty={calculateReqQty}
                        errors={errors}
                        state={state}
                        setState={setState}
                        setAnalysis={setAnalysis}
                    />
                    <Divider sx={{ marginY: "10px" }} />
                    <Grid container justifyContent={"space-between"}>
                        <Grid item>
                            <IconButton
                                children={<ControlPointIcon />}
                                onClick={addAnalysis}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label="Analysis Total"
                                size="small"
                                value={
                                    analysis.reduce((t, c) => {
                                        t += c.qty_for_boq * c.rate;
                                        return t;
                                    }, 0) || 0
                                }
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ maxHeight: "45vh", overflow: "auto" }}>
                        {analysis.map((cell, i) => {
                            return (
                                <Grid
                                    key={i}
                                    container
                                    sx={{
                                        p: 2,
                                        my: 1,
                                        backgroundColor: amber[50],
                                        border: 2,
                                        borderColor: amber[500],
                                        borderRadius: 2,
                                    }}
                                >
                                    <Grid item sm={12} lg={12}>
                                        <Stack
                                            direction={"row"}
                                            sx={{ justifyContent: "end" }}
                                        >
                                            <FormControl
                                                fullWidth
                                                children={
                                                    <Autocomplete
                                                        loading={true}
                                                        // disabled={shouldlock}
                                                        size="small"
                                                        options={itms}
                                                        getOptionLabel={(
                                                            options
                                                        ) =>
                                                            `${options.item}--${
                                                                options.unitinfo !=
                                                                    undefined &&
                                                                options.unitinfo
                                                                    .unit
                                                            }`
                                                        }
                                                        isOptionEqualToValue={(
                                                            options
                                                        ) => options.item}
                                                        value={
                                                            analysis[i][
                                                                "item_id"
                                                            ]
                                                        }
                                                        onChange={(
                                                            event,
                                                            abc
                                                        ) => {
                                                            let uPA = [
                                                                ...analysis,
                                                            ];
                                                            uPA[i]["item_id"] =
                                                                abc;
                                                            setAnalysis(uPA);
                                                            calculateReqQty();
                                                        }}
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                error={
                                                                    `analysis.${i}.item_id` in
                                                                    errors
                                                                }
                                                                helperText={
                                                                    `analysis.${i}.item_id` in
                                                                        errors &&
                                                                    errors[
                                                                        `analysis.${i}.item_id`
                                                                    ].map(
                                                                        (e) => e
                                                                    )
                                                                }
                                                                {...params}
                                                                label="Select Item"
                                                            />
                                                        )}
                                                    />
                                                }
                                            />
                                            <IconButton
                                                onClick={() =>
                                                    deleteAnalysis(i)
                                                }
                                                sx={{
                                                    mx: 1,
                                                    border: 1,
                                                    borderColor: red[500],
                                                }}
                                            >
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </Stack>
                                    </Grid>
                                    <Grid item sm={12} md={3}>
                                        <TextField
                                            fullWidth
                                            // disabled={shouldlock}
                                            name="required_qty"
                                            value={analysis[i]["required_qty"]}
                                            onChange={() => {
                                                handleChangeAnalysis(event, i);
                                                calculateReqQty();
                                            }}
                                            size="small"
                                            margin="dense"
                                            label="Qty for Base"
                                            color="secondary"
                                            error={
                                                `analysis.${i}.required_qty` in
                                                errors
                                            }
                                            helperText={
                                                `analysis.${i}.required_qty` in
                                                    errors &&
                                                errors[
                                                    `analysis.${i}.required_qty`
                                                ].map((e) => e)
                                            }
                                        />
                                    </Grid>
                                    <Grid item lg={3}>
                                        <TextField
                                            disabled
                                            name="qty_for_boq"
                                            value={
                                                analysis[i]["qty_for_boq"] ||
                                                " "
                                            }
                                            size="small"
                                            type="text"
                                            margin="dense"
                                            label="Qty for BOQ"
                                            error={
                                                `analysis.${i}.qty_for_boq` in
                                                errors
                                            }
                                            helperText={
                                                `analysis.${i}.qty_for_boq` in
                                                    errors &&
                                                errors[
                                                    `analysis.${i}.qty_for_boq`
                                                ].map((e) => e)
                                            }
                                        />
                                    </Grid>
                                    <Grid item lg={3}>
                                        <TextField
                                            value={analysis[i]["rate"]}
                                            onChange={() => {
                                                handleChangeAnalysis(event, i);
                                                calculateReqQty();
                                            }}
                                            name="rate"
                                            type="number"
                                            size="small"
                                            margin="dense"
                                            label="Rate"
                                            error={
                                                `analysis.${i}.rate` in errors
                                            }
                                            helperText={
                                                `analysis.${i}.rate` in
                                                    errors &&
                                                errors[
                                                    `analysis.${i}.rate`
                                                ].map((e) => e)
                                            }
                                        />
                                    </Grid>
                                    <Grid item lg={3}>
                                        <TextField
                                            disabled
                                            value={analysis[i]["amount"] || " "}
                                            name="amount"
                                            size="small"
                                            margin="dense"
                                            label="Amount"
                                            error={
                                                `analysis.${i}.amount` in errors
                                            }
                                            helperText={
                                                `analysis.${i}.amount` in
                                                    errors &&
                                                errors[
                                                    `analysis.${i}.amount`
                                                ].map((e) => e)
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                // </Paper>
                            );
                        })}
                    </Box>
                    {/* </Paper> */}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Analysis;

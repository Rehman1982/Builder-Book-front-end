import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    ButtonGroup,
    Stack,
    DialogActions,
} from "@mui/material";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import { useEffect } from "react";
import axios from "axios";
import ItemAnalysis from "./Analysis";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { Error } from "../../../helpers/helpers";
import DeleteItem from "./Delete";
const defaultState = {
    schedules_id: "",
    id: "",
    item_code: "",
    description: "",
    bs_base_qty: "",
    bs_unit: "",
    bs_composite: "",
};
const CreateItem = forwardRef(
    ({ variant, currentItem, setCurrentItem, setRefresh }, ref) => {
        const location = useLocation();
        const { scheduleId } = location.state;
        const AnalysisRef = useRef();
        const opneAnalysis = () => {
            AnalysisRef.current.openDialog();
        };

        useImperativeHandle(ref, () => ({
            open: () => {
                setOpen(true);
            },
        }));
        // State to manage the current item being added
        const [state, setState] = useState(defaultState);
        const [errors, setErrors] = useState({});
        const [analysis, setAnalysis] = useState([
            // {
            //     id: "",
            //     item_id: "",
            //     item: {},
            //     required_qty: "",
            //     rate: "",
            // },
            // {
            //     id: "",
            //     item_id: "",
            //     item: {},
            //     required_qty: "",
            //     rate: "",
            // },
        ]);
        const [disabled, setDisabled] = useState(false);
        const [open, setOpen] = useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
            setCurrentItem(null);
            setAnalysis([]);
        };
        // Handle input changes for the new item
        const handleChange = (e) => {
            const { name, value } = e.target;
            setState((prev) => ({ ...prev, [name]: value }));
        };
        const hanldeSubmit = async () => {
            console.log(state);
            try {
                const res = await axios.post(
                    route("estimation.schedules.items.store"),
                    { ...state, analysis: analysis }
                );
                if (res.status == 203) {
                    setErrors(res.data);
                    console.log(res.data);
                }
                if (res.status == 200) {
                    console.log(res.data);
                    setRefresh(true);
                }
            } catch (error) {
                console.log(error.response);
            }
        };
        useEffect(() => {
            if (variant == "View") {
                setState(currentItem);
                setDisabled(true);
            }
            if (variant == "Add") {
                setDisabled(false);
                setState({ ...defaultState, schedules_id: scheduleId });
            }
            if (variant == "Edit") {
                if (currentItem !== null) {
                    setState(currentItem);
                    if (
                        currentItem.schedule_analysis &&
                        currentItem.schedule_analysis.length > 0
                    ) {
                        setAnalysis(currentItem.schedule_analysis);
                    }
                    setDisabled(false);
                }
            }
        }, [variant, currentItem]);
        return (
            <>
                <ItemAnalysis
                    analysis={analysis}
                    setAnalysis={setAnalysis}
                    ref={AnalysisRef}
                />
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{variant} Item</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Item Code"
                            name="item_code"
                            value={state.item_code || ""}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            required
                            error={"item_code" in errors}
                            helperText={
                                <Error errors={errors} name="item_code" />
                            }
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            name="description"
                            value={state.description || ""}
                            onChange={handleChange}
                            variant="outlined"
                            multiline
                            rows={3}
                            fullWidth
                            required
                            error={"description" in errors}
                            helperText={
                                <Error errors={errors} name="description" />
                            }
                        />
                        <TextField
                            margin="dense"
                            label="Base Quantity"
                            name="bs_base_qty"
                            value={state.bs_base_qty || ""}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            required
                            error={"bs_base_qty" in errors}
                            helperText={
                                <Error errors={errors} name="bs_base_qty" />
                            }
                        />
                        <TextField
                            margin="dense"
                            label="Unit"
                            name="bs_unit"
                            value={state.bs_unit}
                            onChange={handleChange}
                            variant="outlined"
                            fullWidth
                            required
                            error={"bs_unit" in errors}
                            helperText={
                                <Error errors={errors} name="bs_unit" />
                            }
                        />
                        <Grid container>
                            <TextField
                                component={Grid}
                                item
                                xs={state.bs_base_qty > 0 ? 8 : 12}
                                margin="dense"
                                label="Composite"
                                name="bs_composite"
                                value={state.bs_composite || ""}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                required
                                error={"bs_composite" in errors}
                                helperText={
                                    <Error
                                        errors={errors}
                                        name="bs_composite"
                                    />
                                }
                            />
                            <Button
                                onClick={opneAnalysis}
                                variant="outlined"
                                component={Grid}
                                item
                                xs={4}
                                sx={{
                                    my: 1,
                                    display:
                                        state.bs_base_qty > 0 ? "" : "none",
                                }}
                            >
                                Analysis
                            </Button>
                        </Grid>
                    </DialogContent>
                    <DialogActions component={ButtonGroup}>
                        {variant == "Edit" && (
                            <DeleteItem
                                id={currentItem?.id}
                                setRefresh={setRefresh}
                                closeParentForm={setOpen}
                            />
                        )}
                        <Button
                            onClick={hanldeSubmit}
                            variant="contained"
                            color="primary"
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
);

export default CreateItem;

import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useContext,
} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Autocomplete,
} from "@mui/material";
import { ScheduleContext } from "../ScheduleProvider";

const Analysis = forwardRef(({ analysis, setAnalysis }, ref) => {
    const { materialItems } = useContext(ScheduleContext);
    // State data
    const [open, setOpen] = useState(false);
    // UseImperativeHandle to expose openDialog and closeDialog methods
    useImperativeHandle(ref, () => ({
        openDialog: () => {
            setOpen(true);
        },
        closeDialog: () => {
            setOpen(false);
            resetForm(); // Reset form on close
        },
    }));

    // Handle input change
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setAnalysis((prv) => {
            let a = [...prv];
            a[index][name] = value;
            return a;
        });
    };

    // Reset form data
    const resetForm = () => {
        setFormData({ item_id: "", required_qty: "", rate: "" });
    };

    // Handle submit
    const handleSubmit = () => {
        // console.log("Submitted Data:", formData);
        setOpen(false);
        resetForm(); // Reset form after submission
    };
    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="lg"
        >
            <DialogTitle>Analysis</DialogTitle>
            <DialogContent>
                <Button
                    onClick={() =>
                        setAnalysis(
                            analysis.concat({
                                id: "",
                                item_id: "",
                                item: {},
                                required_qty: "",
                                rate: "",
                            })
                        )
                    }
                >
                    Add
                </Button>
                {analysis?.map((v, i) => (
                    <Grid container columnSpacing={0.5} key={i}>
                        <Grid item xs={3}>
                            <Autocomplete
                                options={materialItems}
                                value={v.item}
                                getOptionLabel={(option) =>
                                    `${option.item}(${option?.unitinfo?.unit})`
                                }
                                onChange={(e, v) =>
                                    setAnalysis((prv) => {
                                        let a = [...prv];
                                        a[i]["item"] = v;
                                        return a;
                                    })
                                }
                                renderInput={(option) => (
                                    <TextField
                                        {...option}
                                        label="item"
                                        size="small"
                                        margin="dense"
                                    />
                                )}
                            />
                            {/* <TextField
                                label="Item ID"
                                name="item_id"
                                value={v.item_id}
                                onChange={(e) => handleChange(e, i)}
                                size="small"
                                margin="dense"
                            /> */}
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                label="Required Quantity"
                                name="required_qty"
                                value={v.required_qty}
                                onChange={(e) => handleChange(e, i)}
                                type="number"
                                size="small"
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                label="Rate"
                                name="rate"
                                value={v.rate}
                                onChange={(e) => handleChange(e, i)}
                                type="number"
                                size="small"
                                margin="dense"
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField
                                fullWidth
                                label="Total"
                                name="rate"
                                value={v.required_qty * v.rate || ""}
                                type="number"
                                size="small"
                                margin="dense"
                            />
                        </Grid>
                    </Grid>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="secondary">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} color="primary">
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
});

export default Analysis;

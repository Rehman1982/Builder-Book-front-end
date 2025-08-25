import React, { useContext, useState, useRef, useEffect } from "react";
import ProgTrackingContext from "./context";
import { useParams } from "react-router-dom";
import axios from "axios";
import { amber } from "@mui/material/colors";
import { Autocomplete, Box, Button, Dialog, Divider, LinearProgress, TextField, Typography } from "@mui/material";

const CreateActivity = ({ parents }) => {
    const params = useParams();
    const { showAlert, setMessage } = useContext(ProgTrackingContext);
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState(false);
    const [state, setState] = useState({ project_id: params.id, activity_id: "", boq_id: "", activity_name: "", parent_id: "", start: "", finish: "", budget: 0, type: "activity" });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setState((prv) => {
            let newState = { ...prv };
            newState[e.target.name] = e.target.value;
            return newState;
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setProgress(true);
        axios.post(route("progressTracking.store"), state).then(res => {
            if (res.status == 200) {
                if (res.data.errors) {
                    setErrors(res.data.errors);
                    console.log(res.data.errors);
                } else {
                    console.log(res.data);
                    setMessage("Activity Created");
                    showAlert(true);
                    hideForm();
                    params.refresh = true;
                    setProgress(false);
                }
            }
        });
    }
    const showForm = () => {
        setOpen(true);
    }
    const hideForm = () => {
        setState({ ...state, parent_id: "", activity_id: "", boq_id: "", activity_name: "", start: "", finish: "", budget: 0, });
        setOpen(false);
    }
    return (
        <>
            <Button variant="contained" color="success" onClick={showForm}>Create Activity</Button>
            <Dialog
                open={open}
                onClose={hideForm}
            >
                <Box sx={{ p: 4 }} >
                    <Typography variant="h6" gutterBottom>Create Activity</Typography>
                    <Autocomplete
                        options={parents.filter(itm => itm.type === "milestone")}
                        getOptionLabel={(option) => option.activity_name}
                        value={parents.filter(e => e.id == state.parent_id)[0]}
                        onChange={(event, value) => { setState({ ...state, parent_id: value.id }); }}
                        renderInput={(params) =>
                            <TextField
                                error={(errors && errors.parent_id) ? true : false}
                                helperText={(errors && errors.parent_id) && errors.parent_id.map((e) => e)}
                                {...params} label="Parent Name"
                            />
                        }
                    >
                    </Autocomplete>
                    <TextField
                        fullWidth
                        label="Activity ID"
                        margin="normal"
                        type="text"
                        name="activity_id"
                        value={state.activity_id}
                        onChange={handleChange}
                        error={errors && errors.activity_id ? true : false}
                        helperText={errors && errors.activity_id && errors.activity_id.map((e) => e)}
                    />
                    {/* <TextField
                        sx={{ width: "50%" }}
                        label="BOQ ID"
                        margin="normal"
                        type="text"
                        name="boq_id"
                        value={state.boq_id}
                        onChange={handleChange}
                        error={errors && errors.boq_id ? true : false}
                        helperText={errors && errors.boq_id && errors.boq_id.map((e) => e)}
                        variant="outlined"
                    /> */}
                    <TextField
                        fullWidth
                        label="Activity Name"
                        margin="normal"
                        multiline
                        rows={4}
                        name="activity_name"
                        value={state.activity_name}
                        onChange={handleChange}
                        error={errors && errors.activity_name ? true : false}
                        helperText={errors && errors.activity_name && errors.activity_name.map((e) => e)}
                        variant="outlined"
                    />
                    <TextField
                        sx={{ width: "50%" }}
                        label="Start"
                        margin="normal"
                        type="date"
                        name="start"
                        value={state.start}
                        onChange={handleChange}
                        error={errors && errors.start ? true : false}
                        helperText={errors && errors.start && errors.start.map((e) => e)}
                        variant="outlined"
                    />

                    <TextField
                        sx={{ width: "50%" }}
                        label="Finish "
                        margin="normal"
                        type="date"
                        name="finish"
                        value={state.finish}
                        onChange={handleChange}
                        error={errors && errors.finish ? true : false}
                        helperText={errors && errors.finish && errors.finish.map((e) => e)}
                        variant="outlined"

                    />

                    <TextField
                        fullWidth
                        label="Budget"
                        margin="normal"
                        type="number"
                        name="budget"
                        value={state.budget}
                        onChange={handleChange}
                        error={errors && errors.budget ? true : false}
                        helperText={errors && errors.budget && errors.budget.map((e) => e)}
                        variant="outlined"

                    />
                    {progress && <LinearProgress sx={{ my: 1 }} />}
                    <Button variant="outlined" color="success" onClick={handleSubmit}>Create Activity</Button>
                </Box >
            </Dialog >
        </>
    )
}
const EditActivity = ({ parents }) => {
    const params = useParams();
    const [progress, setProgress] = useState(false);
    const { toggles, setToggles, showAlert, setMessage, editState } = useContext(ProgTrackingContext);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ id: "", project_id: params.id, activity_id: "", boq_id: "", activity_name: "", parent_id: "", start: "", finish: "", budget: 0, type: "activity" });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setState((prv) => {
            let newState = { ...prv };
            newState[e.target.name] = e.target.value;
            return newState;
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setProgress(true);
        axios.put(route("progressTracking.update", { progressTracking: 1 }), state).then(res => {
            if (res.status == 200) {
                if (res.data.errors) {
                    setErrors(res.data.errors);
                    console.log(res.data.errors);
                } else {
                    setToggles({ ...toggles, snakeBar: true });
                    setMessage("Activity Edited Successfully!");
                    showAlert(true);
                    hideForm();
                    setState({ id: "", activity_id: "", boq_id: "", activity_name: "", parent_id: "", start: "", finish: "", budget: 0, type: "activity" });
                    params.refresh = true;
                    setProgress(false);
                }
            }
        });
    }
    const showForm = () => {
        setOpen(true);
    }
    const hideForm = () => {
        setOpen(false);
        setToggles({ ...toggles, editActivity: false });
    }
    useEffect(() => {
        if (toggles.editActivity) {
            showForm();
            setState(editState);
        }
    }, [toggles.editActivity]);
    return (
        <>
            <Dialog
                open={open}
                onClose={hideForm}
            >
                <Box sx={{ p: 4, backgroundColor: amber[100] }} >
                    <Typography variant="h6" gutterBottom>Update Activity</Typography>
                    <Divider />
                    <Autocomplete
                        options={parents.filter(itm => itm.type === "milestone")}
                        getOptionLabel={(option) => option.activity_name}
                        value={parents.filter(e => e.id == state.parent_id)[0]}
                        onChange={(event, value) => { setState({ ...state, parent_id: value.id }); }}
                        renderInput={(params) =>
                            <TextField
                                error={(errors && errors.parent_id) ? true : false}
                                helperText={(errors && errors.parent_id) && errors.parent_id.map((e) => e)}
                                {...params} label="Parent Name"
                            />
                        }
                    >
                    </Autocomplete>
                    <TextField
                        sx={{ width: "50%" }}
                        label="Activity ID"
                        margin="normal"
                        type="text"
                        name="activity_id"
                        value={state.activity_id}
                        onChange={handleChange}
                        error={errors && errors.activity_id ? true : false}
                        helperText={errors && errors.activity_id && errors.activity_id.map((e) => e)}
                    />
                    <TextField
                        sx={{ width: "50%" }}
                        label="BOQ ID"
                        margin="normal"
                        type="text"
                        name="boq_id"
                        value={state.boq_id}
                        onChange={handleChange}
                        error={errors && errors.boq_id ? true : false}
                        helperText={errors && errors.boq_id && errors.boq_id.map((e) => e)}
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        label="Activity Name"
                        margin="normal"
                        multiline
                        rows={4}
                        name="activity_name"
                        value={state.activity_name}
                        onChange={handleChange}
                        error={errors && errors.activity_name ? true : false}
                        helperText={errors && errors.activity_name && errors.activity_name.map((e) => e)}
                        variant="outlined"
                    />
                    <TextField
                        sx={{ width: "50%" }}
                        label="Start"
                        margin="normal"
                        type="date"
                        name="start"
                        value={state.start}
                        onChange={handleChange}
                        error={errors && errors.start ? true : false}
                        helperText={errors && errors.start && errors.start.map((e) => e)}
                        variant="outlined"
                    />

                    <TextField
                        sx={{ width: "50%" }}
                        label="Finish "
                        margin="normal"
                        type="date"
                        name="finish"
                        value={state.finish}
                        onChange={handleChange}
                        error={errors && errors.finish ? true : false}
                        helperText={errors && errors.finish && errors.finish.map((e) => e)}
                        variant="outlined"

                    />

                    <TextField
                        fullWidth
                        label="Budget"
                        margin="normal"
                        type="number"
                        name="budget"
                        value={state.budget}
                        onChange={handleChange}
                        error={errors && errors.budget ? true : false}
                        helperText={errors && errors.budget && errors.budget.map((e) => e)}
                        variant="outlined"

                    />
                    {progress && <LinearProgress sx={{ my: 1 }} />}
                    <Button variant="outlined" color="success" onClick={handleSubmit}>Update Activity</Button>
                </Box >
            </Dialog >
        </>
    )
}
export { EditActivity, CreateActivity };

import { useContext, useState, useRef, useEffect } from "react";
import ProgTrackingContext from "./context";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Autocomplete, Box, Dialog, Divider, TextField, Typography, Button, LinearProgress } from "@mui/material";
const CreateMileStone = ({ parents }) => {
    const params = useParams();
    const [progress, setProgress] = useState(false);
    const { showAlert, setMessage, toggles, setToggles } = useContext(ProgTrackingContext);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ id: "", project_id: params.id, activity_id: "", boq_id: "", activity_name: "", parent_id: "", start: "", finish: "", budget: 0, type: "milestone" });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        console.log(parents);
        setState((prv) => {
            let newState = { ...prv };
            newState[e.target.name] = e.target.value;
            return newState;
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(route("progressTracking.store"), state).then(res => {
            console.log(res);
            if (res.status == 200) {
                if (res.data.errors) {
                    setErrors(res.data.errors);
                    console.log(res.data.errors);
                } else {
                    setMessage("Milestone Created");
                    showAlert(true);
                    setToggles({ ...toggles, snakeBar: true });
                    Object.keys(state).forEach(v => { state[v] = "" });
                    setState({ ...state, type: "milestone", project_id: params.id });
                    hideForm();
                    params.refresh = true;
                }
            }
        });
    }
    const showForm = () => {
        setOpen(true);
    }
    const hideForm = () => {
        setToggles({ ...toggles, editMilestone: false });
        setOpen(false);
    }
    return (
        <>
            <Button variant="contained" onClick={showForm} >Create MileStone</Button>
            <Dialog
                open={open}
                onClose={hideForm}
            >
                <Divider />
                <Box sx={{ p: { sm: 2, md: 4 } }}>
                    <Typography variant="h6" gutterBottom>Create MileStone</Typography>
                    <Autocomplete
                        options={parents.filter(flt => (flt.type == "milestone") && { id: flt.id, name: flt.activity_name })}
                        getOptionLabel={(option) => option.activity_name}
                        value={parents.filter(v => v.id == state.parent_id)[0]}
                        onChange={(e, value) => {
                            setState({ ...state, parent_id: value.id });
                        }}
                        renderInput={(params) =>
                            <TextField
                                margin="normal"
                                error={(errors && errors.parent_id) ? true : false}
                                helperText={(errors && errors.parent_id) && errors.parent_id.map((e) => e)}
                                {...params} label="Parent Name" />
                        }
                    // value={index.filter(f => (f.id == state.parent_id) && { id: f.id, name: "abc" })}
                    >
                    </Autocomplete>
                    <TextField
                        fullWidth
                        name="activity_id"
                        value={state.activity_id}
                        onChange={handleChange}
                        label="Activity ID"
                        margin="normal"
                        error={(errors && errors.activity_id) ? true : false}
                        helperText={(errors && errors.activity_id) && errors.activity_id.map((e) => e)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Milestone Name"
                        multiline
                        minRows={4}
                        name="activity_name"
                        value={state.activity_name}
                        onChange={handleChange}
                        error={(errors && errors.activity_name) ? true : false}
                        helperText={(errors && errors.activity_name) && errors.activity_name.map((e) => e)}
                    />
                    {progress && <LinearProgress sx={{ my: 1 }} />}
                    <Button variant="contained" onClick={handleSubmit}> Create Milestone </Button>
                </Box>
            </Dialog>
        </>
    )
}
const EditMileStone = ({ parents }) => {
    const params = useParams();
    const [progress, setProgress] = useState(false);
    const { selectedProject, showAlert, setMessage, toggles, setToggles, editState, closeBtn } = useContext(ProgTrackingContext);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ id: "", project_id: selectedProject.id, activity_id: "", boq_id: "", activity_name: "", parent_id: "", start: "", finish: "", budget: 0, type: "milestone" });
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        // console.log(parents);
        setState((prv) => {
            let newState = { ...prv };
            newState[e.target.name] = e.target.value;
            return newState;
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setProgress(true);
        axios.put(route("progressTracking.update", { "progressTracking": "1" }), state).then(res => {
            if (res.status == 200) {
                if (res.data.errors) {
                    setErrors(res.data.errors);
                    console.log(res.data.errors);
                } else {
                    setMessage("Milestone Edited Successfully! ");
                    showAlert(true);
                    setToggles({ ...toggles, snakeBar: true });
                    Object.keys(state).forEach(v => { state[v] = "" });
                    setState({ ...state, type: "milestone" });
                    hideForm();
                    setProgress(false);
                    params.refresh = true;
                }
            }
        });
    }
    const showForm = () => {
        setOpen(true);
    }
    const hideForm = () => {
        setToggles({ ...toggles, editMilestone: false });
        setOpen(false);
    }
    useEffect(() => {
        if (toggles.editMilestone) {
            setState((prv) => {
                let n = { ...prv };
                n.id = editState.id;
                n.parent_id = editState.parent_id;
                n.activity_id = editState.activity_id;
                n.activity_name = editState.activity_name;
                n.boq_id = editState.boq_id;
                n.project_id = editState.project_id;
                return n;
            });
            showForm();

        }
    }, [toggles.editMilestone]);
    return (
        <Dialog
            open={open}
            onClose={hideForm}
        >
            <Divider />
            <Box sx={{ p: { sm: 2, md: 4 } }}>
                <Typography variant="h6" gutterBottom>Update MileStone</Typography>
                <Autocomplete
                    options={parents.filter(flt => (flt.type == "milestone") && { id: flt.id, name: flt.activity_name })}
                    getOptionLabel={(option) => option.activity_name}
                    value={parents.filter(v => v.id == state.parent_id)[0]}
                    onChange={(event, value) => {
                        setState({ ...state, parent_id: value.id });
                    }}
                    renderInput={(params) =>
                        <TextField
                            margin="normal"
                            error={(errors && errors.parent_id) ? true : false}
                            helperText={(errors && errors.parent_id) && errors.parent_id.map((e) => e)}
                            {...params}
                            label="Parent Name"
                        />
                    }
                // value={index.filter(f => (f.id == state.parent_id) && { id: f.id, name: "abc" })}
                >
                </Autocomplete>
                <TextField
                    fullWidth
                    name="activity_id"
                    value={state.activity_id}
                    onChange={handleChange}
                    label="Activity ID"
                    margin="normal"
                    error={(errors && errors.activity_id) ? true : false}
                    helperText={(errors && errors.activity_id) && errors.activity_id.map((e) => e)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Milestone Name"
                    multiline
                    minRows={4}
                    name="activity_name"
                    value={state.activity_name}
                    onChange={handleChange}
                    error={(errors && errors.activity_name) ? true : false}
                    helperText={(errors && errors.activity_name) && errors.activity_name.map((e) => e)}
                />
                {progress && <LinearProgress sx={{ my: 1 }} />}
                <Button variant="contained" onClick={handleSubmit}> Update Milestone </Button>
            </Box>
        </Dialog>
    )
}
export { CreateMileStone, EditMileStone };

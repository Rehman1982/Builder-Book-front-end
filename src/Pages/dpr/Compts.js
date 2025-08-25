import React, { useState, useEffect, useContext, memo, useCallback } from "react";
import { DPRContext } from "./DPRContext";
import {
    TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody,
    TableFooter, Button, Typography, TextField, Box, Stack, Backdrop, Divider,
    ImageList,
    ImageListItem,
    ListSubheader,
    ImageListItemBar,
    IconButton
} from "@mui/material";
import BrowserUpdatedIcon from '@mui/icons-material/BrowserUpdated';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { amber, indigo, red, lightGreen, grey, green } from '@mui/material/colors';
import Dialog from '@mui/material/Dialog';
import { Link, useParams } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";
const closeBtn = {
    position: "absolute",
    top: "0",
    right: "0",
    padding: "10px",
    cursor: "pointer",
}
const dateTostr = (date = null) => {
    // let dt = null;
    if (date == null) {
        let dt = new Date();
        return `${dt.getDate()}${dt.getMonth() + 1}${dt.getFullYear()}`;
    } else {
        let dt = new Date(date);
        return `${dt.getDate()}${dt.getMonth() + 1}${dt.getFullYear()}`;
    }
}
const dateToDMY = (date = null) => {
    // let dt = null;
    if (date == null) {
        let dt = new Date();
        return `${dt.getDate()}-${dt.getMonth() + 1}-${dt.getFullYear()}`;
    } else {
        let dt = new Date(date);
        return `${dt.getDate()}-${dt.getMonth() + 1}-${dt.getFullYear()}`;
    }
}
const Loader = () => {
    const [open, setOpen] = useState(false);
    const { toggles, setToggles } = useContext(DPRContext);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    useEffect(() => {
        if (toggles.loader) { setOpen(true) }
        if (toggles.loader == false) { setOpen(false) }
    }, [toggles.loader])
    return (
        <Backdrop
            open={open}
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            onClick={handleClose}
        >
            <CircularProgress />
        </Backdrop>

    )
}
const ProjectSelector = () => {
    const { projects, selectedProject, setSelectedProject, getData } = useContext(DPRContext);
    const handleChange = (e) => {
        setSelectedProject({ id: e.target.value });
        getData(e.target.value);
    }
    return (
        <div className=" col-4 mb-2">
            <select className="form-control selectpicker" onChange={handleChange}>
                <option>Selec Project</option>
                {projects.map((v, i) =>
                    v.id == selectedProject.id ?
                        <option key={i} value={v.id} selected>{v.name} {v.id}</option> :
                        <option key={i} value={v.id}>{v.name} {v.id}</option>
                )}
            </select>
        </div>
    )
}
const SnakeBar = () => {
    const { toggles, setToggles, setMessage, message } = useContext(DPRContext);
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        setMessage("");
        setToggles({ ...toggles, snakeBar: false });
    };
    useEffect(() => {
        if (toggles.snakeBar) {
            setOpen(true);
        }
    }, [toggles.snakeBar])

    return (
        <div className="col-12 col-md-4">
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message={message}
            // action={action}
            />
        </div>
    )
}
const Menu = () => {
    const { toggles, setToggles, setprogresData, progresData } = useContext(DPRContext);
    const [open, setOpen] = useState(false);
    const showMenu = () => {
        setOpen(true);
    }
    const hideMenu = () => {
        setOpen(false);
        setToggles({ ...toggles, menu: false });
        setprogresData({});
    }
    useEffect(() => {
        if (toggles.menu) { showMenu() }
        if (toggles.menu == false) { hideMenu(); }
    }, [toggles.menu])
    return (
        <Dialog open={open}>
            <div>
                <div className="p-4 bg-warning rounded">
                    <i className="fa fa-close" style={closeBtn} onClick={hideMenu}></i>
                    <h5 className="mt-4 mb-2 text-center">Menu</h5>
                    <p>{progresData.activity_name}</p>
                    <ul className="list-group">
                        <li className="list-group-item">
                            <button className="btn btn-info btn-block" onClick={() => { setToggles({ ...toggles, createForm: true }) }}>Update Progress</button>
                        </li>
                        <li className="list-group-item">
                            <button className="btn btn-info btn-block" onClick={() => { setToggles({ ...toggles, pictureForm: true }) }}>Upload Photos</button>
                        </li>
                    </ul>
                </div>
            </div>
        </Dialog>
    )
}
const CreateDPR = () => {
    const { setIndex, allData, store, selectedProject, getData, progresData, toggles, setToggles, setMessage } = useContext(DPRContext);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ progres_tracking_id: "", work_done: 0, prv_work_done: 50 });
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
        store(state).then((response) => {
            if (response.success) {
                hideForm();
                setMessage("Progress Updated Successfully!");
                getData(progresData.project_id).then(res => setIndex(allData(res, res)));
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                    // setToggle("50vh");
                }
            }
        });
    }
    const showForm = () => {
        setOpen(true);
    }
    const hideForm = () => {
        setOpen(false);
        setToggles({ ...toggles, createForm: false, menu: false, snakeBar: true, });
    }
    const JsonDate = (date = null) => {
        if (date == null) {
            let dt = new Date();
            return `${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}`;
        } else {
            let dt = new Date(date);
            return `${dt.getDate()}-${dt.getMonth()}-${dt.getFullYear()}`;
        }
    }
    useEffect(() => {
        if (toggles.createForm) {
            showForm();
            // setState({ ...state, progres_tracking_id: progresData.id });
            setState((prv) => {
                let newState = { ...prv };
                newState.progres_tracking_id = progresData.id;
                newState.work_done = progresData.dpr.reduce((wd, v) => {
                    if (JsonDate(v.created_at) === JsonDate()) {
                        wd = v.work_done;
                    }
                    return wd;
                }, 0);
                newState.prv_work_done = progresData.dpr.reduce((ttl, v) => {
                    if (JsonDate(v.created_at) !== JsonDate()) {
                        ttl = ttl + v.work_done;
                    }
                    return ttl;
                }, 0);
                return newState;
            });
        }
    }, [toggles.createForm])
    return (
        <Dialog sx={{ padding: "5%" }} open={open}>
            <div className="row no-gutters">
                <div className="col-12 p-4">
                    <i className="fa fa-close" style={closeBtn} onClick={hideForm}></i>
                    <h4 className="text-center">Update Work Done</h4>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input name="progress_tracking_id" className="form-control" defaultValue={state.progres_tracking_id} type="text" hidden />
                            {(errors && errors.progress_tracking_id) && errors.progress_tracking_id.map((v, i) => <small key={i} className="text-muted text-danger">{v}</small>)}
                            <h5 className="mb-4">{progresData.activity_name}</h5>
                            <div className="form-group">
                                <label htmlFor="">Overall Progress (%) Except Today</label>
                                <input name="work_done" className="form-control" type="text" value={state.prv_work_done} readOnly />
                            </div>
                            <div className="form-group">
                                <label htmlFor="">Enter or Update today's progress in % Age</label>
                                <input name="work_done" className="form-control" type="text" min="1" max="100" value={state.work_done} onChange={handleChange} />
                                {(errors && errors.work_done) && errors.work_done.map((v, i) => <small key={i} className="text-muted text-danger">{v}</small>)}
                            </div>
                        </div>

                        <div className="form-group">
                            <button className="btn btn-outline-success">Update</button>
                        </div>
                    </form>

                </div>
            </div>
        </Dialog>
    )
}
const EditDPR = () => {
    const { update, getData, progresData, toggles, setToggles } = useContext(DPRContext);
    const [toggle, setToggle] = useState("-50vh");
    const [state, setState] = useState({ progres_tracking_id: "", work_done: 0 });
    const [changed, setChanged] = useState(false);
    const [errors, setErrors] = useState({});
    const handleChange = (e) => {
        setState((prv) => {
            let newState = { ...prv };
            newState[e.target.name] = e.target.value;
            return newState;
        });
        setChanged(true);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        update(state).then((response) => {
            if (response.success) {
                // hideForm();
                // getData(selectedProject.id);
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                    // setToggle("50vh");
                }
            }
        });
    }
    const showForm = () => {
        setToggle("50vh");
    }
    const hideForm = () => {
        setToggle("-50vh");
        setToggles({ ...toggles, editForm: false });
    }
    useEffect(() => {
        if (toggles.editForm) {
            showForm();
            const dpr = progresData.dpr.map((v, i) => {
                if (new Date(v.created_at).toJSON().slice(0, 10) == new Date().toJSON().slice(0, 10)) {
                    return v;
                };

            });
            // console.log(progresData);
            let todayProgress = progresData.dpr[progresData.dpr.length - 1];
            setState({ ...state, progres_tracking_id: progresData.id, work_done: todayProgress });
        }
    }, [toggles.editForm])
    const style = {
        position: "fixed",
        top: toggle,
        left: "50%",
        zIndex: "1000",
        transform: "translate(-50%,-50%)",
        transition: "all 0.5s ease-in-out"
    }
    return (
        <div>
            <div className="col-12 col-md-4 bg-light p-4 rounded shadow-lg" style={style}>
                <i className="fa fa-close" style={closeBtn} onClick={hideForm}></i>
                <h4 className="text-center">Edit Progress</h4>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input name="progress_tracking_id" className="form-control" defaultValue={state.progres_tracking_id} type="text" hidden />
                        {(errors && errors.progress_tracking_id) && errors.progress_tracking_id.map((v, i) => <small key={i} className="text-muted text-danger">{v}</small>)}
                        <h5 className="mb-4">{progresData.activity_name}</h5>
                        <label htmlFor="">Edit today's Progress</label>
                        <input name="work_done" className="form-control" type="number" min="1" max="100" value={state.work_done} onChange={handleChange} />
                        {(errors && errors.work_done) && errors.work_done.map((v, i) => <small key={i} className="text-muted text-danger">{v}</small>)}
                    </div>

                    <div className="form-group">
                        {changed && <button className="btn btn-outline-success">Update</button>}
                    </div>
                </form>

            </div>
        </div>
    )
}
const UploadPics = (props) => {
    const { toggles, setToggles, progresData, setprogresData, getData, setMessage, showAlert } = useContext(DPRContext);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({ attachment_type: "DPR", attachment_id: "" });
    // const [dprs, setDprs] = useState([]);
    const [todaysPics, setTodaysPics] = useState([]);
    const [exceptToday, setExceptToday] = useState([]);
    const [picture, setPicture] = useState([]);
    const [del, setDel] = useState({ code: "", id: "", show: false });
    const [confirmPicDel, setConfirmPicDel] = useState(null);
    const Delete = (props) => {
        const close = () => { setConfirmPicDel(null) }
        const handleDelete = () => {
            axios.delete(route("DPR.destroy", { DPR: 1, "request_type": "del_picture", "url": confirmPicDel.url })).then((res) => {
                if (res.status = 200) {
                    if (res.data.errors) {
                        console.log(res.data.errors);
                        setMessage("Validation Errors");
                        showAlert(true);
                    } else {
                        console.log("response", res.data);
                        setMessage("Picture Deleted");
                        showAlert(true);
                        getPictures();
                    }
                }
            });
            close();
        }
        useEffect(() => {
            // console.log(props);
        }, [])
        return (
            <Dialog
                open={props.confirmPicDel ? true : false}
                onClose={close}
            >
                <Box sx={{ p: 4 }}>
                    <Typography variant="h6" textAlign="center">Are you sure?</Typography>
                    <Divider />
                    <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" />}>
                        <Button onClick={handleDelete}>Yes</Button>
                        <Button onClick={close}>NO</Button>
                    </Stack>
                </Box>
            </Dialog>
        )

    }
    const OverAllPics = () => {
        return (
            <ImageList variant="woven" sx={{ width: "100%", maxHeight: 300 }} gap={5}>
                {exceptToday.map((image) => (
                    <ImageListItem key={image.url}>
                        <img
                            src={route("files", { "file": image.url })}
                            alt="projectImage"
                            loading="lazy"
                        />
                        <ImageListItemBar
                            subtitle={dateToDMY(image.created_at)}
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        )
    }
    const TodaysPics = () => {
        return (
            <ImageList sx={{ width: "100%", maxHeight: 300 }} gap={5}>
                {todaysPics.map((image, i) => (
                    <ImageListItem key={image.url}>
                        <img
                            src={route("files", { "file": image.url })}
                            alt="projectImage"
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={i + 1}
                            actionIcon={
                                <IconButton
                                    onClick={() => { setConfirmPicDel(image) }}
                                    sx={{ color: red[500] }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        )
    }
    const AttachPic = (e) => {
        setPicture(picture.concat(e.target.files[0]));
    }
    const closeForm = () => {
        setToggles({ ...toggles, pictureForm: false, menu: false, snakeBar: true });
        setExceptToday([]);
        setPicture([]);
        setTodaysPics([]);
        setState({ attachment_type: "DPR", attachment_id: "" });
        setOpen(false);
    }
    const getPictures = () => {
        axios.get(route("DPR.edit", { "DPR": progresData.id })).then((res) => {
            if (res.status == 200) {
                setTodaysPics(res.data.photos.filter(v => dateTostr(v.created_at) === dateTostr()));
                setExceptToday(res.data.photos.filter(v => dateTostr(v.created_at) !== dateTostr()));
                setState({ ...state, attachment_id: res.data.todayDpr ? res.data.todayDpr.id : "" });

            }
        });
        setOpen(true);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("attachment_type", "DPR");
        formData.append("attachment_id", state.attachment_id);
        picture.forEach((v, i) => {
            formData.append('file[]', v);
        });
        console.log(formData);

        const url = route("attachment.store");
        const header = {
            method: "POST",
            headers: { 'X-CSRF-TOKEN': document.getElementById("token").value },
            body: formData
        }
        const response = fetch(url, header)
            .then((res) => res)
            .then((resObj) => {
                if (resObj.status === 200) {
                    setMessage("Picture(s) Uploaded!");
                    showAlert(true);
                    setPicture([]);
                    getPictures();
                    // closeForm();
                }

            }
            )
            .catch((err) => { console.log(err) });
    }
    useEffect(() => {
        if (toggles.pictureForm) {
            getPictures()
        }
        if (toggles.pictureForm == false) { setOpen(false); }
    }, [toggles.pictureForm])
    return (

        <Dialog
            open={open}
            component={Paper}
            onClose={closeForm}
        >
            <Box sx={{ p: 4, bgcolor: grey[200] }} boxSizing="border-box">
                <i className="fa fa-close" style={closeBtn} onClick={closeForm}></i>
                <Delete confirmPicDel={confirmPicDel} setConfirmPicDel={setConfirmPicDel} />
                <Typography variant="h5">Attach Pictures</Typography>
                <Box component="div" border={1} sx={{ p: 1 }}>
                    <Typography variant="body1">Pictures Except Today</Typography>
                    <OverAllPics />
                </Box>
                <Divider />
                <Box border={1} sx={{ p: 1 }}>
                    <Typography variant="body1">Upload / Delete Today's Pictures</Typography>
                    <TodaysPics />
                </Box>
                <Box sx={{ mt: 2 }}>
                    {
                        state.attachment_id &&
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            onChange={AttachPic}
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload Picture(s)
                            <input type="file" className="d-none" />
                        </Button>

                    }
                    {picture.length > 0 &&
                        <Button
                            sx={{ mx: 2 }}
                            variant="outlined"
                            onClick={handleSubmit}
                        >UPLOAD</Button>
                    }
                </Box>
            </Box>
        </Dialog>
    )
}
const SingleProject = () => {
    const { id } = useParams();
    // const id = 256;
    const [refresh, setRefresh] = useState(false);
    const [state, setState] = useState([]);
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [errors, setErrors] = useState({});
    const { index, setIndex, getData, toggles, setToggles, setprogresData, allData, showAlert, setMessage } = useContext(DPRContext);
    const handleMenu = (props) => {
        setToggles((prv) => { return { ...prv, menu: true } });
        setprogresData(props);
    }
    useEffect(() => {
        console.log("single Called");
        setRefresh(false);
        getData(id, from, to).then(res => {
            if (res.errors) {
                setErrors(res.errors);
                setMessage("Validation Errors");
                showAlert(true);
                console.log(res);
            }
            else {
                setIndex(allData(res, res));
                setErrors({});
                setMessage("Data retrived!");
                showAlert(true);
                console.log(res);
            }
        });
    }, [refresh]);
    const Row = React.memo((props) => {
        return (
            props.data.map((v, i) => {
                console.log("row component rendered");
                return (
                    <React.Fragment key={v.id}>
                        <TableRow sx={{ backgroundColor: v.type == "milestone" ? lightGreen[400] : "" }}>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}><Typography variant="body2">{v.activity_id}</Typography></TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}><Typography variant="body2">{v.activity_name}</Typography></TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}>
                                <Stack>
                                    <Typography variant="body2">{v.start}</Typography>
                                    <Divider />
                                    <Typography variant="body2">{v.finish}</Typography>
                                </Stack>
                            </TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}><Typography variant="body2">{v["total_days_req"]}</Typography></TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}><Typography variant="body2">{v.budget}</Typography></TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}><Typography variant="body2">{v["planedBudget"]}</Typography></TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}><Typography variant="body2"><a href=""> {v.totalWrokDone} % </a></Typography></TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}><Typography variant="body2">{v.wdAmount}</Typography></TableCell>
                            <TableCell sx={{ backgroundColor: v.lag > 0 ? red[400] : "", border: 1, borderColor: grey[700] }}><Typography variant="body2">{v.lag} %</Typography></TableCell>
                            <TableCell sx={{ border: 1, borderColor: grey[700] }}>{
                                v.type === "activity" &&
                                <Button
                                    variant="contained"
                                    onClick={() => { handleMenu(v) }}>
                                    <BrowserUpdatedIcon />
                                </Button>
                            }
                            </TableCell>
                        </TableRow>
                        {v.childs.length > 0 && <Row data={v.childs} />}
                    </React.Fragment>
                    // </div>
                )

            }
            )
        )

    })
    return (
        <>
            <UploadPics />
            <Stack direction="row" sx={{ alignItems: "center" }}>
                <TextField
                    label="From"
                    type="date"
                    margin="normal"
                    name="from"
                    size="small"
                    value={from ?? ""}
                    onChange={(e) => { setFrom(e.target.value) }}
                    error={(errors.from && errors.from.length > 0) ? true : false}
                    helperText={(errors.from && errors.from.length > 0) && errors.from.map(e => e)}
                />
                <TextField
                    label="To"
                    type="date"
                    margin="normal"
                    name="to"
                    size="small"
                    value={to ?? ''}
                    onChange={(e) => { setTo(e.target.value) }}
                    error={(errors.to && errors.to.length > 0) ? true : false}
                    helperText={(errors.to && errors.to.length > 0) && errors.to.map(e => e)}
                />
                <Button
                    children="Update"
                    variant="contained"
                    color="success"
                    onClick={() => { setRefresh(true) }}
                    size="medium"
                    sx={{ m: 1 }}
                />
            </Stack>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: amber[100] }}>
                            <TableCell colSpan={2} sx={{ border: 2, borderColor: grey[400] }}><Typography align="center">Activty/Milestone</Typography></TableCell>
                            <TableCell colSpan={5} sx={{ border: 2, borderColor: grey[400] }}><Typography align="center">Planned</Typography></TableCell>
                            <TableCell colSpan={4} sx={{ border: 2, borderColor: grey[400] }}><Typography align="center">Achieved</Typography></TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: amber[100] }}>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>ID</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>Name</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>Start/Finish</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>Duration</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>Total Value</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>Planned</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>%Achieved</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>Achieved Value</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>Lag</Typography></TableCell>
                            <TableCell sx={{ border: 2, borderColor: grey[400] }}><Typography>Action</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Row data={index} />
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
const AllProjects = () => {
    const { projects, setProjects, summarizeData, getData } = useContext(DPRContext);
    const [state, setState] = useState([]);
    const [totals, setTotals] = useState({ gTotalValue: 0, gPlanedValue: 0, gAchieved: 0, totalPec: 0, totalLag: 0 });
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const Totals = () => {
        const a = (parseInt(state.reduce((t, v) => { return t + v.budget; }, 0)) / 1000000).toFixed(2);
        const b = (parseInt(state.reduce((t, v) => { return t + v["planedBudget"]; }, 0)) / 1000000).toFixed(2);
        const c = (parseInt(state.reduce((t, v) => { return t + v.wdAmount; }, 0)) / 1000000).toFixed(2);
        setTotals({ gTotalValue: a, gPlanedValue: b, gAchieved: c, totalPec: ((c / a) * 100).toFixed(2), totalLag: ((b - c) / a * 100).toFixed(2) });

    }
    const handleUpdate = () => {
        const UpdateState = projects.map(async (v, i) => {
            return await getData(v.project_id, from, to).then(res => summarizeData(res, res)[0]);
        });
        Promise.all(UpdateState).then(result => setState(result));
    }
    useEffect(() => {
        Promise.all(
            projects.map(async (v, i) => {
                return await getData(v.project_id, from, to).then(res => summarizeData(res, res)[0]);
            })
        ).then(result => setState(result));
    }, [projects]);
    useEffect(() => { Totals() }, [state]);
    const style = {
        fontSize: "1rem",
    }
    return (
        // <Paper sx={{ width: '100%' }}>
        <TableContainer>
            <Loader />
            <Box spacing={4} marginBottom={1}>
                <TextField name="from" value={from} onChange={(e) => { setFrom(e.target.value) }} type="date" size="small" />
                <TextField name="to" value={to} onChange={(e) => { setTo(e.target.value) }} type="date" size="small" />
                <Button onClick={handleUpdate} variant="contained" sx={{ marginX: 1 }}>Update</Button>
            </Box>
            <Table>
                <TableHead sx={{ background: indigo[200] }}>
                    <TableRow>
                        <TableCell>Project</TableCell>
                        <TableCell>Start</TableCell>
                        <TableCell>Finish</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Planned</TableCell>
                        <TableCell>%Ach</TableCell>
                        <TableCell>Ach (RS)</TableCell>
                        <TableCell>Lag</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.map((v, i) => {
                        return (
                            <TableRow key={i}>
                                <TableCell><Typography variant="body2">{v.project.name}</Typography></TableCell>
                                <TableCell ><Typography variant="body2">{v.start}</Typography></TableCell>
                                <TableCell ><Typography variant="body2">{v.finish}</Typography></TableCell>
                                <TableCell ><Typography variant="body2">{v["total_days_req"]}</Typography></TableCell>
                                <TableCell ><Typography variant="body2">{v.budget}</Typography></TableCell>
                                <TableCell ><Typography variant="body2">{v["planedBudget"]}</Typography></TableCell>
                                <TableCell ><Typography variant="h6"><a href=""> {v.totalWrokDone} % </a></Typography></TableCell>
                                <TableCell ><Typography variant="body2">{v.wdAmount}</Typography></TableCell>
                                <TableCell ><Typography color={v.lag > 0 ? red[500] : green[500]} variant="h6">{v.lag} %</Typography></TableCell>
                                <TableCell>
                                    <Link to={`project/${v.project_id}`}>
                                        <Button variant="outlined" endIcon={<VisibilityIcon />}>Detail</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        )
                    }
                    )}
                </TableBody>
                <TableFooter sx={{ background: amber[800] }}>
                    <TableRow>
                        <TableCell colSpan={4}><Typography variant="subtitle2">Total</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">{totals.gTotalValue}(M)</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">{totals.gPlanedValue}(M)</Typography></TableCell>
                        <TableCell><Typography variant="h6">{totals.totalPec}%</Typography></TableCell>
                        <TableCell><Typography variant="subtitle2">{totals.gAchieved}(M)</Typography></TableCell>
                        <TableCell><Typography variant="h6">{totals.totalLag}%</Typography></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
        // </Paper>
    )

}
export {
    AllProjects,
    SingleProject,
    ProjectSelector,
    SnakeBar,
    Menu,
    CreateDPR,
    EditDPR,
    UploadPics
};

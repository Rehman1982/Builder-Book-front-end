const React = React;
const { useState, useEffect, useRef, createContext, useContext } = React;
const DRPContext = createContext();
const closeBtn = {
    position: "absolute",
    top: "0",
    right: "0",
    padding: "10px",
    cursor: "pointer",
    fontSize: "1.2rem"
}
const dateTostr = (date = null) => {
    // let dt = null;
    if (date == null) {
        let dt = new Date();
        return `${dt.getDate()}${dt.getMonth()}${dt.getFullYear()}`;
    } else {
        let dt = new Date(date);
        return `${dt.getDate()}${dt.getMonth()}${dt.getFullYear()}`;
    }
}
//------------------------------ Context Api---------------------------------------
const DRP = () => {
    const [projects, setProjects] = useState([]); // all projects
    const [selectedProject, setSelectedProject] = useState({ id: "" });
    const [index, setIndex] = useState([]);
    const [progresData, setprogresData] = useState({});
    const [toggles, setToggles] = useState({ createForm: false, editForm: false, pictureForm: false, snakeBar: false });
    const [message, setMessage] = useState("snake bar testing");
    const partials = {
        DiffInDays_dates: (Max, Min) => {
            let Minn = new Date(Min);
            let Maxx = new Date(Max);
            if (Minn > Maxx) {
                return 0;
            } else {
                let a = new Date(`${Maxx.getFullYear()}-${Maxx.getMonth()}-${Maxx.getDate()}`);
                let b = new Date(`${Minn.getFullYear()}-${Minn.getMonth()}-${Minn.getDate()}`);
                return Math.round((a - b) / 86400000) + 1;
            }
        },
        MinDate: (data, startVal) => {

            const resp = data.reduce((acc, item) => {
                if (acc.start !== null) {
                    if (new Date(item.start) < new Date(acc.start)) {
                        acc.start = item.start;
                    }
                } else {
                    acc.start = item.start;
                }
                return acc;

            }, { start: startVal });
            return resp.start;
        },
        MaxDate: (data, startVal) => {
            const resp = data.reduce((acc, item) => {
                if (acc.finish !== null) {
                    if (new Date(item.finish) > new Date(acc.finish)) {
                        acc.finish = item.finish;
                    }
                } else {
                    acc.finish = item.finish;
                }
                return acc;

            }, { finish: startVal });
            return resp.finish;
        }
    }
    const updateProgressData = () => {
        const idx = index.findIndex((val) => { return val.id == progresData.id });
        setprogresData(index[idx]);
        console.log(progresData);
    }
    const getProjects = () => {
        const url = route("DPR.index", { "type": "projects" });
        fetch(url).then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setProjects(data.data.projects);
                    // setIndex(data.data.index);
                }
            })
            .catch((error) => { console.log(error) });
    }
    const getData = (project_id) => {
        const url = route("DPR.index", { "type": "data", "project_id": project_id });
        fetch(url).then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // setProjects(data.data.projects);
                    setIndex(data.data.index);
                }
            })
            .catch((error) => { console.log(error) });
    }
    const store = async (data) => {
        const url = route("DPR.store");
        const header = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRF-TOKEN': document.getElementById("token").value
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, header).then((res) => res.json()).then((data) => data).catch((err) => { console.log(err) });
        return response;
    }
    const update = async (data) => {
        const url = route("DPR.update", { "DPR": "1" });
        const header = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'X-CSRF-TOKEN': document.getElementById("token").value
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, header)
            .then((res) => res.json())
            .then((data) => data)
            .catch((err) => { console.log(err) });
        return response;
    }
    const del = () => { }
    useEffect(() => {
        getProjects();
    }, []);
    return (
        <DRPContext.Provider value={{
            index, update,
            projects, selectedProject, setSelectedProject,
            getData, store, update, del,
            progresData, setprogresData, updateProgressData,
            toggles, setToggles,
            message, setMessage,
            partials
        }}>
            <SnakeBar />
            <CreateDPR />
            <UploadPics />
            <ProjectSelector />
            <Index />
        </DRPContext.Provider>
    )
}
//-----------------------------Components-----------------------------------------
const ProjectSelector = () => {
    const { projects, selectedProject, setSelectedProject, getData } = useContext(DRPContext);
    const handleChange = (e) => {
        setSelectedProject({ id: e.target.value });
        getData(e.target.value);
    }
    return (
        <div className=" col-4 mb-2">
            <select className="form-control" onChange={handleChange}>
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
    const { toggles, setToggles, message } = useContext(DRPContext);
    const [toggle, setToggle] = useState("-50vh");
    useEffect(() => {
        if (toggles.snakeBar) {
            setToggle("10vh");
            const Timer = setTimeout(() => { setToggle("-50vh"); setToggles({ ...toggles, snakeBar: false }); }, 2500);
        }
    }, [toggles.snakeBar])
    const style = {
        container: {
            position: "fixed",
            top: toggle,
            right: "2%",
            zIndex: "2000",
            padding: "20px",
            backgroundColor: "#4cb600",
            color: "white",
            transition: "all 0.5s ease-in-out",
            borderRadius: "8px"
        }
    }
    return (
        <div className="col-12 col-md-4" style={style.container}>
            <div>
                <i className="fa fa-close" style={closeBtn}></i>
                {message}
            </div>
        </div>
    )
}
const Menu = (props) => {
    const { toggles, setToggles, setprogresData } = useContext(DRPContext);
    const [toggle, setToggle] = useState("-50vh");
    const showMenu = () => {
        setToggle("50vh");
    }
    const hideMenu = () => {
        setToggle("-50vh");
    }
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
            <button className="btn btn-light my-0 border" onClick={() => { showMenu(); }}> <i className="fa fa-bars"></i></button>
            <div className="p-2 bg-warning rounded" style={style}>
                <i className="fa fa-close" style={closeBtn} onClick={hideMenu}></i>
                <h4 className="mt-4 mb-2 text-center">Menu</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <button className="btn btn-info btn-block" onClick={() => { setprogresData(props.data); setToggles({ ...toggles, createForm: true }) }}>Update Progress</button>
                    </li>
                    <li className="list-group-item">
                        <button className="btn btn-info btn-block" onClick={() => { setprogresData(props.data); setToggles({ ...toggles, pictureForm: true }) }}>Upload Photos</button>
                    </li>
                </ul>
            </div>
        </div>
    )
}
const CreateDPR = () => {
    const { store, selectedProject, getData, progresData, toggles, setToggles } = useContext(DRPContext);
    const [toggle, setToggle] = useState("-50vh");
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
                getData(selectedProject.id);
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
        setToggles({ ...toggles, createForm: false });
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
    )
}
const EditDPR = () => {
    const { update, getData, progresData, toggles, setToggles } = useContext(DRPContext);
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
const UploadPics = () => {
    const { toggles, setToggles, setMessage, progresData,getData,updateProgressData,selectedProject } = useContext(DRPContext);
    const [toggle, setToggle] = useState("-50vh");
    const [state, setState] = useState({ attachment_type: "DPR", attachment_id: "" });
    const [todaysPics, setTodaysPics] = useState([]);
    const [exceptToday, setExceptToday] = useState([]);
    const [picture, setPicture] = useState([]);
    const [del, setDel] = useState({ code: "", id: "", show: false });
    const Delete = (props) => {
        const [state, setState] = useState({ id: props.data.id, code: "" });
        const [display, setDisplay] = useState("none");
        const showDelForm = () => {
            setDisplay("block");
        }
        const style = {
            position: "absolute",
            top: "0",
            left: "0",
            zIndex: "1000",
            display: display,
            transition: "all 0.5s ease-in-out"
        }
        return (
            <div className="">
                <button className="btn btn-sm btn-outline-danger" type="button" onClick={showDelForm}><i className="fa fa-trash"></i></button>
                <form id="dpform" style={style}>
                    <div className="form-group d-flex">
                        <input className="form-control w-100" type="number" defaultValue={state.id} placeholder="Enter signatory Code " />
                        <button>Delete</button>
                    </div>
                </form>
            </div>
        )
    }
    const OverAllPics = () => {
        return (
            <div className="col-12 row border p-2">
                {exceptToday.map((v, i) => {
                    return (
                        <div key={i} className="col p-1">
                            <a href={route("files", { "file": v.url })} target="_blank"><i className="fa fa-file fa-3x"></i></a>
                        </div>
                    )
                })}
            </div>
        )
    }
    const AttachPic = (e) => {
        setPicture(picture.concat(e.target.files[0]));
    }
    const closeForm = () => {
        setToggles({ ...toggles, pictureForm: false });
        setExceptToday([]);
        setPicture([]);
        setTodaysPics([]);
        setState({ attachment_type: "DPR", attachment_id: "" });
        setToggle("-50vh");
    }
    const getPictures = () => {
        const { dpr } = progresData;
        console.log(dpr);
        dpr.forEach((dpr, i) => {
            if (dateTostr(dpr.created_at) === dateTostr()) {
                setState({ ...state, attachment_id: dpr.id });
                dpr.photos ? setTodaysPics(dpr.photos.urls) : "";
            } else {
                dpr.photos ? setExceptToday(dpr.photos.urls) : "";
            }
        });
        setToggle("50vh");
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("attachment_type", "DPR");
        formData.append("attachment_id", state.attachment_id);
        picture.forEach((v, i) => {
            formData.append('file[]', v);
        });
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
                    setMessage("Picture Uploaded");
                    setToggles({ ...toggles, snakeBar: true });
                    getData(selectedProject.id);
                    updateProgressData();
                    getPictures();
                    closeForm();
                }

            }
            )
            .catch((err) => { console.log(err) });
    }
    useEffect(() => {
        if (toggles.pictureForm) {
            console.log(progresData);
            getPictures();
        }
    }, [toggles.pictureForm])
    const style = {
        position: "fixed",
        top: toggle,
        left: "50%",
        transform: "translate(-50%,-50%)",
        transition: "all 0.5s",
        zIndex: "1000"
    }
    return (
        <div className="col-6 bg-warning p-4" style={style}>
            <i className="fa fa-close" style={closeBtn} onClick={closeForm}></i>
            <h5 className="mb-3">Attach Pictures</h5>
            <hr />
            <h6>OverAll Pictures Except Today (<small>Delete Not Allowed</small>)</h6>
            <div className="form-group">
                <OverAllPics />
            </div>
            <h6>Upload / Delete Today's Pictures</h6>
            <form onSubmit={handleSubmit}>
                <div className="form-group row">
                    <div className="row col-8 p-2 border">
                        {
                            todaysPics.map((v, i) => {
                                return (
                                    <div key={i} className="p-1 text-center">
                                        <a href={route("files", { "file": v.url })}><i className="fa fa-file fa-3x"></i></a><br />
                                        {/* <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => { handleDelete(v) }}><i className="fa fa-trash"></i></button> */}
                                        <Delete data={v} />
                                    </div>
                                )

                            })
                        }
                        {
                            picture.map((v, i) => {
                                return (
                                    <div key={i} className="p-1">
                                        <i className="fa fa-file fa-3x"></i><br />
                                        <div className="text-center"><small><i className="fa fa-trash"></i></small></div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        state.attachment_id &&
                        <div className="col-4 text-center p-2">
                            <label className="btn btn-block btn-info m-0 p-2 mb-2" onChange={AttachPic}>
                                <i className="fa fa-upload fa-2x" role="button"></i>
                                <input type="file" hidden />
                            </label>
                            <input placeholder="picture title" className="form-control" type="text" name="title" />
                        </div>
                    }
                </div>
                <div className="form-group">
                    {picture.length > 0 &&
                        <button className="btn btn-light">UPLOAD</button>
                    }
                </div>
            </form>
        </div>
    )
}
const Index = () => {
    const [state, setState] = useState();
    // const [destate, setDefstate] = useState();
    const [newdata, setNewData] = useState([]);
    const { index, partials } = useContext(DRPContext);
    const sumWrokDone = (dpr) => {
        if (dpr.length > 0) {
            return dpr.reduce((total, current) => total + parseInt(current.work_done), 0);
        } else {
            return 0;
        }
    }
    useEffect(() => {
        // setDefstate(index);
        setNewData(check(index));
    }, [index]);
    const check = (data, id = null) => {
        let d = data.map((v, i) => {
            if (v.parent_id == id) {
                let data = check(index, v.id);
                // Planed
                v.start = partials.MinDate(data, v.start);
                v.finish = partials.MaxDate(data, v.finish);
                v.budget = data.reduce((acc, item) => acc + parseInt(item.budget), parseInt(v.budget));
                // Achieved
                v["totalWrokDone"] = sumWrokDone(v.dpr);
                v["wdAmount"] = parseInt(v.budget * v["totalWrokDone"] / 100);
                v.wdAmount = data.reduce((acc, item) => acc + parseInt(item.wdAmount), parseInt(v.wdAmount));
                v["childs"] = data;
                v.budget > 0 ? v["totalWrokDone"] = parseInt(v.wdAmount / v.budget * 100) : "";
                // let LagOrLead
                // suppose
                //total days = 14;
                //total budget = 5000;

                // finsh -  start;
                let total_days_req = partials.DiffInDays_dates(v.finish, v.start);
                v["total_days_req"] = total_days_req;
                let per_day_planed_budget = v.budget / total_days_req; // 357 Per day
                // today - start = 5;
                let Today = new Date() > new Date(v.finish) ? new Date(v.finish) : new Date();
                let days_elapsed = partials.DiffInDays_dates(Today, v.start);
                let planed_value_todate = Math.round(parseInt(per_day_planed_budget * days_elapsed)); // 1785
                v["planedBudget"] = planed_value_todate;

                // Lag  will considered lead if the is negative
                // planed_value_todate- DPR total
                let Budget = v.budget == 0 ? 1 : v.budget;
                v["lag"] = Math.round(parseInt(planed_value_todate - v.wdAmount) / Budget * 100);





                return v;
            }
        });
        return d.filter(a => a !== undefined);
    }
    const Row = (props) => {
        const style = {
            fontSize: "0.9rem",
        }
        return (
            props.data.map((v, i) => {
                return (
                    <div key={i} style={style}>
                        <div className={v.type == "milestone" ? "row no-gutters bg-success border-bottom" : "row no-gutters border-bottom"}>
                            <div className="col-3 d-flex ">
                                <div className="col-4 border-right py-1">{v.activity_id}</div>
                                <div className="col-8 border-right border-right py-1">{v.activity_name}</div>
                            </div>
                            <div className="col-5 d-flex text-center">
                                <div className="col border-right py-1">{v.start}</div>
                                <div className="col border-right py-1">{v.finish}</div>
                                <div className="col border-right py-1">{v["total_days_req"]}</div>
                                <div className="col border-right py-1">{v.budget}</div>
                                <div className="col border-right py-1">{v["planedBudget"]}</div>
                            </div>
                            <div className="col-4 d-flex">
                                <div className="col-3 border-right py-1"><a href=""> {v.totalWrokDone} % </a></div>
                                <div className="col-4 border-right py-1">{v.wdAmount}</div>
                                <div className={v.lag > 0 ? "col-3 border-right py-1 bg-danger" : "col-3 border-right bg py-1"}>{v.lag} %</div>
                                <div className="col-2 border-right text-right py-1">{
                                    v.type == "activity" && <span>
                                        <Menu key={i} data={v} />
                                    </span>
                                }</div>
                            </div>
                        </div>
                        {v.childs.length > 0 && <Row data={v.childs} />}
                    </div>
                )

            }
            )
        )

    }
    return (
        <div className="container-fluid">
            {/* <button onClick={() => { setNewData(check(index)) }}>Check</button> */}
            <div className="row no-gutters text-center bg-info">
                <div className="col-3 border py-1">Activity / Milestone</div>
                <div className="col-5 border py-1">Planned</div>
                <div className="col-4 border py-1">Achieved</div>
            </div>
            <div className="row no-gutters mb-1 text-warning bg-primary">
                <div className="col-3 d-flex text-center">
                    <div className="col-4 border py-1">ID</div>
                    <div className="col-8 border py-1">Name</div>
                </div>
                <div className="col-5 d-flex text-center">
                    <div className="col border py-1">Start</div>
                    <div className="col border py-1">Finish</div>
                    <div className="col border py-1">Duration</div>
                    <div className="col border py-1">Total Value</div>
                    <div className="col border py-1">Planned Value</div>
                </div>
                <div className="col-4 d-flex text-center">
                    <div className="col-3 border py-1">Ach %</div>
                    <div className="col-4 border py-1">Ach Value</div>
                    <div className="col-3 border py-1">Lag</div>
                    <div className="col-2 border py-1"></div>
                </div>
            </div>
            <Row data={newdata} />
        </div>
    )
}
//-----------------------------End Components-----------------------------------------


//----------------------------- Rendr DOM --------------------------------------------
const root = ReactDOM.createRoot(document.getElementById('container'));
root.render(
    <DRP />
);

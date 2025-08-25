const React = React;

const { useState, useRef, useEffect, createContext, useContext } = React;
const IsoForms = createContext();
const closeBtn = {
    position: "absolute",
    top: "0",
    right: "0",
    padding: "10px",
    cursor: "pointer",
    fontSize: "1.2rem"
}
const Index = (props) => {
    const [state, setState] = useState([]);
    const [procedureEdit, setProcedureEdit] = useState({});
    const [procedureDel, setProcedureDel] = useState({ procedure_id: "" });
    const [form, setForm] = useState({ procedure_id: "" });
    const [editform, setEditForm] = useState({});
    const [deleteform, setDeleteForm] = useState({ id: "" });
    const [uploadForm, setUploadForm] = useState({ id: "" });
    const [attachment, setAttachment] = useState([]);
    const getData = () => {
        let url = route("isoForms.index", { "type": "data" });
        fetch(url).then((res) => res.json()).then((data) => {
            if (data.success) {
                setState(data.data);
            } else {
                console.log(data.errors)
            }
        });
    }
    const createProcedure = async (data) => {
        const url = route("isoForms.store");
        const header = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'X-CSRF-TOKEN': document.getElementById("token").value
            },
            body: JSON.stringify(data)
        }
        const response = await fetch(url, header).then(res => res.json()).then(data);
        response.success && getData();
        return response;
    }
    const updateProcedure = async (data) => {
        const url = route("isoForms.update", { "isoForm": 1 });
        const headers = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                'X-CSRF-TOKEN': document.getElementById("token").value
            },
            body: JSON.stringify(data)
        }
        try {
            const resp = await fetch(url, headers).then((res) => res.json()).then((data) => data);
            getData();
            return resp;
        } catch (error) {
            console.log(error)
        }

    }
    const deleteProcedure = async (data) => {
        const url = route("isoForms.destroy", { "isoForm": 1 })
        const header = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'X-CSRF-TOKEN': document.getElementById("token").value
            },
            body: JSON.stringify(data)
        }
        const del = await fetch(url, header).then(res => res.json()).then(data => data);
        del.success && getData();
        return del;
    }
    useEffect(() => { getData(); }, []);
    return (
        <IsoForms.Provider value=
            {
                {
                    state, setState, getData,
                    createProcedure, procedureEdit, setProcedureEdit, updateProcedure, procedureDel, setProcedureDel, deleteProcedure,
                    form, setForm, editform, setEditForm, deleteform, setDeleteForm,
                    uploadForm, setUploadForm,
                    attachment, setAttachment
                }
            }
        >
            <FilesUpload />
            <ViewAttachments />
            <EditProcedure />
            <DeleteProcedure />
            <CreateProcedureForm />
            <AddisoForm />
            <EditisoForm />
            <DeleteForm />
            <List />
            {props.children}
        </IsoForms.Provider>
    )
}
const List = () => {
    const { state, setForm, } = useContext(IsoForms);
    const Procedures = (props) => {
        const { setProcedureEdit, setProcedureDel } = useContext(IsoForms);
        const [editData, setEditData] = useState(props.data);
        const ThreeDotMenu = () => {
            return (
                <div className="dropdown show">
                    <a className="btn btn-sm border dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fa fa-bars"></i>
                    </a>
                    <div className="dropdown-menu p-2" aria-labelledby="dropdownMenuLink">
                        {/* <button type="button" className="btn btn-primary btn-sm mr-1"><i className="fa fa-download"></i></button> */}
                        <button type="button" className="btn btn-primary btn-sm mr-1" onClick={() => { setProcedureEdit(editData) }}><i className="fa fa-edit"></i></button>
                        <button type="button" className="btn btn-primary btn-sm mr-1" onClick={() => { setProcedureDel({ procedure_id: editData.id }) }}><i className="fa fa-trash"></i></button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => { setForm({ procedure_id: editData.id }) }}>Add Form</button>
                    </div>
                </div>
            )
        }
        return (
            <li key={props.data.id} className="list-group-item">
                <div className="row">
                    <div className="col-8"><a href={"#clps" + props.data.id} data-toggle="collapse">{props.data.name}</a></div>
                    <div className="col-2">{props.data.code}</div>
                    <div className="col-2 text-right">
                        <ThreeDotMenu />
                    </div>
                </div>
                <ul id={"clps" + props.data.id} className="list-group mt-1 collapse">
                    {props.data.iso_forms.map((v, i) => {
                        return (<Forms key={i} data={v} />)
                    })}
                </ul>
            </li>
        )
    }
    const Forms = (props) => {
        console.log(route("files", { "file": props.data.link }));
        const ThreeDotMenu = () => {
            const { setEditForm, setDeleteForm, setUploadForm, setAttachment } = useContext(IsoForms);
            return (
                <div className="dropdown show">
                    <a className="btn btn-sm border dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="fa fa-bars"></i>
                    </a>
                    <div className="dropdown-menu p-2" aria-labelledby="dropdownMenuLink">
                        <ul className="list-group">
                            <label className="list-group-item d-flex justify-content-start">
                                <button type="button" className="btn btn-light border border-dark btn-sm mr-3" onClick={() => { setEditForm(props.data) }}><i className="fa fa-edit"></i></button>
                                <h5>Edit</h5>
                            </label>
                            <label className="list-group-item d-flex justify-content-start">
                                <button type="button" className="btn btn-light border border-dark btn-sm mr-3" onClick={() => { setDeleteForm(props.data) }}><i className="fa fa-trash"></i></button>
                                <h5>Delete</h5>
                            </label>
                            <label className="list-group-item d-flex justify-content-start">
                                <button type="button" className="btn btn-light border border-dark btn-sm mr-3" onClick={() => { setUploadForm({ id: props.data.id }) }}><i className="fa fa-upload"></i></button>
                                <h5>Attach Form</h5>
                            </label>
                            {props.data.attachment.length > 0 &&
                                <label className="list-group-item d-flex justify-content-start">
                                    <button className="btn btn-light border border-dark btn-sm mr-3" onClick={() => setAttachment(props.data.attachment)}><i class="fa fa-file"></i></button>
                                    <h5>View Form(s)</h5>
                                </label>
                            }
                        </ul>
                    </div>
                </div>
            )
        }
        return (
            <li className="list-group-item">
                <div className="row">
                    <div className="col">{props.data.FormName}</div>
                    <div className="col">{props.data.DC}</div>
                    <div className="col text-right">
                        <ThreeDotMenu />
                    </div>
                </div>
            </li>
        )
    }
    return (
        <ul className="list-group">
            <li className="list-group-item font-weight-bold list-group-item-primary">
                <div className="row">
                    <div className="col-8">Procedure</div>
                    <div className="col-2">Code</div>
                    <div className="col-2"></div>
                </div>
            </li>
            {state.map((v, i) => {
                console.log(v);
                return (
                    <Procedures key={i} data={v} />
                )
            })}
        </ul>
    )
}
const EditProcedure = () => {
    const { procedureEdit, setProcedureEdit, updateProcedure } = useContext(IsoForms);
    const [toggle, setToggle] = useState("-50vh");
    const [newData, setNewData] = useState({ type: "procedure" });
    const [changed, setChanged] = useState(false);
    const [errors, setErrors] = useState({ name: [], code: [] });
    const showForm = () => { setToggle("50vh") }
    const hideForm = () => {
        setToggle("-50vh");
        setNewData({});
        setProcedureEdit({});
        setErrors({ name: [], code: [] });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        updateProcedure(newData).then((response) => {
            if (response.success) {
                setNewData({});
                setToggle("-50vh");
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        });

    }
    const handleChange = (e) => {
        setNewData((prv) => {
            let obj = { ...prv };
            obj[e.target.name] = e.target.value;
            return obj;
        });
        setChanged(true);
    }
    const handleReset = () => {
        setNewData(procedureEdit);
    }
    const Style = {
        position: "fixed",
        zIndex: "1000",
        top: toggle,
        left: "50%",
        transform: "translate(-50%,-50%)",
        transition: "all 0.5s ease-in-out",
        button: {
            position: "absolute",
            top: "0",
            right: "0",
            padding: "10px"
        }
    }
    useEffect(() => {
        if (procedureEdit.name) {
            setNewData({ type: "procedure", id: procedureEdit.id, name: procedureEdit.name, code: procedureEdit.code });
            setToggle("50vh");
        }
    }, [procedureEdit]);
    return (
        <div style={Style} className="col-12 col-md-6 p-4 rounded bg-warning">
            <button style={Style.button} className="btn btn-close" onClick={hideForm}><i className="fa fa-close fa-xl"></i></button>
            <h3 className="font-weight-bold">Edit</h3>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Procedure Name</label>
                    <input type="text" name="name" value={newData.name} onChange={handleChange} className="form-control" />
                    {(errors.name && errors.name.length > 0) && errors.name.map((v, i) => <div>{v}</div>)}
                </div>
                <div className="form-group">
                    <label>Procedure Code</label>
                    <input type="text" name="code" value={newData.code} onChange={handleChange} className="form-control" />
                    {(errors.code && errors.code.length > 0) && errors.code.map((v, i) => <div>{v}</div>)}
                </div>
                {changed &&
                    <div className="form-group">
                        <button className="btn btn-outline-success mr-2">Submit</button>
                        <button type="button" className="btn btn-outline-danger" onClick={handleReset}>Reset</button>
                    </div>
                }
            </form>
        </div>
    )
}
const DeleteProcedure = () => {
    const [changed, setChanged] = useState(false);
    const [state, setState] = useState({ type: "procedure", id: "", code: "" });
    const [toggleForm, setToggleForm] = useState("-50vh");
    const [errors, setErrors] = useState({ code: [] });
    const { procedureDel, deleteProcedure } = useContext(IsoForms);
    const handleSubmit = (e) => {
        e.preventDefault();
        deleteProcedure(state).then((response) => {
            console.log(response);
            if (response.success) {
                closeForm();
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        });

    }
    const closeForm = () => {
        setErrors({ code: [] });
        setState({ id: "", code: "" });
        setToggleForm("-50vh");
    }
    useEffect(() => {
        if (procedureDel.procedure_id !== "") {
            setState({ ...state, id: procedureDel.procedure_id });
            setToggleForm("50vh");
        }
    }, [procedureDel]);
    const Style = {
        position: "fixed",
        top: toggleForm,
        left: "50%",
        zIndex: "1000",
        transform: "translate(-50%,-50%)",
        transition: "all 1s ease-in-out",
        closeBtn: {
            position: "absolute",
            top: "0",
            right: "0",
            padding: "10px"
        }
    }
    return (
        <div className="col-12 col-md-4 bg-warning p-4 rounded" style={Style}>
            <button style={Style.closeBtn} className="btn btn-sm close-btn float-right" onClick={closeForm}><i className="fa fa-close fa-xl"></i></button>
            <h4>Delete Procedure</h4>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Signatory Code</label>
                    <input type="number" name="sigCode" value={state.code} onChange={e => { setState({ ...state, code: e.target.value }); setChanged(true); }}
                        length="4" id="" className="form-control" required />
                    {errors.code.length > 0 &&
                        <div className="text-danger">
                            {errors.code.map((v, i) => {
                                return (<span className="d-block">{v}</span>)
                            })}
                        </div>
                    }
                </div>
                {changed &&

                    <div className="form-group">
                        <button className="btn btn-outline-danger">Submit</button>
                    </div>
                }

            </form>
        </div>
    )
}
const CreateProcedureForm = () => {
    const { createProcedure } = useContext(IsoForms);
    const ref = useRef();
    const [toggle, setToggle] = useState("-50vh");
    const [state, setState] = useState({ type: "procedure", name: "", code: "" });
    const [errors, setErrors] = useState({});
    const [changed, setChanged] = useState(false);
    const toggleForm = () => {
        if (toggle == "-50vh") {
            setToggle("50vh");
            ref.current.innerHTML = 'Close Form';
        } else {
            setToggle("-50vh");
            ref.current.innerHTML = `Create Procedure`;
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        // createProcedure(state);
        createProcedure(state).then((response) => {
            if (response.success) {
                setState({ type: "procedure", name: "", code: "" });
                setErrors({});
                toggleForm();
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        });
    }
    const handleChange = (e) => {
        setState((prv) => {
            let obj = { ...prv };
            obj[e.target.name] = e.target.value;
            return obj;
        });
        setChanged(true);
    }
    const handleReset = () => {
        setState({ name: "", code: "" })
    }
    const Style = {
        position: "fixed",
        zIndex: "1000",
        top: toggle,
        left: "50%",
        transform: "translate(-50%,-50%)",
        transition: "all 0.5s ease-in-out"
    }
    useEffect(() => {

    }, []);
    return (
        <div>
            <button ref={ref} className="btn btn-outline-success mb-1" onClick={toggleForm}>Create Procedure</button>
            <div style={Style} className="col-12 col-md-6 p-4 rounded bg-warning">
                <h4 className="text-center">Create Procedure</h4>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Procedure Name</label>
                        <input type="text" name="name" value={state.name} onChange={handleChange} className="form-control" />
                        {(errors.name && errors.name.length > 0) && errors.name.map((v, i) => <div>{v}</div>)}
                    </div>
                    <div className="form-group">
                        <label>Procedure Code</label>
                        <input type="text" name="code" value={state.code} onChange={handleChange} className="form-control" />
                        {(errors.code && errors.code.length > 0) && errors.code.map((v, i) => <div>{v}</div>)}
                    </div>
                    {changed &&
                        <div className="form-group">
                            <button className="btn btn-outline-success mr-2">Submit</button>
                            <button type="button" className="btn btn-outline-danger" onClick={handleReset}>Reset</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}
const FilesUpload = () => {
    const { uploadForm, setUploadForm, getData } = useContext(IsoForms);
    const [files, setFiles] = useState(null);
    const [id, setId] = useState(null);
    const [isShow, setShow] = useState("-50vh");
    const [errors, setErrors] = useState({});
    const showForm = () => {
        setShow("50vh");
        setUploadForm({ id: "" });
    }
    const hideForm = () => {
        setShow("-50vh");
        setFiles(null);

    }
    const handleFiles = (e) => {
        setFiles(e.target.files[0]);
        console.log(e.target.files[0]);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", id);
        formData.append("file", files);
        const url = route("isoFormUpload");
        const header = {
            method: "POST",
            headers: {
                'X-CSRF-TOKEN': document.getElementById("token").value
            },
            body: formData
        }
        const response = await fetch(url, header).then(res => res.json()).then(data => data);
        if (response.success) {
            hideForm();
            getData();
        } else {
            if (response.errors) {
                setErrors(response.errors);
            }
        }
        console.log(response);
    }
    useEffect(() => {
        if (uploadForm.id !== "") {
            showForm();
            setId(uploadForm.id);
        }
    });
    const Style = {
        position: "fixed",
        top: isShow,
        left: "50%",
        zIndex: "1000",
        transform: "translate(-50%,-50%)",
        transition: "all 0.5s ease-in-out"
    }
    return (
        <div className="col-12 col-md-4 border p-4 bg-light shadow-lg" style={Style}>
            <i class="fa fa-close" style={closeBtn} onClick={hideForm}></i>
            <h4 className="text-center">Upload Forms</h4>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label role="button" className="label text-center d-block bg-info p-2 border border-light">
                        <i className="fas fa-file-upload fa-3x"></i>
                        <input type="file" name="file" id="" className="form-control" placeholder="" aria-describedby="helpId" onChange={handleFiles} hidden />
                    </label>
                </div>
                <div className="form-group row no-gutters">
                    {files &&
                        <span className="col-2 border p-2 text-center">
                            <i className="fas fa-file-upload fa-2x"></i><br />
                            <button className="btn btn-sm m-0 p-0" type="button"><i className="fa fa-trash text-info" aria-hidden="true"></i></button>
                        </span>
                    }
                </div>
                <button className="btn btn-outline-success">Upload</button>
            </form>
        </div>
    )
}
const ViewAttachments = () => {
    const { attachment, setAttachment } = useContext(IsoForms);
    const [toggle, setToggle] = useState("-50vh");
    const closeForm = () => {
        setToggle("-50vh");
        setAttachment([]);
    }
    useEffect(() => {
        if (attachment.length > 0) {
            setToggle("50vh");
        }
    }, [attachment])
    const style = {
        position: "fixed",
        top: toggle,
        left: "50%",
        transform: "translate(-50%,-50%)",
        zIndex: "1000",
        transition: "all 0.5s ease-in-out"
    }
    return (
        <div className="col-12 col-md-4 bg-warning shadow-lg p-3" style={style}>
            <i className="fa fa-close" onClick={closeForm} style={closeBtn}></i>
            <h4 className="text-center">View attachment</h4>
            <hr />
            <div className="row no-gutters">
                {attachment.map((v, i) => <div className="col-2 text-center p-2">
                    <div className="m-1 p-2 border border-info">
                        <a href={route("files", { file: v.url })} target="_blank"> <i className="fa fa-file fa-2x"></i></a>
                    </div>
                    <div className="border border-info"><i className="fa fa-trash"></i></div>
                </div>)}
            </div>
        </div>
    )
}
const AddisoForm = () => {
    const { form, setForm, createProcedure } = useContext(IsoForms);
    const [state, setState] = useState({ type: "form", procedure_id: "", form_name: "", dc: "" });
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState("-50vh");
    const hideForm = () => {
        setForm({ procedure_id: "" });
        setState({ type: "form", procedure_id: "", form_name: "", dc: "" });
        setErrors({});
    }
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        createProcedure(state).then((response) => {
            if (response.success) {
                hideForm();
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        });
    }
    useEffect(() => {
        if (form.procedure_id !== "") { setShow("50vh") } else { setShow("-50vh") }
        setState({ ...state, procedure_id: form.procedure_id });
    }, [form]);
    const Style = {
        position: "fixed",
        top: show,
        left: "50%",
        zIndex: "1000",
        transform: "translate(-50%,-50%)",
        transition: "all 0.5s ease-in-out"
    }
    return (
        <div className="col-12 col-md-4 p-4 border bg-light shadow-lg" style={Style}>
            <i className="fa fa-close" style={closeBtn} onClick={hideForm}></i>
            <h4 className="text-center mb-2">Create ISO Form</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Form Name</label>
                    <input type="text" name="form_name" value={state.form_name} onChange={handleChange} className="form-control" placeholder="" aria-describedby="helpId" />
                    {(errors.form_name && errors.form_name.length > 0 && errors.form_name.map((v, i) => <small id="helpId" className="text-muted">{v}</small>))}

                </div>
                <div className="form-group">
                    <label>Document Code</label>
                    <input type="text" name="dc" value={state.dc} onChange={handleChange} className="form-control" placeholder="" aria-describedby="helpId" />
                    {(errors.dc && errors.dc.length > 0 && errors.dc.map((v, i) => <small id="helpId" className="text-muted">{v}</small>))}
                </div>
                <div className="form-group">
                    <button className="btn btn-outline-success">Submit</button>
                </div>
            </form>
        </div>
    )
}
const EditisoForm = () => {
    const { editform, setEditForm, updateProcedure } = useContext(IsoForms);
    const [state, setState] = useState({ type: "form", id: "", form_name: "", dc: "" });
    const [errors, setErrors] = useState({});
    const [show, setShow] = useState("-50vh");
    const hideForm = () => {
        setEditForm({});
        setState({ type: "form", id: "", form_name: "", dc: "" });
        setErrors({});
    }
    const handleChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        updateProcedure(state).then((response) => {
            if (response.success) {
                hideForm();
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        });
    }
    useEffect(() => {
        if (editform.id) { setShow("50vh") } else { setShow("-50vh") }
        setState({ type: "form", id: editform.id, form_name: editform.FormName, dc: editform.DC });
    }, [editform]);
    const Style = {
        position: "fixed",
        top: show,
        left: "50%",
        zIndex: "1000",
        transform: "translate(-50%,-50%)",
        transition: "all 0.5s ease-in-out"
    }
    return (
        <div className="col-12 col-md-4 p-4 border bg-light shadow-lg" style={Style}>
            <i className="fa fa-close" style={closeBtn} onClick={hideForm}></i>
            <h4 className="text-center mb-2">Edit ISO Form</h4>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Form Name</label>
                    <input type="text" name="form_name" value={state.form_name} onChange={handleChange} className="form-control" placeholder="" aria-describedby="helpId" />
                    {(errors.form_name && errors.form_name.length > 0 && errors.form_name.map((v, i) => <small id="helpId" className="text-muted">{v}</small>))}

                </div>
                <div className="form-group">
                    <label>Document Code</label>
                    <input type="text" name="dc" value={state.dc} onChange={handleChange} className="form-control" placeholder="" aria-describedby="helpId" />
                    {(errors.dc && errors.dc.length > 0 && errors.dc.map((v, i) => <small id="helpId" className="text-muted">{v}</small>))}
                </div>
                <div className="form-group">
                    <button className="btn btn-outline-success">Submit</button>
                </div>
            </form>
        </div>
    )
}
const DeleteForm = () => {
    const { deleteform, setEditForm, deleteProcedure } = useContext(IsoForms);
    const [changed, setChanged] = useState(false);
    const [state, setState] = useState({ type: "form", id: "", code: "" });
    const [toggleForm, setToggleForm] = useState("-50vh");
    const [errors, setErrors] = useState({ code: [] });
    const handleSubmit = (e) => {
        e.preventDefault();
        deleteProcedure(state).then((response) => {
            console.log(response);
            if (response.success) {
                closeForm();
            } else {
                if (response.errors) {
                    setErrors(response.errors);
                }
            }
        });

    }
    const closeForm = () => {
        setErrors({ code: [] });
        setState({ id: "", code: "" });
        setToggleForm("-50vh");
    }
    useEffect(() => {
        if (deleteform.id !== "") {
            setState({ ...state, id: deleteform.id });
            setToggleForm("50vh");
        }
    }, [deleteform]);
    const Style = {
        position: "fixed",
        top: toggleForm,
        left: "50%",
        zIndex: "1000",
        transform: "translate(-50%,-50%)",
        transition: "all 1s ease-in-out",
        closeBtn: {
            position: "absolute",
            top: "0",
            right: "0",
            padding: "10px"
        }
    }
    return (
        <div className="col-12 col-md-4 bg-warning p-4 rounded" style={Style}>
            <button style={Style.closeBtn} className="btn btn-sm close-btn float-right" onClick={closeForm}><i className="fa fa-close fa-xl"></i></button>
            <h4>Delete Form</h4>
            <hr />
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Signatory Code</label>
                    <input type="number" name="sigCode" value={state.code} onChange={e => { setState({ ...state, code: e.target.value }); setChanged(true); }}
                        length="4" id="" className="form-control" required />
                    {errors.code.length > 0 &&
                        <div className="text-danger">
                            {errors.code.map((v, i) => {
                                return (<span key={i} className="d-block">{v}</span>)
                            })}
                        </div>
                    }
                </div>
                {changed &&

                    <div className="form-group">
                        <button className="btn btn-outline-danger">Submit</button>
                    </div>
                }

            </form>
        </div>
    )
}
const root = ReactDOM.createRoot(document.getElementById('container'));
root.render(
    <Index />
);

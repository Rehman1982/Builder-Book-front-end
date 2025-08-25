import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Button,
    Paper,
    Grid,
    TableFooter,
    FormControl,
    IconButton
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddIcon from '@mui/icons-material/Add';
import Snackbar from '@mui/material/Snackbar';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import ExcelCSVToJsonConverter from './XLtoJson';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import * as XLSX from 'xlsx';
import axios from 'axios';

const Create = () => {
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const initials = { id: "", project_id: "", activity_id: "", activity_name: "", boq_id: "", start: "", finish: "", budget: "", parent_id: "", type: "" };
    const headers = ["id", "activity_id", "activity_name", "start", "finish", "budget", "parent_id", "type"];
    const [formData, setFormData] = useState([initials]);
    const [errors, setErrors] = useState([]);
    const [bdrop, setBDrop] = useState(false);
    const [showBar, setShowBar] = useState(false);
    const [projects, setProjects] = useState([]);
    const [selectProject, setSelectProject] = useState({});
    const handleChange = (e, index) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData((prv) => {
            const newFormData = [...prv];
            newFormData[index][name] = value;
            return newFormData;
        });
    };
    const handleProjectChange = (e) => {
        console.log(e.target);
        setSelectProject(e.target);
    }
    const AddRow = () => {
        setFormData(formData.concat(initials));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission here
        formData.map((v, i) => v["project_id"] = selectProject.value);
        const url = route("progressTracking.store");
        const apiCall = axios.post(url, formData)
            .then(res => {
                if (res.data.success) {
                    console.log(res.data.data)
                } else {
                    if (res.data.errors) {
                        console.log(res.data)
                    }
                }
            })
            .catch(error => console.log(error));

    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        setBDrop(true)
        reader.onload = (e) => {
            const data = reader.result;
            const workbook = XLSX.read(data, { type: 'binary', cellDates: true });
            const sheetName = workbook.SheetNames[0]; // Assuming only one sheet is present
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            json.map((v, i) => {
                if (v.start !== "NULL") {
                    const SDT = new Date(v.start);
                    v.start = `${SDT.getFullYear()}-${months[SDT.getMonth()]}-${SDT.getDate() < 10 ? "0" + SDT.getDate() : SDT.getDate()}`;
                }
                else if (v.start == "NULL" || v.start == "") { v.start = "" }
                if (v.finish !== "NULL") {
                    const FDT = new Date(v.finish);
                    v.finish = `${FDT.getFullYear()}-${months[FDT.getMonth()]}-${FDT.getDate() < 10 ? "0" + FDT.getDate() : FDT.getDate()}`;
                }
                else if (v.finish == "NULL" || v.finish == "") { v.finish = "" }
                return v;
            });
            console.log(json);
            setFormData(json);
        };
        reader.readAsBinaryString(file);
        setBDrop(false);
    };
    useEffect(() => {
        const projects = axios.get(route("progressTracking.index", { type: "projects" }))
            .then(resp => setProjects(resp.data.data)).catch(error => console.log(error));
    }, [])
    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={bdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar
                open={showBar}
                autoHideDuration={6000}
                // onClose={handleClose}
                message="Note archived"
            // action={action}
            />
            <form onSubmit={handleSubmit}>
                <div className='row no-gutter'>
                    <div className="col">
                        <Select className='form-control'
                            defaultValue={15}
                            onChange={handleProjectChange}
                            name="project_id"
                        >
                            {projects.map((v, i) => {
                                return (<MenuItem key={i} value={v.id}>{v.name}</MenuItem>);
                            })}
                        </Select>
                    </div>
                    <div className="col">
                        {/* <input type="file" onChange={handleFileChange} /> */}
                        <Button
                            component="label"
                            role={undefined}
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadIcon />}
                        >
                            Excel File
                            <label>
                                <input className='d-none' type="file" onChange={handleFileChange} />
                            </label>
                        </Button>
                    </div>
                </div>
                <TableContainer className='' component={Paper} variant='25'>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                {headers.map((v, i) =>
                                    <TableCell height="40" key={i} padding="none" margin="none">{v}</TableCell>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody margin="2">
                            {formData.map((value, index) => (
                                <TableRow key={index}>
                                    <TableCell width="5%" padding="none" margin="none">
                                        <TextField
                                            name="id"
                                            value={value.id}
                                            onChange={() => { handleChange(event, index) }}
                                            error={true}
                                            helperText={"erorr in filed"}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell width="10%" padding="none" margin="none">
                                        <TextField
                                            name="activity_id"
                                            value={value.activity_id}
                                            onChange={() => { handleChange(event, index) }}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell width="30%" padding="none" margin="none">
                                        <TextField
                                            name="activity_name"
                                            value={value.activity_name}
                                            onChange={() => { handleChange(event, index) }}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell padding="none" margin="none">
                                        <TextField
                                            name="start"
                                            type="date"
                                            value={value.start}
                                            onChange={() => { handleChange(event, index) }}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell padding="none" margin="none">
                                        <TextField
                                            name="finish"
                                            type="date"
                                            format="Y/m/d"
                                            value={value.finish}
                                            onChange={() => { handleChange(event, index) }}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell padding="none" margin="none">
                                        <TextField
                                            name="budget"
                                            value={value.budget}
                                            onChange={() => { handleChange(event, index) }}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell width="5%" padding="none" margin="none">
                                        <TextField
                                            name="parent_id"
                                            value={value.parent_id}
                                            onChange={() => { handleChange(event, index) }}
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell padding="none" margin="none">
                                        <TextField
                                            name="type"
                                            value={value.type}
                                            onChange={() => { handleChange(event, index) }}
                                            fullWidth
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>
                                    <Button type="button" variant="contained" color="primary" onClick={AddRow}> <AddIcon /> </Button>
                                </TableCell>
                                <TableCell>
                                    {selectProject.value && <Button type="submit" variant="contained" color="primary" margin="10">Submit</Button>}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </form>
        </div>
    );
};

export default Create;

import React, { useEffect, useState } from 'react'
import { Autocomplete, Avatar, Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField } from '@mui/material'
import { AddCircle, DeleteForeverOutlined } from '@mui/icons-material';
import axios from 'axios';
import { getFullName } from '../../helpers/helpers';

const baseUrl = "payroll.office.approvalStages";
const ApprovalStages = ({ officeId, setOfficeId }) => {
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [state, setState] = useState([{ id: "", stage_order: "", employee: { id: "", firstName: "" } }]);
    const [currentId, setCurrentId] = useState(null);
    const addnew = () => {
        setState([...state, { id: "", stage_order: "", employee: { id: "", firstName: "" } }]);
    }
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
        setOfficeId(null);
    }
    const handleChange = (e, index) => {
        setState((prv) => {
            let a = [...prv];
            a[index][e.target.name] = e.target.value;
            return a;
        });
    }
    const handleChange1 = (e, v, index) => {
        setState((prv) => {
            let a = [...prv];
            a[index]["employee"] = v;
            return a;
        });
    }
    const getData = async (office) => {
        const response = await axios.get(route(`${baseUrl}.index`), { params: { office_id: office.id, type: "data" } });
        console.log(response.data.stages);
        if (response.status == 200) {
            const { employees, users, stages } = response.data;
            console.log(stages);
            setEmployees([...employees]);
            setState(stages);
        }
    }
    const handleSubmit = async () => {
        const response = await axios.post(route(`${baseUrl}.store`), { office_id: officeId.id, approvals: state });
        console.log(response);
    }
    useEffect(() => {
        if (officeId) {
            handleOpen();
            getData(officeId);
        }
    }, [officeId])
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
        >
            <DeleteComponent approval_id={currentId} setApprovalId={setCurrentId} />
            <DialogTitle>
                Leave Request Approvals
                <IconButton variant='contained' onClick={addnew}>
                    <AddCircle />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {state.map((v, i) => (
                    <Grid key={i} container direction="row" alignItems="center" justifyContent="center" columns={12} spacing={1}>
                        <Grid item
                            sm={2}
                            md={2}
                            lg={2}
                            xl={2}
                        >
                            <TextField
                                name="stage_order"
                                value={v.stage_order}
                                onChange={() => handleChange(event, i)}
                                margin='dense'
                                size='small'
                                label="Order"
                            />
                        </Grid>
                        <Grid item
                            sm={8}
                            md={8}
                            lg={8}
                            xl={8}
                        >
                            <Autocomplete
                                options={employees}
                                value={v.employee}
                                getOptionLabel={option => getFullName(option.firstName, option.middleName, option.LastName)}
                                onChange={(e, v) => { handleChange1(e, v, i) }}
                                renderInput={
                                    params =>
                                        <TextField
                                            {...params}
                                            label="Approver"
                                            margin='dense'
                                            size="small"
                                        />
                                }
                            />
                        </Grid>
                        <Grid
                            item
                            alignItems="center"
                            justifyContent="center"
                            sm={2}
                            md={2}
                            lg={2}
                            xl={2}
                        >
                            <Avatar
                                component={ButtonBase}
                                onClick={() => setCurrentId(v.id)}
                            >
                                <DeleteForeverOutlined />
                            </Avatar>
                        </Grid>
                    </Grid>
                ))}
            </DialogContent>
            <DialogActions>
                <Button variant='contained' onClick={handleSubmit}>Save</Button>
            </DialogActions>
        </Dialog>
    )
}
export default React.memo(ApprovalStages)

const DeleteComponent = ({ approval_id, setApprovalId }) => {
    const [code, setCode] = useState("");
    const [id, setId] = useState("");
    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState({});
    const handleOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setErrors({});
        setOpen(false);
        setCode("");
        setApprovalId(null);
    }
    const hanldeDelete = async () => {
        const response = await axios.delete(route(`${baseUrl}.destroy`, { approvalStage: "1" }), { params: { code: code, id: id } });
        console.log(response);
        if (response.status == 200) {
            handleClose();
        }
        if (response.status == 203) {
            setErrors(response.data.errors);
        }
    }

    useEffect(() => {
        if (approval_id !== null) {
            setId(approval_id);
            handleOpen();

        }
    }, [approval_id])
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
        >
            <DialogTitle>This action can't be undo.</DialogTitle>
            <DialogContent dividers>
                <TextField
                    fullWidth
                    label='Signatore Code'
                    margin='dense'
                    size='small'
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    error={"code" in errors}
                    helperText={("code" in errors && errors.code.length > 0) && errors.code.map(e => e)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={hanldeDelete} variant='contained'>Delete</Button>
            </DialogActions>
        </Dialog>
    )
}

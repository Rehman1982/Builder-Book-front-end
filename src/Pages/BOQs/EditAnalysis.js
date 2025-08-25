import {
    Grid, Stack, Typography, Divider, IconButton, Paper, Box, FormControl, Autocomplete, Button,
    TextField, ButtonGroup, TableContainer, Table, TableRow, TableCell, TableHead,
    TableBody,
    LinearProgress
} from '@mui/material'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import { amber, grey, lime, purple, red, blue } from '@mui/material/colors';
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { BOQContext } from './BOQContext';

// const Header = ({ shouldlock, baseForAnalysis, setBaseForAnalysis, calculateReqQty, errors, state, setState, setAnalysis, setShouldLock }) => {
//     return (
//         <Stack direction="row" spacing={2}>
//             <TextField
//                 disabled={shouldlock}
//                 name="base_qty"
//                 value={baseForAnalysis.base_qty}
//                 onChange={(e) => { setBaseForAnalysis({ ...baseForAnalysis, base_qty: e.target.value }) }}
//                 onBlur={calculateReqQty}
//                 sx={{ width: "33%" }}
//                 margin='dense'
//                 size="small"
//                 label="Base Qty"
//                 error={("base_qty" in errors)}
//                 helperText={("base_qty" in errors) && errors.base_qty.map(e => e)}
//             />
//             <TextField
//                 // disabled={shouldlock}
//                 name="base_unit"
//                 value={baseForAnalysis.base_unit}
//                 onBlur={calculateReqQty}
//                 onChange={(e) => { setBaseForAnalysis({ ...baseForAnalysis, base_unit: e.target.value }) }}
//                 sx={{ width: "33%" }}
//                 margin='dense'
//                 size="small"
//                 label="Unit"
//                 error={("base_unit" in errors)}
//                 helperText={("base_unit" in errors) && errors.base_unit.map(e => e)}

//             />
//             <TextField
//                 name="cf"
//                 type='number'
//                 value={baseForAnalysis.cf}
//                 onBlur={calculateReqQty}
//                 onChange={(e) => { setBaseForAnalysis({ ...baseForAnalysis, cf: e.target.value }) }}
//                 sx={{ width: "34%" }}
//                 margin='dense'
//                 size="small"
//                 label={`Coversion Factor (${state.boqunit} to ${baseForAnalysis.base_unit})`}
//                 error={("cf" in errors)}
//                 helperText={("cf" in errors) && errors.cf.map(e => e)}

//             />
//         </Stack>
//     )
// }
const EditAnalysis = ({ boqDetails, setHasAnalysis, itms, scheduelItem }) => {
    const { showAlert, setMessage } = useContext(BOQContext);
    const [refresh, setRefresh] = useState(false);
    const [boqData, setBoqData] = useState({});
    const [oldstate, setOldState] = useState([]);
    const [state, setState] = useState([]);
    const [errors, setErrors] = useState([]);
    const [progress, setProgress] = useState(false);
    const addAnalysis = () => {
        if (errors.length > 0) {
            setMessage("Cant add row while having validation errors");
            showAlert(true);
            return null;
        }
        const blank = {
            boqs_id: boqData.boq_id,
            id: "",
            item: { id: "", parent_id: "", item: "", unitinfo: { id: "", unit: "" } },
            item_id: "",
            project_id: boqData.project_id, rate: "", required_qty: "", total: ""
        };
        setState(state.concat(blank));
    }
    const handleUpdate = (index, action = null) => {
        setProgress(true);
        let data = { req_type: "analysis", "action": action, ...state[index] };
        axios.put(route("boq.update", { boq: "1" }), data).then(res => {
            if (res.status == 200) {
                if (res.data.errors) {
                    let e = errors;
                    e[index] = res.data.errors;
                    setErrors(e);
                    // console.log(e);
                    setProgress(false);
                } else {
                    setErrors([]);
                    setRefresh(true);
                    setMessage("Success!");
                    showAlert(true);
                    setProgress(false);
                }
            }
        });
    }
    useEffect(() => {
        console.log("analysis component rendered")
        setRefresh(false);
        setBoqData({ ...boqDetails });
        const { boq_id } = boqDetails;
        if (boq_id) {
            console.log(boq_id);
            axios.get(route("boq.edit", { boq: "1", req_type: "analysis", boq_id: boq_id }))
                .then(res => {
                    if (res.status == 200) {
                        if (res.data.errors) {
                            console.log(res.data.errors);
                        } else {
                            // if (res.data.length > 0) {
                            setState(res.data);
                            setOldState(res.data);
                            setHasAnalysis(true);
                            console.log("got Analysis", res.data);
                            // }
                        }
                    }
                });
        }
    }, [boqDetails, refresh]);
    useEffect(() => {
        console.log(errors);
    }, [setErrors])
    return (
        // <Typography>This is analysis component</Typography>
        <Grid item md={7}>
            <Typography gutterBottom noWrap textAlign={"center"} variant='h6'>Analysis</Typography>
            <Grid container sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
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
                        value={(state.reduce((t, c) => t += c.required_qty * c.rate, 0)).toFixed(0)}
                    />
                </Grid>
            </Grid>
            <Paper elevation={5} sx={{ p: 1 }}>
                {progress && <LinearProgress />}
                <Box sx={{ maxHeight: "50vh", overflow: "auto" }} >
                    {state.map((cell, i) => {
                        return (
                            <Grid key={i} container sx={{ p: 1, my: 1, border: 1, borderColor: amber[500], backgroundColor: amber[50] }} >
                                <Grid item>
                                    <FormControl
                                        sx={{ width: "100%" }}
                                        children={
                                            <Autocomplete
                                                fullWidth
                                                loading={true}
                                                // disabled={shouldlock}
                                                size='small'
                                                options={itms}
                                                getOptionLabel={(options) => `${options.item} ${options.unitinfo != undefined && `(${options.unitinfo.unit})`}`}
                                                isOptionEqualToValue={(options) => options.item}
                                                value={state[i]["item"]}
                                                onChange={(event, abc) => {
                                                    let uPA = [...state];
                                                    uPA[i]["item"] = abc;
                                                    setState(uPA);
                                                    // calculateReqQty();
                                                }}

                                                renderInput={(params) =>
                                                    <TextField
                                                        fullWidth
                                                        error={(errors[i] && "item.id" in errors[i]) ? true : false}
                                                        helperText={(errors[i] && "item.id" in errors[i]) && errors[i][`item.id`].map(e => e)}
                                                        {...params} label="Select Item" />
                                                }
                                            />
                                        }
                                    />
                                    <Stack direction={"row"} sx={{ alignItems: "center" }}>
                                        <TextField
                                            name="required_qty"
                                            value={state[i]["required_qty"] ?? 0}
                                            onChange={(e) => {
                                                setState((prv) => {
                                                    let a = [...prv]; a[i]["required_qty"] = e.target.value;
                                                    return a;
                                                })
                                            }}
                                            // onBlur={() => shouldRenderSaveBtn(i, "")}
                                            size="small"
                                            type="text"
                                            // sx={{ width: "30%" }}
                                            margin='dense'
                                            label="Qty for BOQ"
                                            error={(errors[i] && "required_qty" in errors[i]) ? true : false}
                                            helperText={(errors[i] && "required_qty" in errors[i]) && errors[i][`required_qty`].map(e => e)} />
                                        <TextField
                                            value={state[i]["rate"]}
                                            onChange={(e) => {
                                                setState((prv) => {
                                                    let a = [...prv]; a[i]["rate"] = e.target.value;
                                                    return a;
                                                })
                                            }}
                                            name="rate"
                                            type="number"
                                            size="small"
                                            // sx={{ width: "30%" }}
                                            margin='dense'
                                            label="Rate"
                                            error={(errors[i] && "rate" in errors[i]) ? true : false}
                                            helperText={(errors[i] && "rate" in errors[i]) && errors[i][`rate`].map(e => e)}

                                        />
                                        <TextField
                                            disabled
                                            value={(state[i]["required_qty"] * state[i]["rate"]).toFixed(0) ?? 0}
                                            name="amount"
                                            size="small"
                                            // sx={{ width: "30%" }}
                                            margin='dense'
                                            label="Amount"
                                        // error={(`analysis.${i}.amount`) in errors}
                                        // helperText={((`analysis.${i}.amount`) in errors) && errors[`analysis.${i}.amount`].map(e => e)}
                                        />

                                        {/* <Button onClick={() => handleUpdate(i)}>{state[i]["id"] == "" ? "save" : "Update"}</Button> */}
                                        <IconButton
                                            sx={{ border: 1, borderColor: blue[200], ml: 1 }}
                                            onClick={() => handleUpdate(i)}
                                            children={state[i]["id"] == "" ? <AddIcon /> : <SaveIcon color="primary" />}
                                        />
                                        <IconButton
                                            sx={{ border: 1, borderColor: red[200], ml: 1 }}
                                            onClick={() => handleUpdate(i, "delete")}
                                            children={state[i]["id"] && <DeleteIcon color="error" />}
                                        />
                                    </Stack>
                                </Grid>
                                <Divider />
                            </Grid>
                        )
                    }
                    )}
                </Box>
            </Paper>
        </Grid>
    )
}
export default React.memo(EditAnalysis);

// const TR = ({ state }) => {
//     return (
//         <TableRow>
//             <TableCell>
//                 <FormControl
//                     sx={{ width: "75%" }}
//                     children={
//                         <Autocomplete
//                             loading={true}
//                             // disabled={shouldlock}
//                             size='small'
//                             options={itms}
//                             getOptionLabel={(options) => `${options.item}--${options.unitinfo != undefined && options.unitinfo.unit}`}
//                             isOptionEqualToValue={(options) => options.item}
//                             value={state[i]["item"]}
//                             onChange={(event, abc) => {
//                                 let uPA = [...state];
//                                 uPA[i]["item_id"] = abc;
//                                 setState(uPA);
//                                 // calculateReqQty();
//                             }}

//                             renderInput={(params) =>
//                                 <TextField
//                                     error={(`analysis.${i}.item_id.id`) in errors}
//                                     helperText={((`analysis.${i}.item_id.id`) in errors) && errors[`analysis.${i}.item_id.id`].map(e => e)}
//                                     {...params} label="Select Item" />
//                             }
//                         />
//                     }
//                 />
//             </TableCell>
//             <TableCell>
//                 <TextField
//                     name="qty_for_boq"
//                     value={state[i]["required_qty"] ?? 0}
//                     // onChange={() => { handleChangeAnalysis(event, i); calculateReqQty(); }}
//                     size="small"
//                     type="text"
//                     sx={{ width: "25%" }}
//                     margin='dense'
//                     label="Qty for BOQ"
//                 // error={(`analysis.${i}.qty_for_boq`) in errors}
//                 // helperText={((`analysis.${i}.qty_for_boq`) in errors) && errors[`analysis.${i}.qty_for_boq`].map(e => e)}
//                 />
//             </TableCell>
//             <TableCell>
//                 <TextField
//                     value={state[i]["rate"]}
//                     // onChange={() => { handleChangeAnalysis(event, i); calculateReqQty(); }}
//                     name="rate"
//                     type="number"
//                     size="small"
//                     sx={{ width: "25%" }}
//                     margin='dense'
//                     label="Rate"
//                 // error={(`analysis.${i}.rate`) in errors}
//                 // helperText={((`analysis.${i}.rate`) in errors) && errors[`analysis.${i}.rate`].map(e => e)}

//                 />
//             </TableCell>
//             <TableCell>
//                 <TextField
//                     disabled
//                     value={state[i]["total"] ?? 0}
//                     name="amount"
//                     size="small"
//                     sx={{ width: "25%" }}
//                     margin='dense'
//                     label="Amount"
//                 // error={(`analysis.${i}.amount`) in errors}
//                 // helperText={((`analysis.${i}.amount`) in errors) && errors[`analysis.${i}.amount`].map(e => e)}
//                 />
//             </TableCell>
//             <TableCell>
//                 <ButtonGroup>
//                     <IconButton
//                         children={<DeleteIcon color='error' />}
//                     />
//                 </ButtonGroup>
//             </TableCell>
//         </TableRow>
//     )
// }

import React, { useContext, useEffect, useState } from "react";
import { BOQContext } from "./BOQContext";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button,
    TableFooter,
    Dialog,
    Box,
    Autocomplete,
    TextField,
    ButtonGroup,
    IconButton,
    LinearProgress,
    Grid,
    OutlinedInput,
    FormControl,
    Stack,
    Menu,
    MenuItem,
} from "@mui/material";
import { amber, blue, grey, lightGreen, red } from "@mui/material/colors";
import { Link } from "react-router-dom";
import { memo } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import {
    Details,
    Edit,
    Filter,
    Search,
    Tune,
    TuneOutlined,
} from "@mui/icons-material";
const Index = () => {
    const { setMessage, showAlert } = useContext(BOQContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [index, setIndex] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [progress, setProgress] = useState(false);
    const [totals, setTotals] = useState({ bTotal: 0, RTotal: 0, GTotal: 0 });
    const header = [
        "Project Name",
        "BOQ Amount (Rs)",
        "Revised Amount",
        "Total",
        "",
    ];
    const HeadCells = (props) => {
        return (
            <TableCell
                key={props}
                sx={{
                    border: 1,
                    borderColor: grey[500],
                    backgroundColor: amber[300],
                }}
            >
                <Typography textAlign="center" variant="body1" fontWeight={700}>
                    {props}
                </Typography>
            </TableCell>
        );
    };
    const getData = async () => {
        setProgress(true);
        const response = await axios.get(
            route("estimation.boq.index", { type: "projectshavingboq" })
        );
        if (response.status === 203) {
            console.log(response.data.errors);
            setMessage("Validation Errors");
            showAlert(true);
            setProgress(false);
            return false;
        }
        if (response.status === 200) {
            setIndex(response.data);
            setProgress(false);
            return true;
        }
    };
    useEffect(() => {
        setRefresh(false);
        getData();
    }, [refresh]);
    useEffect(() => {
        const Totals = index.reduce((tl, v) => {
            tl.bTotal += parseInt(v.boQtotal);
            tl.RTotal += parseInt(v.revision);
            tl.GTotal = tl.bTotal + tl.RTotal;
            return tl;
        }, totals);
        setTotals(Totals);
    }, [index]);
    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <FreshBoq setRefresh={setRefresh} />
                <SearchField />
            </Stack>
            {progress && <LinearProgress />}
            <Paper elevation={12}>
                <TableContainer sx={{ maxHeight: "95vh" }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {header.map((v) => HeadCells(v))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {index.map((v, i) => {
                                return (
                                    <TableRow key={i}>
                                        <TableCell
                                            sx={{
                                                border: 1,
                                                borderColor: grey[500],
                                            }}
                                        >
                                            <Typography variant="body1">
                                                {v.project.name}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                border: 1,
                                                borderColor: grey[500],
                                            }}
                                        >
                                            <Typography
                                                textAlign="right"
                                                variant="body1"
                                            >
                                                {parseInt(v.boQtotal)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                border: 1,
                                                borderColor: grey[500],
                                            }}
                                        >
                                            <Typography
                                                textAlign="right"
                                                variant="body1"
                                            >
                                                {v.revision}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                border: 1,
                                                borderColor: grey[500],
                                            }}
                                        >
                                            <Typography
                                                textAlign="right"
                                                variant="body1"
                                            >
                                                {parseInt(v.boQtotal) +
                                                    parseInt(v.revision)}
                                            </Typography>
                                        </TableCell>
                                        <TableCell
                                            padding="checkbox"
                                            sx={{
                                                border: 1,
                                                borderColor: grey[500],
                                                px: 2,
                                            }}
                                        >
                                            <Link to={`${v.project_id}`}>
                                                <IconButton
                                                    sx={{
                                                        border: 1,
                                                        borderColor: blue[300],
                                                    }}
                                                    children={
                                                        <Edit color="primary" />
                                                    }
                                                />
                                                {/* <Button variant="outlined">
                                                    Details
                                                </Button> */}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        border: 1,
                                        borderColor: grey[500],
                                        backgroundColor: lightGreen[300],
                                    }}
                                >
                                    <Typography variant="body1">
                                        Total (M)
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: 1,
                                        borderColor: grey[500],
                                        backgroundColor: lightGreen[300],
                                    }}
                                >
                                    <Typography
                                        textAlign="right"
                                        variant="body1"
                                    >
                                        {(totals.bTotal / 1000000).toFixed(2)}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: 1,
                                        borderColor: grey[500],
                                        backgroundColor: lightGreen[300],
                                    }}
                                >
                                    <Typography
                                        textAlign="right"
                                        variant="body1"
                                    >
                                        {(totals.RTotal / 1000000).toFixed(2)}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: 1,
                                        borderColor: grey[500],
                                        backgroundColor: lightGreen[300],
                                    }}
                                >
                                    <Typography
                                        textAlign="right"
                                        variant="body1"
                                    >
                                        {(totals.GTotal / 1000000).toFixed(2)}
                                    </Typography>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        border: 1,
                                        borderColor: grey[500],
                                        backgroundColor: lightGreen[300],
                                    }}
                                ></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
        </>
    );
};
const FreshBoq = memo(({ setRefresh }) => {
    const { showAlert, setMessage } = useContext(BOQContext);
    const [projets, setProjects] = useState([]);
    const [state, setState] = useState({
        id: "",
        parent_id: null,
        sno: 1,
        project_id: { id: "", name: "" },
        desp: "",
        Header: true,
    });
    const [errors, setErrors] = useState({});
    const [open, setOpen] = useState(false);
    const [progress, setProgress] = useState(false);
    const handleClose = () => {
        setErrors({});
        setState({
            sno: 1,
            project_id: { id: "", name: "" },
            desp: "",
            header: true,
        });
        setProgress(false);
        setOpen(false);
    };
    const handleSubmit = async () => {
        setProgress(true);
        try {
            const data = { boq: { ...state, project_id: state.project_id.id } };
            const res = await axios.post(route("estimation.boq.store"), data);
            if (res.status === 203) {
                setErrors(res.data.errors);
                setMessage("validation errors");
                showAlert(true);
                setProgress(false);
                return false;
            }
            if (res.status === 200) {
                handleClose();
                setMessage("Fresh BoQ Created Successfully!");
                showAlert(true);
                setRefresh(true);
                setProgress(false);
                return true;
            }
        } catch (error) {
            console.log(error.response.data);
        }
    };
    const getAllProjects = async () => {
        const res = await axios.get(
            route("estimation.boq.index", { type: "allprojects" })
        );
        if (res.status === 203) {
            setErrors(res.data.errors);
            setMessage("validation errors");
            showAlert(true);
            return false;
        }
        if (res.status === 200) {
            setProjects(res.data);
            return true;
        }
    };
    useEffect(() => {
        getAllProjects();
    }, []);
    return (
        <>
            <IconButton
                size="small"
                sx={{
                    backgroundColor: amber[300],
                    mb: 1,
                }}
                onClick={() => setOpen(true)}
                children={<AddIcon />}
            />
            <Dialog open={open} onClose={handleClose} fullWidth>
                <Box sx={{ p: 3 }}>
                    <Typography
                        textAlign={"center"}
                        variant="h6"
                        gutterBottom={true}
                    >
                        Create Fresh BOQ
                    </Typography>
                    <Autocomplete
                        options={projets}
                        getOptionLabel={(option) => option.name}
                        value={state.project_id}
                        onChange={(event, value) => {
                            setState({
                                ...state,
                                project_id: value,
                                desp: value.name ?? "",
                            });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="outlined"
                                fullWidth={true}
                                label="Select Project"
                                error={
                                    errors.project_id &&
                                    errors.project_id.length > 0
                                        ? true
                                        : false
                                }
                                helperText={
                                    errors.project_id &&
                                    errors.project_id.length > 0 &&
                                    errors.project_id.map((e) => e)
                                }
                            />
                        )}
                    />
                    {progress && <LinearProgress sx={{ my: 2 }} />}
                    <ButtonGroup sx={{ mt: 2 }} fullWidth>
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={handleSubmit}
                        >
                            Create
                        </Button>
                        <Button
                            variant="outlined"
                            color="info"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </ButtonGroup>
                </Box>
            </Dialog>
        </>
    );
});

const SearchField = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    return (
        <>
            <FormControl
                sx={{
                    width: {
                        xs: "90%",
                        md: "50%",
                        lg: "33%",
                    },
                    mb: 1,
                }}
            >
                <OutlinedInput
                    margin="dense"
                    size="small"
                    startAdornment={<Search />}
                    endAdornment={
                        <IconButton
                            onClick={(e) => setAnchorEl(e.target)}
                            children={<TuneOutlined color="primary" />}
                        />
                    }
                />
            </FormControl>
            <FilterForm anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
        </>
    );
};
const FilterForm = ({ anchorEl, setAnchorEl }) => {
    const [state, setState] = useState({
        project: "",
        amountType: "",
        operator: "",
        amount: "",
        status: "",
    });
    const handleChange = (event) => {
        const { name, value } = event.target;
        console.log(name, value);
        setState({ ...state, [name]: value });
    };
    useEffect(() => {
        console.log(state);
    }, [state]);
    return (
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
        >
            <Box sx={{ padding: 2 }}>
                <TextField
                    label="Project Name"
                    name="project"
                    value={state.project}
                    onChange={handleChange}
                    fullWidth
                    margin="dense"
                />
                <Typography>Amount</Typography>
                <Stack direction="row" justifyContent="space-between">
                    <Grid container spacing={0.5}>
                        <Grid item xs={4}>
                            <TextField
                                onChange={handleChange}
                                value={state.amountType}
                                name="amountType"
                                fullWidth
                                select
                                margin="dense"
                            >
                                <MenuItem key="1" value="BOQ">
                                    BOQ
                                </MenuItem>
                                <MenuItem key="2" value="Revised">
                                    Revised
                                </MenuItem>
                                <MenuItem key="3" value="Total">
                                    Total
                                </MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                select
                                value={state.operator}
                                onChange={handleChange}
                                name="operator"
                                fullWidth
                                margin="dense"
                            >
                                <MenuItem key="1" value="<">
                                    {"<"}
                                </MenuItem>
                                <MenuItem key="2" value=">">
                                    {">"}
                                </MenuItem>
                                <MenuItem key="3" value="=">
                                    {"="}
                                </MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField
                                value={state.amount}
                                onChange={handleChange}
                                name="amount"
                                fullWidth
                                margin="dense"
                            />
                        </Grid>
                    </Grid>
                </Stack>
                <TextField
                    label="Status"
                    name="status"
                    margin="dense"
                    onChange={handleChange}
                    value={state.status}
                    fullWidth
                    select
                >
                    <MenuItem key={1} value="active">
                        Active
                    </MenuItem>
                    <MenuItem key={2} value="de-active">
                        De-Active
                    </MenuItem>
                </TextField>
                <Stack direction="row" justifyContent="flex-end" marginTop={2}>
                    <Button variant="contained">Submit</Button>
                </Stack>
            </Box>
        </Menu>
    );
};
export { FreshBoq };
export default memo(Index);

import React, { useContext, useState, memo } from "react";
import { BOQContext } from "./BOQContext";
import { Alert } from "../../context/AlertBar/AlertBar";
import { useEffect } from "react";
import {
    Divider,
    Paper,
    TableCell,
    Typography,
    Tooltip,
    LinearProgress,
    Button,
    Stack,
    Grid,
    Box,
} from "@mui/material";
import {
    amber,
    blue,
    blueGrey,
    grey,
    lightGreen,
    red,
} from "@mui/material/colors";
// import Tooltip from '@mui/material/Tooltip';
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import SyncIcon from "@mui/icons-material/Sync";
import IconButton from "@mui/material/IconButton";
import { useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CreateBoq from "./CreateBoq";
import EditBoq from "./Edit";
import Delete from "./Delete";
import { Revision } from "./Revision";
import { float } from "../partials/helpers";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
// menu includes
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useRef } from "react";

const Show = () => {
    const RowRef = useRef();
    const CreateBoqRef = useRef();
    const [variant, setVariant] = useState(""); // Edit, View
    const { project_id } = useParams();
    const [refresh, setRefresh] = useState(false);
    const { toggles, setToggles, items, schedules } = useContext(BOQContext);
    const [state, setState] = useState([]);
    const [selectItem, setSelectedItem] = useState({});
    const [info, setInfo] = useState({});
    const [progress, setProgress] = useState(false);
    const [grandTotal, setGrandTotal] = useState({
        boq: 0,
        revised: 0,
        total: 0,
    });
    const { showAlert, setMessage } = useContext(Alert);
    const header = [
        "",
        "S.N",
        "A",
        "Desp",
        "Item Code",
        "BOQ Rate",
        "BOQ Qty",
        "BOQ Amount",
        "Variation Qty",
        "Variation Amount",
        "Total Qty",
        "Total Amount",
        "Action",
    ];
    const navigate = useNavigate();
    const crateParent = () => {
        setSelectedItem({ project_id: project_id });
        setVariant("Add");
        CreateBoqRef.current?.open();
    };
    const HeadCells = (props) => {
        return (
            <TableCell
                key={props}
                sx={{
                    border: 1,
                    borderColor: grey[300],
                    backgroundColor: amber[300],
                }}
            >
                <Typography textAlign="center" variant="subtitle1">
                    {props}
                </Typography>
            </TableCell>
        );
    };
    const getProjectBoq = async (project_id) => {
        setProgress(true);
        const res = await axios.get(route("estimation.boq.show", { boq: 1 }), {
            params: { project_id: project_id, type: "data", boq: 1 },
        });
        if (res.status === 200) {
            setInfo(res.data.info);
            setState(summarizeData(res.data.boq, res.data.boq));
            setProgress(false);
            return true;
        } else {
            setMessage(
                "Error occured in API Call for details please check console"
            );
            showAlert(true);
            return false;
        }
        return response;
    };
    const handleClick = React.useCallback((requiredaction, data) => {
        if (requiredaction == "View") {
            setSelectedItem(data);
            setVariant("View");
            CreateBoqRef.current?.open();
        }
        if (requiredaction == "Add") {
            setSelectedItem(data);
            setVariant("Add");
            CreateBoqRef.current?.open();
        }
        if (requiredaction == "Edit") {
            setSelectedItem(data);
            setVariant("Edit");
            CreateBoqRef.current?.open();
        }
        if (requiredaction == "Delete") {
            setSelectedItem({ id: data });
            setToggles({ ...toggles, deleteForm: true });
        }
        if (requiredaction == "Revision") {
            setSelectedItem({ id: data });
            setToggles({ ...toggles, revisionCreate: true });
        }
    }, []);
    useEffect(() => {
        setRefresh(false);
        getProjectBoq(project_id);
    }, [refresh]);
    useEffect(() => {
        if (state.length > 0) {
            setGrandTotal(GrandTotal(state));
            console.log("state data", state);
        }
    }, [state]);
    return (
        <>
            <Button
                onClick={() => navigate(-1)}
                children={<ArrowBackIosIcon />}
            />
            <Tooltip
                title="Create Parent Item"
                children={
                    <IconButton
                        onClick={crateParent}
                        color="success"
                        children={<ControlPointIcon />}
                    />
                }
            />
            <CreateBoq
                ref={CreateBoqRef}
                reload={setRefresh}
                index={state}
                setIndex={setState}
                items={items}
                schedules={schedules}
                selectItem={selectItem}
                clearData={setSelectedItem}
                setRefresh={setRefresh}
                setState={setState}
                variant={variant}
                setVariant={setVariant}
            />
            <Revision selectItem={selectItem} RefreshParent={setRefresh} />
            <Delete data={{ selectItem: selectItem, setRefresh: setRefresh }} />
            <Stack direction="row" spacing={4}>
                <Typography variant="h6"> {info.name}</Typography>
            </Stack>
            {progress && <LinearProgress />}
            <Paper elevation={6}>
                <Grid container spacing={0} columns={15}>
                    {header.map((v) => (
                        <Grid
                            key={v}
                            item
                            xs={v == "A" ? 0.5 : v == "Desp" ? 3.5 : 1}
                            sx={{
                                display: "flex",
                                direction: "row",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                border: 1,
                                borderColor: grey[500],
                                alignItems: "center",
                                p: 1,
                            }}
                        >
                            <Typography textAlign="center" variant="body1">
                                {v}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
                <Box maxHeight="95vh" overflow="auto">
                    <Row mrgn={0} data={state} handleClick={handleClick} />
                </Box>
                <Grid container spacing={0} columns={15}>
                    {header.map((v) => (
                        <Grid
                            key={v}
                            item
                            xs={v == "A" ? 0.5 : v == "Desp" ? 3.5 : 1}
                            sx={{
                                display: "flex",
                                direction: "row",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                border: 0.5,
                                borderColor: grey[400],
                                bgcolor: blue[500],
                                color: grey[50],
                                alignItems: "center",
                                p: 1,
                            }}
                        >
                            {state.length > 0 && (
                                <Typography textAlign="center" variant="body1">
                                    {v == "BOQ Amount"
                                        ? grandTotal.boq
                                        : v == "Variation Amount"
                                        ? grandTotal.revised
                                        : v == "Total Amount"
                                        ? grandTotal.total
                                        : v == "Desp"
                                        ? "Total"
                                        : ""}
                                </Typography>
                            )}
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </>
    );
};
const Row = memo(({ mrgn, data, handleClick }) => {
    console.log("Row Rendered");
    return data.map((v, i) => {
        return (
            <Grid
                columns={15}
                container
                key={v.id}
                spacing={0}
                className={v.parent_id !== null ? "collapse show" : ""}
                id={"id" + v.parent_id}
                sx={{
                    backgroundColor:
                        v.parent_id == null
                            ? lightGreen[300]
                            : v.childs.length > 0
                            ? red[200]
                            : blueGrey[100],
                    position: "relative",
                }}
            >
                <Grid
                    item
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    xs={1}
                    sx={{
                        border: 1,
                        borderColor: grey[500],
                        padding: "0px",
                        alignItems: "center",
                    }}
                >
                    {v.childs.length > 0 && (
                        <Tooltip title="Click to Expand" sx={{ p: 0 }}>
                            <IconButton
                                sx={{ marginLeft: mrgn }}
                                size="small"
                                data-toggle="collapse"
                                data-target={"#id" + v.id}
                            >
                                <NavigateNextIcon
                                    sx={{ p: 0 }}
                                    color="primary"
                                />
                            </IconButton>
                        </Tooltip>
                    )}
                </Grid>
                <Grid
                    item
                    xs={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">{v.sno}</Typography>
                </Grid>
                <Grid
                    item
                    xs={0.5}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">
                        {v.analysis.length > 0 ? (
                            <CheckIcon fontSize="small" color="success" />
                        ) : (
                            <ClearIcon fontSize="small" color="error" />
                        )}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={3.5}
                    sx={{
                        border: 1,
                        borderColor: grey[500],
                        alignItems: "center",
                        p: 1,
                    }}
                >
                    <Divider
                        children={
                            <Typography variant="subtitle2">
                                ID: {v.id}
                            </Typography>
                        }
                        variant="inset"
                        textAlign="right"
                        flexItem
                    />
                    <Typography variant="subtitle2" noWrap>
                        {v.desp}{" "}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">{v.item_code}</Typography>
                </Grid>
                <Grid
                    item
                    display="flex"
                    flexWrap="wrap"
                    justifyContent="center"
                    alignItems="center"
                    xs={1}
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">{v.quoted_rate}</Typography>
                    <Typography variant="subtitle2">/{v.unit}</Typography>
                </Grid>
                <Grid
                    item
                    xs={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">{v.qty}</Typography>
                </Grid>
                <Grid
                    item
                    xs={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">
                        {Math.round(v.boqAmnt)}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">
                        {v.revision.toFixed(2)}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">
                        {Math.round(v.revAmnt)}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">
                        {v.totalQty.toFixed(2)}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={1}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ border: 1, borderColor: grey[500] }}
                >
                    <Typography variant="subtitle2">
                        {Math.round(v.totalAmnt)}
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs={1}
                    align="center"
                    sx={{
                        border: 1,
                        borderColor: grey[500],
                        padding: "0px",
                    }}
                >
                    <SideMenu onClick={handleClick} data={v} />
                </Grid>
                {v.childs.length > 0 && (
                    <Row
                        mrgn={mrgn + 3}
                        data={v.childs}
                        handleClick={handleClick}
                    />
                )}
            </Grid>
        );
    });
});

export default Show;

export { SideMenu };

const SideMenu = memo(({ onClick, data }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                id="demo-positioned-button"
                aria-controls={open ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <MenuIcon fontSize="large" />
            </Button>
            <Menu
                sx={{ borderRadius: 20 }}
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
            >
                <MenuItem
                    divider
                    onClick={() => {
                        onClick("View", data);
                        handleClose();
                    }}
                    children={
                        <Button startIcon={<VisibilityIcon color="primary" />}>
                            Show
                        </Button>
                    }
                />
                <MenuItem
                    divider
                    onClick={() => {
                        onClick("Add", data);
                        handleClose();
                    }}
                    children={
                        <Button
                            startIcon={<ControlPointIcon color="primary" />}
                        >
                            Add
                        </Button>
                    }
                />
                <MenuItem
                    divider
                    onClick={() => {
                        onClick("Edit", data);
                        handleClose();
                    }}
                    children={
                        <Button startIcon={<EditIcon color="warning" />}>
                            Edit
                        </Button>
                    }
                />
                <MenuItem
                    divider
                    onClick={() => {
                        onClick("Delete", data.id);
                        handleClose();
                    }}
                    children={
                        <Button startIcon={<DeleteForeverIcon color="error" />}>
                            Delete
                        </Button>
                    }
                />
                {data.Header == 0 && (
                    <MenuItem
                        onClick={() => {
                            onClick("Revision", data.id);
                            handleClose();
                        }}
                        children={
                            <Button startIcon={<SyncIcon color="secondary" />}>
                                Revise
                            </Button>
                        }
                    />
                )}
            </Menu>
        </div>
    );
});

const summarizeData = (dynamicData, staticData, id = null) => {
    let d = dynamicData.map((v, i) => {
        if (v.parent_id == id) {
            let data = summarizeData(dynamicData, staticData, v.id);
            if (v.type === "boq") {
                let baseQty = v.baseQty !== null ? v.baseQty : 1;
                let quotedRate = v.quoted_rate / baseQty;
                v["childs"] = data;
                v["revision"] = pullRevision(staticData, v.id);
                v["boqAmnt"] = float(v.qty) * float(quotedRate);
                v["revQty"] = float(v.revision);
                v["revAmnt"] = float(v.revQty) * float(quotedRate);
                v["totalQty"] = float(v.qty) + float(v.revision);
                v["totalAmnt"] = v.totalQty * float(quotedRate);
                v["revAmnt"] = data.reduce(
                    (ttl, crnt) => ttl + parseInt(crnt["revAmnt"]),
                    v["revAmnt"]
                );
                v["boqAmnt"] = data.reduce(
                    (ttl, crnt) => ttl + parseInt(crnt["boqAmnt"]),
                    v["boqAmnt"]
                );
                v["totalAmnt"] = data.reduce(
                    (ttl, crnt) => ttl + parseInt(crnt["totalAmnt"]),
                    v["totalAmnt"]
                );
                return v;
            }
        }
    });
    return d.filter((a) => a !== undefined);
};

const pullRevision = (staticData, parent_id) => {
    return staticData.reduce((total, current) => {
        if (current.parent_id == parent_id && current.type == "revision") {
            return total + parseFloat(current.qty);
        }
        return total;
    }, 0);
};

const GrandTotal = (data) => {
    console.log(data);
    return data.reduce(
        (t, c, i) => {
            let boqAmount = parseInt(c.boqAmnt);
            let revisedAmount = parseInt(c.revAmnt);
            let total = parseInt(c.totalAmnt);
            t.boq += boqAmount;
            t.revised += revisedAmount;
            t.total += total;
            return t;
        },
        { boq: 0, revised: 0, total: 0 }
    );
};

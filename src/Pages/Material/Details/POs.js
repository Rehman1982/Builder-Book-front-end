import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Grid,
    Link,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from "@mui/material";
import { blue, green, grey } from "@mui/material/colors";
import axios from "axios";
import React from "react";
import { use } from "react";
import { useState } from "react";
import { useEffect } from "react";
import CreateBoq from "../../BOQs/CreateBoq";
import { useRef } from "react";
import { useCallback } from "react";
import {
    filter,
    flatten,
    groupBy,
    pull,
    round,
    sortedUniq,
    sortedUniqBy,
    sumBy,
    uniqBy,
} from "lodash";
import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";

export const POs = ({ project_id, item_id, unit, item_name }) => {
    const [data, setData] = useState([]);
    const [details, setDetails] = useState([]);
    const [grpby, setGrpBy] = useState(null);
    const [currentItem, setCurrentItem] = useState();
    const [revision, setRevision] = useState([]);

    const getData = async () => {
        try {
            const res = await axios.get(route("estimation.material.index"), {
                params: {
                    type: "podetails",
                    project_id: project_id,
                    item_id: item_id,
                },
            });
            if (res.status == 200) {
                setData(res.data);
            }
            console.log(res.data);
        } catch (error) {
            console.log(error.response);
        }
    };
    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {
        setDetails(data.flatMap((o) => o.po_details));
    }, [data]);

    return (
        <Box padding={3}>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
                spacing={2}
            >
                <Typography variant="body1">{`${item_name} in ${unit}`}</Typography>
                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography variant="body1">Group By:</Typography>
                    <ButtonGroup>
                        <Button
                            onClick={() => {
                                setGrpBy("user_details.user");
                            }}
                        >
                            User
                        </Button>
                        <Button
                            onClick={() => {
                                setGrpBy("vendor_details.name");
                            }}
                        >
                            Vendor
                        </Button>
                        <Button onClick={() => setGrpBy(null)}>default</Button>
                    </ButtonGroup>
                </Stack>
            </Stack>
            <Grid
                component={Paper}
                elevation={8}
                container
                columnSpacing={2}
                rowSpacing={0.5}
                justifyContent="center"
                alignItems="center"
                p={1}
                mb={0.5}
                border={0.5}
                borderColor={grey[200]}
                bgcolor={blue[300]}
            >
                <Grid item xs={3}>
                    PO#/Vendor
                </Grid>
                <Grid item xs={5}>
                    Po Desp
                </Grid>
                <Grid item xs={2}>
                    Qty ({unit})
                </Grid>
                <Grid item xs={2}>
                    Amount
                </Grid>
            </Grid>
            {grpby == null && <Contents data={data} />}
            {grpby !== null && <Grouped data={data} grpby={grpby} />}
            <Grid
                component={Paper}
                container
                columnSpacing={2}
                rowSpacing={0.5}
                justifyContent="center"
                alignItems="center"
                p={1}
                mt={0.5}
                border={0.5}
                borderColor={grey[200]}
                bgcolor={blue[300]}
            >
                <Grid item xs={8}>
                    Total
                </Grid>
                <Grid item xs={2}>
                    {round(
                        sumBy(details, (o) => parseFloat(o.qty)),
                        2
                    )}
                </Grid>
                <Grid item xs={2}>
                    {round(
                        sumBy(
                            details,
                            (o) => parseFloat(o.qty) * parseFloat(o.gross)
                        ),
                        0
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};
const QtyDetails = ({ details }) => {
    const [anchor, setAnchor] = useState(null);
    const [state, setState] = useState([]);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        setState(details);
        setTotal(
            round(
                sumBy(details, (o) => parseFloat(o.qty) * parseFloat(o.gross)),
                2
            )
        );
    }, [details]);
    return (
        <>
            <Button onClick={(e) => setAnchor(e.currentTarget)}>
                {total && total}
            </Button>
            <Menu
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
            >
                {state?.map((v) => (
                    // <MenuItem key={v.id}>
                    <Grid
                        key={v.id}
                        component={MenuItem}
                        container
                        columnSpacing={1}
                        rowSpacing={0.5}
                        p={1}
                        justifyContent="flex-start"
                        alignItems="center"
                        borderBottom={1}
                        borderColor={grey[400]}
                    >
                        <Grid item xs={8}>
                            <Typography variant="subtitle2">
                                {`${v.qty} @ ${v.gross} =  `}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle2">
                                {v.qty * v.gross}
                            </Typography>
                        </Grid>
                    </Grid>
                    // </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const Grouped = ({ data, grpby }) => {
    const [state, setState] = useState([]);
    const [open, setOpen] = useState([]);
    const handleOpen = (head) => {
        if (open.includes(head)) {
            setOpen(open.filter((v) => v !== head));
        } else {
            setOpen([...open, `${head}`]);
        }
    };
    useEffect(() => {
        console.log("grouping", groupBy(data, grpby));
        setState(groupBy(data, grpby));
    }, [data, grpby]);
    return Object.entries(state)?.map(([head, details]) => (
        <div key={head}>
            <Grid
                container
                p={1}
                component={Paper}
                bgcolor={green[200]}
                columnSpacing={2}
                rowSpacing={0.5}
                my={0.25}
            >
                <Grid
                    item
                    xs={8}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpen(head)}
                >
                    {open.includes(head) ? (
                        <ArrowDropUp fontSize="0.5rem" />
                    ) : (
                        <ArrowDropDown fontSize="0.5rem" />
                    )}{" "}
                    {head}
                </Grid>
                <Grid item xs={4} textAlign="right">
                    <Typography variant="body1">
                        Rs.
                        {sumBy(
                            details.flatMap((pod) => pod.po_details),
                            (o) => o.qty * o.rate
                        )}
                    </Typography>
                </Grid>
            </Grid>
            <Collapse in={open.includes(head) ? true : false}>
                <Contents data={details} />
            </Collapse>
        </div>
    ));
};

const Contents = ({ data }) => {
    return data.map((v) => {
        return (
            <React.Fragment key={v.id}>
                <Grid
                    component={Paper}
                    container
                    columnSpacing={2}
                    rowSpacing={0.5}
                    justifyContent="center"
                    alignItems="center"
                    key={v.id}
                    p={1}
                    border={0.5}
                    borderColor={grey[200]}
                >
                    <Grid item xs={3} textAlign="left" px={0}>
                        <Link
                            href={route("PO.show", {
                                PO: v.id,
                            })}
                            target="_blank"
                            rel="noreferrer"
                            underline="none"
                        >
                            {v.id}
                        </Link>
                        <Typography variant="body2">
                            {v?.vendor_details?.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Tooltip title={v.podesp}>
                            <Typography variant="body2" noWrap>
                                {v.podesp}
                            </Typography>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body2">
                            {round(
                                sumBy(v.po_details, (o) => parseInt(o.qty)),
                                2
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Typography variant="body2">
                            <QtyDetails details={v.po_details} />
                        </Typography>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    });
};

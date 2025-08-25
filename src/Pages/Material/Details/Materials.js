import {
    Box,
    Button,
    ButtonGroup,
    Collapse,
    Grid,
    Paper,
    Stack,
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
import { flatMap, groupBy, round, sumBy } from "lodash";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export const Materials = ({ project_id, item_id, unit, item_name }) => {
    const BoqRef = useRef();
    const [data, setData] = useState([]);
    const [currentItem, setCurrentItem] = useState();
    const [revision, setRevision] = useState([]);
    const [grp, setGrp] = useState(null);

    const getData = async () => {
        try {
            const res = await axios.get(route("estimation.material.index"), {
                params: {
                    type: "boqdetails",
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
    const getRevision = (boqId, bqty = 0) => {
        const qty = data
            .filter((rv) => {
                if (rv.boq.parent_id == boqId && rv.boq.type == "revision") {
                    return rv;
                }
            })
            .reduce(
                (t, c, i) => (t += parseFloat(c.required_qty)),
                parseFloat(bqty)
            );
        return round(qty, 2);
    };
    const openBoq = useCallback((boq) => {
        setCurrentItem(boq.boq);
        BoqRef.current.open();
    }, []);
    useEffect(() => {
        getData();
    }, []);
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
                    spacing={1}
                >
                    <Typography variant="body1">GroupBy:</Typography>
                    <ButtonGroup>
                        <Button onClick={() => setGrp("boq.item_code")}>
                            Item Code
                        </Button>
                        <Button onClick={() => setGrp("boq.desp")}>Desp</Button>
                        <Button onClick={() => setGrp(null)}>default</Button>
                    </ButtonGroup>
                </Stack>
            </Stack>
            <CreateBoq
                selectItem={currentItem}
                items={[]}
                schedules={[]}
                variant="View"
                ref={BoqRef}
                clearData={null}
            />
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
                <Grid item xs={2}>
                    Item Code
                </Grid>
                <Grid item xs={3}>
                    Desp
                </Grid>
                <Grid item xs={1.5}>
                    Qty(Boq)
                </Grid>
                <Grid item xs={1.5}>
                    Rev
                </Grid>
                <Grid item xs={1.5}>
                    Total
                </Grid>
                <Grid item xs={1}>
                    Rate
                </Grid>
                <Grid item xs={1.5}>
                    Total
                </Grid>
            </Grid>
            {grp == null && (
                <Content
                    data={data}
                    getRevision={getRevision}
                    openBoq={openBoq}
                />
            )}
            {grp !== null && (
                <Grouped
                    data={data}
                    groupby={grp}
                    getRevision={getRevision}
                    openBoq={openBoq}
                />
            )}
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
                <Grid item xs={5}>
                    Total
                </Grid>
                <Grid item xs={1.5}>
                    {round(
                        sumBy(
                            data,
                            (o) => o.boq.type == "boq" && o.required_qty
                        ),
                        2
                    )}
                </Grid>
                <Grid item xs={1.5}>
                    {round(
                        sumBy(
                            data,
                            (o) => o.boq.type == "revision" && o.required_qty
                        ),
                        2
                    )}
                </Grid>
                <Grid item xs={1.5}>
                    {round(
                        sumBy(data, (o) => o.required_qty),
                        2
                    )}
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={1.5}>
                    {round(
                        sumBy(data, (o) => o.required_qty * o.rate),
                        0
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

const Grouped = ({ data, groupby, getRevision, openBoq }) => {
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
        console.log("Open Array ", open);
    }, [open]);
    useEffect(() => {
        console.log("grouping", Object.entries(groupBy(data, groupby)));
        setState(Object.entries(groupBy(data, groupby)));
    }, [data, groupby]);
    return state.map(([head, details]) => (
        <React.Fragment key={head}>
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
                    xs={5}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpen(head)}
                >
                    {open.includes(head) ? (
                        <ArrowDropUpIcon fontSize="0.5rem" />
                    ) : (
                        <ArrowDropDownIcon fontSize="0.5rem" />
                    )}{" "}
                    {head}
                </Grid>

                <Grid
                    item
                    xs={1.5}
                    children={round(
                        sumBy(
                            details,
                            (o) => o.boq.type == "boq" && o.required_qty
                        ),
                        2
                    )}
                />
                <Grid
                    item
                    xs={1.5}
                    children={round(
                        sumBy(
                            details,
                            (o) => o.boq.type == "revision" && o.required_qty
                        ),
                        2
                    )}
                />
                <Grid
                    item
                    xs={1.5}
                    children={round(
                        sumBy(details, (o) => o.required_qty),
                        2
                    )}
                />
                <Grid item xs={1} />
                <Grid item xs={1.5} textAlign="right">
                    <Typography variant="body1">
                        Rs.
                        {round(
                            sumBy(details, (o) => o.required_qty * o.rate),
                            0
                        )}
                    </Typography>
                </Grid>
            </Grid>
            <Collapse in={open.includes(head) ? true : false}>
                <Content
                    data={details}
                    getRevision={getRevision}
                    openBoq={openBoq}
                />
            </Collapse>
        </React.Fragment>
    ));
};

const QtyDetails = ({ details }) => {
    const [anchor, setAnchor] = useState(null);
    const [state, setState] = useState([]);
    const [total, setTotal] = useState(0);
    useEffect(() => {
        setState(details);
        setTotal(
            round(
                sumBy(details, (o) => parseFloat(o.qty) * parseFloat(o.rate)),
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
                                {`${v.qty} @ ${v.rate}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography variant="subtitle2">
                                {v.qty * v.rate}
                            </Typography>
                        </Grid>
                    </Grid>
                    // </MenuItem>
                ))}
            </Menu>
        </>
    );
};

const Content = ({ data, getRevision, openBoq }) => {
    const filterData =
        data.length > 0 ? data.filter((v) => v.boq.type == "boq") : [];
    return filterData.map((v) => {
        return (
            <Grid
                key={v.id}
                component={Paper}
                container
                columnSpacing={2}
                rowSpacing={0.5}
                justifyContent="center"
                alignItems="center"
                p={1}
                border={0.5}
                borderColor={grey[200]}
            >
                <Grid item xs={2} textAlign="left" px={0}>
                    <Button size="small" onClick={() => openBoq(v)}>
                        {v.boq.item_code}
                    </Button>
                </Grid>
                <Grid item xs={3}>
                    <Tooltip title={v.boq.desp}>
                        <Typography variant="body2" noWrap>
                            {v.boq.desp}
                        </Typography>
                    </Tooltip>
                </Grid>
                <Grid item xs={1.5}>
                    <Typography variant="body2">{v.required_qty}</Typography>
                </Grid>
                <Grid item xs={1.5}>
                    <Typography variant="body2">
                        {getRevision(v.boqs_id)}
                    </Typography>
                </Grid>
                <Grid item xs={1.5}>
                    <Typography variant="body2">
                        {getRevision(v.boqs_id, v.required_qty)}
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    <Typography variant="body2">{v.rate}</Typography>
                </Grid>
                <Grid item xs={1.5}>
                    <Typography variant="body2">
                        {round(
                            getRevision(v.boqs_id, v.required_qty) * v.rate,
                            0
                        )}
                    </Typography>
                </Grid>
            </Grid>
        );
    });
};

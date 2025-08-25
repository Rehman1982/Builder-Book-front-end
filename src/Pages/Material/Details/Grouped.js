import {
    Box,
    Button,
    Grid,
    Menu,
    MenuItem,
    Paper,
    Typography,
} from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { flatMap, groupBy, round, sumBy, uniqBy } from "lodash";
const Grouped = ({ data, groupby }) => {
    const [state, setState] = useState([]);
    useEffect(() => {
        console.log("grouping", Object.entries(groupBy(data, groupby)));
        setState(Object.entries(groupBy(data, groupby)));
    }, [data, groupby]);
    return state.map(([head, details]) => (
        <Box key={head} sx={{ my: 1 }}>
            <Grid container p={1} component={Paper} bgcolor={blue[200]}>
                <Grid item xs={8}>
                    {head}
                </Grid>
                <Grid item xs={4} textAlign="right">
                    <Typography variant="body1">
                        Rs.
                        {sumBy(
                            flatMap(details, (o) => o.journals),
                            (o) => o.qty * o.rate
                        )}
                    </Typography>
                </Grid>
            </Grid>
            <div id="body">
                {details.map((bill) => (
                    <Grid
                        key={bill.id}
                        container
                        p={1}
                        component={Paper}
                        my={0.5}
                    >
                        <Grid item xs={3}>
                            {bill.created_at}
                        </Grid>
                        <Grid item xs={3}>
                            {bill.pb_no}
                        </Grid>
                        <Grid item xs={3}>
                            {round(
                                sumBy(bill.journals, (o) => parseFloat(o.qty)),
                                2
                            )}
                        </Grid>
                        <Grid item xs={3}>
                            <QtyDetails details={bill.journals} />
                        </Grid>
                    </Grid>
                ))}
            </div>
            <div id="footer"></div>
        </Box>
    ));
};
export default Grouped;

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

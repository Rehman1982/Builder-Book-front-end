import { ExpandLessOutlined } from "@mui/icons-material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import {
    TableRow,
    TableCell,
    IconButton,
    Grid,
    Paper,
    Collapse,
    Box,
} from "@mui/material";
import { blueGrey, grey, lightBlue } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import { round } from "lodash";

const FixedAllowances = ({ state }) => {
    const [show, setShow] = useState(false);
    if ("fixedallowances" in state && state.fixedallowances.length > 0) {
        return (
            <Box>
                <Collapse in={show}>
                    {state.fixedallowances.map((v) => (
                        <Grid
                            container
                            p={1.5}
                            key={v.id}
                            // component={Paper}
                            // elevation={3}
                            bgcolor={lightBlue[200]}
                            borderBottom={1}
                            borderColor={grey[100]}
                        >
                            <Grid item xs={1}></Grid>
                            <Grid item xs={5}>
                                {v.allowance.title}
                            </Grid>
                            <Grid item xs={1.5}>
                                {v.amount}
                            </Grid>
                            <Grid item xs={1.5}></Grid>
                            <Grid item xs={1.5}>
                                {v.amount}
                            </Grid>
                            <Grid item xs={1.5}></Grid>
                        </Grid>
                    ))}
                </Collapse>
                <Grid
                    container
                    p={1}
                    // component={Paper}
                    // elevation={3}
                    alignItems="center"
                    bgcolor={lightBlue[200]}
                    borderBottom={1}
                    borderColor={grey[100]}
                >
                    <Grid item xs={1}>
                        <IconButton
                            size="small"
                            onClick={() => setShow((prv) => !prv)}
                        >
                            {show ? (
                                <ExpandLessOutlined />
                            ) : (
                                <ExpandMoreOutlined />
                            )}
                        </IconButton>
                    </Grid>
                    <Grid item xs={8}>
                        Total of Fixed Allowances
                    </Grid>
                    <Grid item xs={1.5}>
                        {state.fixedallowancesTotal}
                    </Grid>
                    <Grid item xs={1.5}>
                        {round(
                            state.fixedallowancesTotal + state.payAbleBasiPay,
                            0
                        )}
                    </Grid>
                </Grid>
            </Box>
        );
    }
};

export default FixedAllowances;

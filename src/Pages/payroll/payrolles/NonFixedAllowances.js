import { ExpandLessOutlined } from "@mui/icons-material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import {
    TableRow,
    TableCell,
    IconButton,
    Collapse,
    Grid,
    Paper,
} from "@mui/material";
import { blueGrey, grey, lightBlue } from "@mui/material/colors";
import { round } from "lodash";
import React, { useState } from "react";

const NonFixedAllowances = ({ state }) => {
    const [show, setShow] = useState(false);
    if ("nonfixedallowances" in state && state.nonfixedallowances.length > 0) {
        return (
            <React.Fragment>
                <Collapse in={show}>
                    {state.nonfixedallowances.map((v) => (
                        <Grid
                            container
                            p={1}
                            // component={Paper}
                            // elevation={3}
                            key={v.id}
                            bgcolor={lightBlue[100]}
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
                            <Grid item xs={1.5}>
                                {v.phRate}
                            </Grid>
                            <Grid item xs={1.5}>
                                {v.total}
                            </Grid>
                            <Grid item xs={1.5}></Grid>
                        </Grid>
                    ))}
                </Collapse>
                <Grid
                    container
                    alignItems="center"
                    bgcolor={lightBlue[100]}
                    p={1}
                    // component={Paper}
                    // elevation={3}
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
                        Total of Non-Fixed Allowances
                    </Grid>
                    <Grid item xs={1.5}>
                        {round(state.nonfixedallowancesTotal, 0)}
                    </Grid>
                    <Grid item xs={1.5}>
                        {round(
                            state.nonfixedallowancesTotal +
                                state.fixedallowancesTotal +
                                state.payAbleBasiPay,
                            0
                        )}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
};

export default NonFixedAllowances;

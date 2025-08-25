import { ExpandLessOutlined } from "@mui/icons-material";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { TableRow, TableCell, IconButton, Collapse, Grid } from "@mui/material";
import { grey, pink } from "@mui/material/colors";
import { round } from "lodash";

import React, { useState } from "react";

const Taxes = ({ state }) => {
    const [show, setShow] = useState(false);
    if ("deductions" in state && state.deductions.length > 0) {
        return (
            <React.Fragment>
                <Collapse in={show}>
                    {state.deductions.map((v) => (
                        <Grid
                            container
                            borderBottom={1}
                            borderColor={grey[100]}
                            key={v.id}
                            bgcolor={pink[200]}
                            p={1}
                            alignItems="center"
                        >
                            <Grid item xs={1}></Grid>
                            <Grid item xs={5}>
                                {v.title}
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
                    borderBottom={1}
                    borderColor={grey[100]}
                    bgcolor={pink[200]}
                    p={1}
                    alignItems="center"
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
                        Total Deduction(s)
                    </Grid>

                    <Grid item xs={1.5}>
                        {round(state.deductionsTotal, 0)}
                    </Grid>
                    <Grid item xs={1.5}>
                        {round(
                            state.nonfixedallowancesTotal +
                                state.fixedallowancesTotal +
                                state.payAbleBasiPay -
                                state.deductionsTotal,
                            0
                        )}
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
};

export default Taxes;

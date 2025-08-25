import React, { useContext, useState, memo } from "react";
import { Divider, Typography, Tooltip, Grid } from "@mui/material";
import { blueGrey, grey, lightGreen, red } from "@mui/material/colors";
// import Tooltip from '@mui/material/Tooltip';
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

import IconButton from "@mui/material/IconButton";

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
// menu includes

const Row = memo(({ mrgn, data, handleClick }) => {
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
                    <Typography variant="subtitle2">{v.desp} </Typography>
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
                    {/* <SideMenu onClick={handleClick} data={v} /> */}
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
export default Row;

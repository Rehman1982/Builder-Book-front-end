import { Box, Grid, Stack, TextField, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";

export const Schedule = ({ schAnalysis }) => {
    useEffect(() => {
        console.log(schAnalysis);
    }, []);
    return (
        <Box width="100%">
            {schAnalysis?.baseQty && schAnalysis?.baseUnit && (
                // <TextField
                //     label="Base Quantity"
                //     defaultValue={`${schAnalysis?.baseQty} / ${schAnalysis?.baseUnit}`}
                //     size="small"
                //     margin="dense"
                // />
                <Typography variant="h6" gutterBottom>
                    Analysis is Based on{" "}
                    {schAnalysis?.baseQty + "/" + schAnalysis?.baseUnit}
                </Typography>
            )}

            <Box width="100%">
                {schAnalysis?.analysis.length > 0 && (
                    <>
                        <Grid
                            container
                            alignItems="center"
                            borderBottom={0.5}
                            p={1}
                        >
                            <Grid item xs={4}>
                                Required Item
                            </Grid>
                            <Grid item xs={3} textAlign="right">
                                Required Qty
                            </Grid>
                            <Grid item xs={2} textAlign="right">
                                Rate
                            </Grid>
                            <Grid item xs={3} textAlign="right">
                                Amount(Rs)
                            </Grid>
                        </Grid>
                        {schAnalysis.analysis.map((v) => {
                            return (
                                <Grid
                                    key={v.id}
                                    container
                                    alignItems="center"
                                    borderBottom={0.5}
                                    p={1}
                                >
                                    <Grid item xs={4}>
                                        {v.item.item}
                                    </Grid>
                                    <Grid item xs={3} textAlign="right">
                                        {v.required_qty}
                                    </Grid>
                                    <Grid item xs={2} textAlign="right">
                                        {v.rate}
                                    </Grid>
                                    <Grid item xs={3} textAlign="right">
                                        {v.required_qty * v.rate}
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </>
                )}
            </Box>
        </Box>
    );
};

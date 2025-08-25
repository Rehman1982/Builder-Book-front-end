import { Close, Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import { blue, green, grey, indigo, orange, red } from "@mui/material/colors";
import React from "react";
import { useState } from "react";

const TransDetails = ({ transactions }) => {
    const [journals, setJournals] = useState([]);
    const [open, setOpen] = useState(false);
    const colors = {
        I: blue[800],
        L: orange[800],
        C: red[800],
        E: indigo[300],
        A: green[800],
    };
    return (
        <Box>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography variant="body1" children="Transaction Details" />
                <IconButton
                    size="small"
                    onClick={() => setOpen(!open)}
                    children={open ? <Visibility /> : <VisibilityOff />}
                />
            </Stack>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>
                    JR Entries
                    <IconButton
                        onClick={() => setOpen(false)}
                        sx={{ position: "absolute", top: 2, right: 2 }}
                        children={<Close color="error" />}
                    />
                </DialogTitle>

                <DialogContent>
                    {transactions.map((trans) => (
                        <Box key={trans.id}>
                            <Typography
                                variant="caption"
                                display="block"
                                fontWeight={800}
                                my={1}
                            >
                                Trans No: {trans.id}
                            </Typography>
                            {trans.journals.map((v, i) => (
                                <Grid
                                    key={i}
                                    container
                                    alignItems="center"
                                    py={0.25}
                                    borderBottom={0.5}
                                    borderColor={grey[400]}
                                >
                                    <Grid item xs={1}>
                                        <Avatar
                                            sx={{
                                                height: 20,
                                                width: 20,
                                                backgroundColor:
                                                    colors[
                                                        v.accounts.type
                                                            .charAt(0)
                                                            .toUpperCase()
                                                    ],
                                                color: grey[50],
                                                padding: 1,
                                            }}
                                            children={
                                                <Typography variant="caption">
                                                    {v.accounts?.type
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </Typography>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={7}>
                                        <Typography
                                            variant="caption"
                                            children={v.accounts.name}
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography
                                            variant="caption"
                                            children={
                                                v.debit > 0 && v.debit + " DR"
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography
                                            variant="caption"
                                            children={
                                                v.credit > 0 && v.credit + " CR"
                                            }
                                        />
                                    </Grid>
                                </Grid>
                            ))}
                        </Box>
                    ))}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default TransDetails;

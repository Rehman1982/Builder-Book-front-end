import { ArrowBackIosNew } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Container,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const InvoiceSetting = () => {
    const navigate = useNavigate();
    const [state, setState] = useState([
        {
            id: "",
            name: "COGS",
            type: "cogs",
            account_id: "",
            account: { id: 12, name: "Account Name", type: "cogs" },
        },
    ]);
    const [accounts, setAccounts] = useState([]);
    const getData = async () => {
        const res = await axios.get(
            route("invoicing.settings.index", { type: "data" })
        );
        if (res.status == 200) {
            setAccounts(res.data.accounts);
            setState(res.data.settings);
        }
    };
    const handleSubmit = async () => {
        const res = await axios.post(route("invoicing.settings.store"), state);
        console.log(res);
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <>
            <Container component={Paper} sx={{ padding: 2 }}>
                <Stack
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    spacing={2}
                    mb={3}
                >
                    <IconButton
                        size="small"
                        sx={{ border: 1, borderColor: blue[800] }}
                        onClick={() => navigate(-1)}
                        children={<ArrowBackIosNew color="primary" />}
                    />
                    <Typography variant="h6" gutterBottom>
                        Settings
                    </Typography>
                </Stack>
                <Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        Type
                                    </TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Account</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {state.map((v, i) => (
                                    <TableRow key={i}>
                                        <TableCell padding="checkbox">
                                            {v.type}
                                        </TableCell>
                                        <TableCell>{v.name}</TableCell>
                                        <TableCell>
                                            <Autocomplete
                                                size="small"
                                                options={accounts.filter(
                                                    (f) =>
                                                        f.type.toLowerCase() ===
                                                        v.type.toLowerCase()
                                                )}
                                                getOptionLabel={(opt) =>
                                                    opt.name
                                                }
                                                value={v.account}
                                                onChange={(e, v) => {
                                                    setState((prv) => {
                                                        let a = [...prv];
                                                        a[i]["account"] = v;
                                                        return a;
                                                    });
                                                }}
                                                renderInput={(params) => (
                                                    <TextField {...params} />
                                                )}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        mt={2}
                    >
                        <Button variant="contained" onClick={handleSubmit}>
                            Update
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </>
    );
};

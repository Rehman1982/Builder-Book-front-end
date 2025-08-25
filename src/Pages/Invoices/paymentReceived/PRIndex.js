import { ArrowBackIosNew, RemoveRedEyeOutlined } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { blue, lightGreen } from "@mui/material/colors";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
// import { Post } from "./Post";
import { useNavigate } from "react-router-dom";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { ReceivePayment } from "./ReceivePayment";

const PRIndex = () => {
    const navigate = useNavigate();
    const [state, setState] = useState([]);
    const [currentInvoice, setCurrentInvoice] = useState(null);
    const getUnPaidInvoices = async () => {
        const res = await axios.get(
            route("invoicing.paymentreceived.index", { type: "data" })
        );
        if (res.status == 200) {
            setState(res.data);
        }
        console.log(res.data);
    };
    useEffect(() => {
        getUnPaidInvoices();
    }, []);

    return (
        <Box>
            <ReceivePayment
                currentInvoice={currentInvoice}
                setCurrentInvoice={setCurrentInvoice}
                refresh={getUnPaidInvoices}
            />
            <Typography variant="h6" mb={1}>
                Payment Received
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead sx={{ backgroundColor: blue[300] }}>
                        <TableRow>
                            <TableCell padding="checkbox"></TableCell>
                            <TableCell>
                                <Typography variant="body1">
                                    Invoice #
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="body1">
                                    Project/Customer
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Stack direction="column">
                                    <Typography variant="body1">
                                        Amount
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        fontSize="0.6rem"
                                        lineHeight="0.6rem"
                                    >
                                        (Tax inclusive)
                                    </Typography>
                                </Stack>
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {state.map((v, i) => (
                            <TableRow key={v.id}>
                                <TableCell padding="checkbox">
                                    <Avatar sx={{ backgroundColor: blue[300] }}>
                                        {i + 1}
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {v.prefix}-{v.date}-{v.number}
                                    </Typography>
                                    <Typography variant="caption">
                                        {v.date}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {v.project.name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {v.customer.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body1">
                                        {parseInt(v.details_sum_amount) +
                                            parseInt(v.totalTaxes || 0)}
                                    </Typography>
                                </TableCell>
                                <TableCell padding="none">
                                    <Button
                                        onClick={() => setCurrentInvoice(v.id)}
                                        color="info"
                                        sx={{
                                            border: 1,
                                            borderColor: blue[200],
                                        }}
                                    >
                                        <CurrencyExchangeIcon />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
export default PRIndex;

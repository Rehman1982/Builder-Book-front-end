import { ArrowBackIosNew, RemoveRedEyeOutlined } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
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
import { Post } from "./Post";
import { useNavigate } from "react-router-dom";

const PostInvoices = () => {
    const navigate = useNavigate();
    const [state, setState] = useState([]);
    const [currentInvoice, setCurrentInvoice] = useState(null);
    const getUnpostedInvoices = async () => {
        const res = await axios.get(
            route("invoicing.postinvoice.index", { type: "data" })
        );
        if (res.status == 200) {
            setState(res.data);
        }
        console.log(res.data);
    };
    useEffect(() => {
        getUnpostedInvoices();
    }, []);

    return (
        <Box>
            {/* <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <IconButton
                    sx={{ border: 1, borderColor: blue[800] }}
                    onClick={() => navigate(-1)}
                    children={<ArrowBackIosNew color="primary" />}
                />
            </Stack> */}
            <Post
                currentInvoice={currentInvoice}
                setCurrentInvoice={setCurrentInvoice}
                refresh={getUnpostedInvoices}
            />
            <Typography variant="body1" mb={1}>
                Post Invoice
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
                                <Typography variant="body1">
                                    Amount (Tax inclusive)
                                </Typography>
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
                                        Post
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
export default PostInvoices;

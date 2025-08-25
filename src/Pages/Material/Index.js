import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { grey, indigo, red } from "@mui/material/colors";
import { Link } from "react-router-dom";
const Index = () => {
    const [state, setState] = useState([]);
    const [errors, setErrors] = useState({});
    useEffect(() => {
        axios
            .get(route("estimation.material.index", { type: "index" }))
            .then((res) => {
                if (res.status == 200) {
                    if (res.data.errors) {
                        setErrors(res.data.errors);
                        // console.log(res.data.errors);
                    } else {
                        setState(res.data);
                        console.log(res.data);
                    }
                }
            });
    }, []);
    return (
        <TableContainer component={Paper}>
            <Table size="small" sx={{ border: 1, borderColor: grey[200] }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: indigo[100] }}>
                        <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                            <Typography variant="body1">
                                Project Name
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                            <Typography textAlign={"right"} variant="body1">
                                Amount(M)
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                            <Typography variant="body1">Action</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {state.map((v) => (
                        <TableRow key={v.project_id}>
                            <TableCell
                                sx={{ border: 1, borderColor: grey[500] }}
                            >
                                <Typography variant="body1">
                                    {v.project.name}
                                </Typography>
                            </TableCell>
                            <TableCell
                                sx={{ border: 1, borderColor: grey[500] }}
                            >
                                <Typography textAlign={"right"} variant="body1">
                                    {(v.Amount / 1000000).toFixed(4)}
                                </Typography>
                            </TableCell>
                            <TableCell
                                sx={{ border: 1, borderColor: grey[500] }}
                            >
                                <Link to={`${v.project_id}`}>
                                    <Button variant="outlined">Details</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                            <Typography variant="body1">Total</Typography>
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                            <Typography textAlign={"right"} variant="body1">
                                {(
                                    state.reduce((t, c) => t + c.Amount, 0) /
                                    1000000
                                ).toFixed(2)}{" "}
                                (M)
                            </Typography>
                        </TableCell>
                        <TableCell sx={{ border: 1, borderColor: grey[500] }}>
                            <Typography variant="body1"></Typography>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
};

export default Index;

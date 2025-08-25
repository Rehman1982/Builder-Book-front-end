import React, { useEffect, useRef, useState } from "react";
import {
    Button,
    Box,
    Dialog,
    Grid,
    Table,
    TableHead,
    TableCell,
    TableContainer,
    Typography,
    Paper,
    TableRow,
    TableFooter,
    TableBody,
    Divider,
    Link,
    Tooltip,
    DialogTitle,
    DialogContent,
} from "@mui/material";
import axios from "axios";
import { amber, grey, yellow } from "@mui/material/colors";
import CreateBoq from "../BOQs/CreateBoq";
import { useCallback } from "react";
import { Materials } from "./Details/Materials";
import { POs } from "./Details/POs";
import { CRBills } from "./Details/CRBills";
import { PBills } from "./Details/PBills";
import { JRs } from "./Details/JRs";
const converDate = (date) => {
    console.log(date);
    const a = new Date(date);
    return a.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};
const Details = ({ project_id, details, setDetails }) => {
    const BoqRef = useRef();
    const [state, setState] = useState([]);
    const [open, setOpen] = useState(false);
    const [boq, setBoq] = useState();
    const openBoq = useCallback((boq) => {
        setBoq(boq.boq);
        BoqRef.current.open();
    }, []);
    const handleClose = () => {
        setOpen(false);
        setState([]);
        setDetails({
            ...details,
            type: "",
            item_id: "",
            item: "",
            unit: "",
            show: false,
        });
    };

    useEffect(() => {
        if (details.show) {
            setOpen(true);
        }
    }, [details.show]);
    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                {/* <DialogTitle>{`${details.itemName} -  ${details.unit}`}</DialogTitle> */}
                <DialogContent>
                    {/* <DialogTitle>{`${details.type}`}</DialogTitle> */}
                    {details.type == "BOQ" && (
                        <>
                            <Typography variant="h6">
                                Material Report
                            </Typography>
                            <Materials
                                project_id={project_id}
                                item_id={details.item_id}
                                unit={details.unit}
                                item_name={details.itemName}
                            />
                        </>
                    )}
                    {details.type == "PO" && (
                        <>
                            <Typography variant="h6">
                                Purchase Orders (POs)
                            </Typography>
                            <POs
                                project_id={project_id}
                                item_id={details.item_id}
                                unit={details.unit}
                                item_name={details.itemName}
                            />
                        </>
                    )}
                    {details.type == "CRBills" && (
                        <>
                            <Typography variant="h6">Credit Bills</Typography>
                            <CRBills
                                project_id={project_id}
                                item_id={details.item_id}
                                unit={details.unit}
                                item_name={details.itemName}
                            />
                        </>
                    )}
                    {details.type == "PBills" && (
                        <>
                            <Typography variant="h6">Purchase Bills</Typography>
                            <PBills
                                project_id={project_id}
                                item_id={details.item_id}
                                unit={details.unit}
                                item_name={details.itemName}
                            />
                        </>
                    )}
                    {details.type == "JRs" && (
                        <>
                            <Typography variant="h6">
                                Journal Entries
                            </Typography>
                            <JRs
                                project_id={project_id}
                                item_id={details.item_id}
                                unit={details.unit}
                                item_name={details.itemName}
                            />
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
export default Details;

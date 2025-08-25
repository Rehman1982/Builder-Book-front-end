import {
    LinearProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
    Button,
    Stack,
} from "@mui/material";
import { amber, blueGrey, grey } from "@mui/material/colors";
import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import ExportToXL from "../partials/ExportToXL";
import Details from "./Details";

const Single = () => {
    const { project_id } = useParams();
    const [projectInfo, setProjectInfo] = useState({});
    const [refresh, setRefresh] = useState(false);
    const [state, setState] = useState([]);
    const [errors, setErrors] = useState({});
    const [details, setDetails] = useState({
        item_id: "",
        itemName: "",
        unit: "",
        type: "",
        show: false,
    });
    const [total, setTotal] = useState({
        material: 0,
        po: 0,
        crbills: 0,
        cash: 0,
        jr: 0,
        net: 0,
    });
    const [progress, setProgress] = useState(false);
    const typo = (type, text) => (
        <Typography
            color={grey[600]}
            variant={type == "heading" ? "h6" : "body1"}
        >
            {text}
        </Typography>
    );
    const optDAta = useMemo(() => {
        return state.map((v, i) => {
            console.log("callbakc");
            return (
                <TableRow key={i}>
                    <TableCell>
                        {typo("body", `${v.item} (${v.unit})`)}
                    </TableCell>
                    <TableCell
                        children={
                            <Button
                                disabled={v.MaterialTotal ? false : true}
                                onClick={() =>
                                    setDetails({
                                        ...details,
                                        type: "BOQ",
                                        item_id: v.item_id,
                                        itemName: v.item,
                                        unit: v.unit,
                                        show: true,
                                    })
                                }
                                children={typo("body", v.MaterialTotal)}
                            />
                        }
                    />
                    <TableCell
                        children={
                            <Button
                                disabled={v.POTotal ? false : true}
                                onClick={() =>
                                    setDetails({
                                        ...details,
                                        type: "PO",
                                        item_id: v.item_id,
                                        itemName: v.item,
                                        unit: v.unit,
                                        show: true,
                                    })
                                }
                                children={typo("body", v.POTotal)}
                            />
                        }
                    />
                    <TableCell
                        children={
                            <Button
                                disabled={v.CRBillTotal ? false : true}
                                onClick={() =>
                                    setDetails({
                                        ...details,
                                        type: "CRBills",
                                        item_id: v.item_id,
                                        itemName: v.item,
                                        unit: v.unit,
                                        show: true,
                                    })
                                }
                                children={typo("body", v.CRBillTotal)}
                            />
                        }
                    />
                    <TableCell
                        children={
                            <Button
                                disabled={v.CashTotal ? false : true}
                                onClick={() =>
                                    setDetails({
                                        ...details,
                                        type: "PBills",
                                        item_id: v.item_id,
                                        itemName: v.item,
                                        unit: v.unit,
                                        show: true,
                                    })
                                }
                                children={typo("body", v.CashTotal)}
                            />
                        }
                    />
                    <TableCell
                        children={
                            <Button
                                disabled={v.JrTotal ? false : true}
                                onClick={() =>
                                    setDetails({
                                        ...details,
                                        type: "JRs",
                                        item_id: v.item_id,
                                        itemName: v.item,
                                        unit: v.unit,
                                        show: true,
                                    })
                                }
                                children={typo("body", v.JrTotal)}
                            />
                        }
                    />
                    <TableCell>
                        {typo(
                            "body",
                            v.MaterialTotal -
                                v.POTotal -
                                v.CashTotal -
                                v.JrTotal
                        )}
                    </TableCell>
                </TableRow>
            );
        });
    }, [state]);
    const getData = async () => {
        setProgress(true);
        try {
            const res = await axios.get(
                route("material.show", {
                    material: 1,
                    project_id: project_id,
                })
            );
            if (res.status == 200) {
                setProjectInfo(res.data.info);
                setState(res.data.data);
                totals(res.data.data, total);
                setProgress(false);
            }
        } catch (error) {
            console.log(error.response.data);
        }
    };
    useEffect(() => {
        getData();
        console.log("single project Called", refresh);
    }, []);
    return (
        <>
            <Details
                project_id={project_id}
                details={details}
                setDetails={setDetails}
            />
            <Stack
                direction={"row"}
                spacing={2}
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography color={blueGrey[600]} variant="h6" gutterBottom>
                    {projectInfo.name}
                </Typography>
                <ExportToXL
                    data={state.map((v, i) => {
                        return {
                            sno: i + 1,
                            "Item Name": v.item,
                            Material: v.MaterialTotal,
                            "POs Quantity": v.POTotal,
                            "Expenses Made": v.JRTotal,
                        };
                    })}
                    fileName={"Material Report"}
                />
            </Stack>
            {progress && <LinearProgress />}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: blueGrey[200] }}>
                        <TableRow>
                            <TableCell>{typo("heading", "Item")}</TableCell>
                            <TableCell>{typo("heading", "Material")}</TableCell>
                            <TableCell>{typo("heading", "PO")}</TableCell>
                            <TableCell>{typo("heading", "CR Bills")}</TableCell>
                            <TableCell>{typo("heading", "PBill")}</TableCell>
                            <TableCell>{typo("heading", "JR")}</TableCell>
                            <TableCell>{typo("heading", "NET")}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody children={optDAta}></TableBody>
                    <TableFooter>
                        <TableRow sx={{ backgroundColor: amber[100] }}>
                            <TableCell>
                                {typo("heading", "Total (M)")}
                            </TableCell>
                            <TableCell>
                                {typo(
                                    "heading",
                                    (total.material / 1000000).toFixed(2)
                                )}
                            </TableCell>
                            <TableCell>
                                {typo(
                                    "heading",
                                    (total.po / 1000000).toFixed(2)
                                )}
                            </TableCell>
                            <TableCell>
                                {typo(
                                    "heading",
                                    (total.crbills / 1000000).toFixed(2)
                                )}
                            </TableCell>
                            <TableCell>
                                {typo(
                                    "heading",
                                    (total.cash / 1000000).toFixed(2)
                                )}
                            </TableCell>
                            <TableCell>
                                {typo(
                                    "heading",
                                    (total.jr / 1000000).toFixed(2)
                                )}
                            </TableCell>
                            <TableCell>
                                {typo(
                                    "heading",
                                    (total.net / 1000000).toFixed(2)
                                )}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </>
    );
};

export default Single;

const totals = (data, total) => {
    return data.reduce((t, c) => {
        t.material += parseInt(c.MaterialTotal);
        t.po += parseInt(c.POTotal) || 0;
        t.crbills += parseInt(c.CRBillTotal) || 0;
        t.cash += parseInt(c.CashTotal) || 0;
        t.jr += parseInt(c.JrTotal) || 0;
        t.net = t.material - t.po - t.cash - t.jr;
        return t;
    }, total);
};

import { Settings } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Container,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { blue, grey, orange } from "@mui/material/colors";
import React from "react";
import { useState } from "react";
import LargeButton from "../helpers/LargeButton";

const EstimationDash = () => {
    const [state, setState] = useState([
        {
            icon: "list",
            text: "Bill of Quantities (BOQs)",
            path: "boq",
        },
        // {
        //     icon: "add",
        //     text: "Create BOQ",
        //     path: "boq",
        // },
        {
            icon: "list",
            text: "Schedules of Rates",
            path: "schedules",
        },
        // {
        //     icon: "add",
        //     text: "Create Schedule",
        //     path: "schedules",
        // },
        {
            icon: "bar_chart",
            text: "Material Predictions Report",
            path: "material",
        },
    ]);
    return (
        <>
            <Grid container columns={12} spacing={2}>
                {state.map((v, i) => (
                    <LargeButton
                        key={i}
                        icon={v.icon}
                        text={v.text}
                        sizes={{ xs: 12 }}
                        path={v.path}
                    />
                ))}
            </Grid>
        </>
    );
};
export default EstimationDash;

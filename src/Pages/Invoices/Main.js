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
import Icon from "@mui/material/Icon";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import LargeButton from "../helpers/LargeButton";

export const Main = () => {
    const [state, setState] = useState([
        {
            icon: "attach_money",
            text: "Invoices",
            path: "invoices",
        },
        {
            icon: "assignment",
            text: "Applicable Taxes",
            path: "applicabletaxes",
        },
        {
            icon: "account_tree",
            text: "Invoice Types",
            path: "invoicetype",
        },
        {
            icon: "payments",
            text: "Post Invoice",
            path: "postinvoice",
        },
        {
            icon: "settings",
            text: "Payment Received",
            path: "paymentreceived",
        },
        {
            icon: "settings",
            text: "Settings",
            path: "settings",
        },
        // {
        //     icon: "signature",
        //     text: "Sequential Approvals",
        //     path: "approvals",
        // },
    ]);
    return (
        <>
            <Grid container columns={12} spacing={2}>
                {state.map((v, i) => (
                    <LargeButton
                        key={i}
                        icon={v.icon}
                        text={v.text}
                        sizes={{ xs: 12, md: 4, lg: 4 }}
                        path={v.path}
                    />
                ))}
            </Grid>
        </>
    );
};

const StyledGrid = ({ icon, text, sizes, path }) => {
    return (
        <Grid item {...sizes} component={Link} to={path}>
            <Stack
                padding={3}
                component={Paper}
                elevation={1}
                justifyContent="flex-start"
                alignItems="center"
                direction="row"
                borderRadius={5}
                sx={{
                    "&:hover": { backgroundColor: grey[200] },
                }}
            >
                <Avatar
                    sx={{
                        padding: 1,
                        mr: 2,
                        backgroundColor: "transparent",
                        border: 2,
                        borderColor: blue[300],
                        width: "auto",
                        height: "auto",
                    }}
                >
                    <Icon
                        style={{
                            fontSize: "2rem",
                            color: blue[300],
                        }}
                    >
                        {icon}
                    </Icon>
                </Avatar>
                <Typography variant="body1">{text}</Typography>
            </Stack>
        </Grid>
    );
};

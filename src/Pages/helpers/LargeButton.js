import { Avatar, Grid, Icon, Paper, Stack, Typography } from "@mui/material";
import { blue, grey, orange } from "@mui/material/colors";
import React from "react";
import { Link } from "react-router-dom";

const LargeButton = ({ icon, text, sizes, path, state }) => {
    return (
        <Grid item {...sizes} component={Link} to={path} state={state}>
            <Stack
                padding={3}
                component={Paper}
                elevation={3}
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
                            color: orange[400],
                        }}
                    >
                        {icon}
                    </Icon>
                </Avatar>
                <Typography variant="body2">{text}</Typography>
            </Stack>
        </Grid>
    );
};
export default LargeButton;

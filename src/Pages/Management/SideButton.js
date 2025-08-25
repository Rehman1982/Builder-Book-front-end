import { Delete, Edit } from "@mui/icons-material";
import { Box, Icon, IconButton, Paper, Typography } from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import _ from "lodash";
import React from "react";

const SideButton = ({ icon = "add_circle", text, action }) => {
    return (
        <Box
            component={Paper}
            elevation={3}
            textAlign={"center"}
            border={1}
            p={1}
            borderColor={"divider"}
            width={"100%"}
            onClick={action}
            bgcolor={blue[500]}
            sx={{
                cursor: "pointer",
                ":hover": {
                    bgcolor: blue[600],
                },
                ":active": { bgcolor: blue[400] },
            }}
        >
            <IconButton sx={{ border: 2, borderColor: grey[100] }}>
                <Icon fontSize="medium" sx={{ color: grey[100] }}>
                    {icon}
                </Icon>
            </IconButton>
            {text && (
                <Typography
                    variant="body1"
                    fontSize={"0.8rem"}
                    noWrap
                    sx={{ color: grey[100], mt: 0.5 }}
                >
                    {text}
                </Typography>
            )}
        </Box>
    );
};
export default SideButton;

import {
    Box,
    Paper,
    Typography,
    Card as MCard,
    CardContent,
    Icon,
    Stack,
    Avatar,
} from "@mui/material";
import { blue, grey, orange } from "@mui/material/colors";
import React from "react";

const Card = ({
    title = "title",
    data = "",
    icon = "directions_run",
    action,
}) => {
    return (
        <MCard
            component={Paper}
            elevation={3}
            sx={{ width: "100%", borderRadius: 2 }}
        >
            <CardContent>
                <Typography
                    // color={blue[700]}
                    variant="body1"
                    fontWeight={600}
                    gutterBottom
                >
                    {title}
                </Typography>
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                >
                    <Typography
                        variant="h5"
                        // fontWeight={800}
                        // color={grey[600]}
                        children={data}
                    />
                    <Avatar sx={{ bgcolor: orange[300] }}>
                        <Icon fontSize="2rem" children={icon} />
                    </Avatar>
                </Stack>
            </CardContent>
        </MCard>
    );
};

export default Card;

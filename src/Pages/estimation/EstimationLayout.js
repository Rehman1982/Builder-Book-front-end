import { Breadcrumbs, Button, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";

import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

export const EstimationLayout = () => {
    return (
        <>
            <Stack
                direction="row"
                justifyContent="center"
                mb={3}
                border={1}
                borderColor={grey[300]}
                py={1}
            >
                <Breadcrumbs separator="|">
                    <Button component={NavLink} to="/public/estimation" end>
                        Dashboard
                    </Button>
                    <Button component={NavLink} to="boq">
                        BOQs
                    </Button>
                    <Button component={NavLink} to="schedules">
                        Schedules
                    </Button>
                    <Button component={NavLink} to="material">
                        Material Report
                    </Button>
                </Breadcrumbs>
            </Stack>
            <Outlet />
        </>
    );
};

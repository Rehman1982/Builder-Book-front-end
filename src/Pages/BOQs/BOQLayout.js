import { Breadcrumbs, Button, Stack } from "@mui/material";

import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

export const BOQLayout = () => {
    return (
        <>
            <Stack direction="row" justifyContent="center">
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

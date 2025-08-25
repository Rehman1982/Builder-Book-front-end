import { Breadcrumbs, Button, Stack } from "@mui/material";
import { grey } from "@mui/material/colors";

import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

const Breadcrumbss = ({ items }) => {
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
                    {items?.map((item, i) => (
                        <Button component={NavLink} to={item.href || "no-link"}>
                            {item.title}
                        </Button>
                    ))}
                    {/* <Button component={NavLink} to="/public/estimation" end>
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
                    </Button> */}
                </Breadcrumbs>
            </Stack>
        </>
    );
};
export default Breadcrumbss;

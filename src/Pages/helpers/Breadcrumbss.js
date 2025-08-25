import { Breadcrumbs, Button, Stack, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";

import React from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const Breadcrumbss = ({ items }) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    return (
        <Breadcrumbs separator="|">
            {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                const isLast = index === pathnames.length - 1;
                return (
                    <>
                        {!isLast && (
                            // <Typography variant="body2">{value}</Typography>
                            <Button component={NavLink} to={to}>
                                {value.toUpperCase()}
                            </Button>
                        )}
                    </>
                );
            })}
        </Breadcrumbs>
    );
};
export default Breadcrumbss;

import { Breadcrumbs, Link } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export const BoqMain = () => {
    return (
        <>
            <Breadcrumbs>
                <Link>Home</Link>
                <Link>About</Link>
            </Breadcrumbs>
            <Outlet />
        </>
    );
};

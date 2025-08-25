import { Box, Breadcrumbs, Button, Link, Stack } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                border={1}
                borderColor={grey[300]}
                borderRadius={1}
                mb={2}
                p={1}
            >
                <Breadcrumbs separator="|">
                    {/* <Button href="main">Home</Button> */}
                    <Button component={NavLink} to="/public/invoicing" end>
                        Dashboard
                    </Button>
                    <Button component={NavLink} to="invoices">
                        Invoices
                    </Button>
                    <Button component={NavLink} to="postinvoice">
                        Post Invoice
                    </Button>
                    <Button component={NavLink} to="paymentreceived">
                        Receive Payment
                    </Button>
                    <Button component={NavLink} to="applicabletaxes">
                        Taxes
                    </Button>
                    <Button component={NavLink} to="invoicetype">
                        Types
                    </Button>
                    <Button component={NavLink} to="settings">
                        Settings
                    </Button>
                </Breadcrumbs>
            </Stack>
            <Outlet />
        </>
    );
};
export default Layout;

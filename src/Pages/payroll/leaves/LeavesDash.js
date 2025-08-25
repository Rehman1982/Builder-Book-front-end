import { Box, Breadcrumbs, Button, Link, styled } from '@mui/material'
import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
const StyledLink = styled(NavLink)(({ theme }) => ({
    textDecoration: "none",
    color: theme.palette.text.secondary,
    fontSize: "1.1rem",
    "&.active": {
        color: theme.palette.primary.main,
        fontSize: "1.1rem",
        fontWeight: 600,
    },
}))
export const LeavesDash = (props) => {
    return (
        <Box>
            <Breadcrumbs sx={{ my: 3 }}>
                <StyledLink to="entitles">Entitlements</StyledLink>
                <StyledLink to="approvals">Approval Stages</StyledLink>
                <StyledLink to="applications">Leave Applications</StyledLink>
            </Breadcrumbs>
            <Box>
                {props.children}
                <Outlet />
            </Box>
        </Box>
    )
}

import React from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Box,
    Chip,
    Icon,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { green, red } from "@mui/material/colors";

const PrivilegesViewer = ({ data }) => {
    return (
        <Box sx={{ mx: "auto", my: 4 }}>
            <Typography variant="h6" gutterBottom>
                {data?.company_name}
            </Typography>
            {data?.privileges.map((priv, idx) => (
                <Accordion key={idx} sx={{ mb: 1, boxShadow: 3 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="body1">
                            {priv.controller_name}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Project</TableCell>
                                    <TableCell>List</TableCell>
                                    <TableCell>View</TableCell>
                                    <TableCell>Create</TableCell>
                                    <TableCell>Edit</TableCell>
                                    <TableCell>Delete</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {priv.actions.map((action, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {action.project_name || (
                                                <Chip
                                                    label="Global Access"
                                                    color="info"
                                                    size="small"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {action.List === "1" ? (
                                                <Icon
                                                    sx={{
                                                        color: green[600],
                                                    }}
                                                >
                                                    check
                                                </Icon>
                                            ) : (
                                                <Icon
                                                    sx={{
                                                        color: red[800],
                                                    }}
                                                >
                                                    close
                                                </Icon>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {action.View === "1" ? (
                                                <Icon
                                                    sx={{
                                                        color: green[600],
                                                    }}
                                                >
                                                    check
                                                </Icon>
                                            ) : (
                                                <Icon
                                                    sx={{
                                                        color: red[800],
                                                    }}
                                                >
                                                    close
                                                </Icon>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {action.Create === "1" ? (
                                                <Icon
                                                    sx={{
                                                        color: green[600],
                                                    }}
                                                >
                                                    check
                                                </Icon>
                                            ) : (
                                                <Icon
                                                    sx={{
                                                        color: red[800],
                                                    }}
                                                >
                                                    close
                                                </Icon>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {action.Edit === "1" ? (
                                                <Icon
                                                    sx={{
                                                        color: green[600],
                                                    }}
                                                >
                                                    check
                                                </Icon>
                                            ) : (
                                                <Icon
                                                    sx={{
                                                        color: red[800],
                                                    }}
                                                >
                                                    close
                                                </Icon>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {action.Delete === "1" ? (
                                                <Icon
                                                    sx={{
                                                        color: green[600],
                                                    }}
                                                >
                                                    check
                                                </Icon>
                                            ) : (
                                                <Icon
                                                    sx={{
                                                        color: red[800],
                                                    }}
                                                >
                                                    close
                                                </Icon>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default PrivilegesViewer;

import {
    Box,
    Menu,
    TextField,
    Button,
    Stack,
    Typography,
    Icon,
    ButtonGroup,
} from "@mui/material";
import React, { useState } from "react";

const FilterForm = ({ filters, setFilters }) => {
    const [currentFilters, setCurrent] = useState({ ...filters });
    const [open, setOpen] = useState(null);
    return (
        <Box>
            <Button variant="contained" onClick={(e) => setOpen(e.target)}>
                Filters
            </Button>
            <Menu
                sx={{ mt: 0.5 }}
                open={Boolean(open)}
                anchorEl={open}
                onClose={() => setOpen(null)}
            >
                <Stack direction={"column"} sx={{ p: 2 }}>
                    <Typography variant="body2">Where</Typography>
                    <TextField
                        value={currentFilters?.project || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                project: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="Project Name"
                    />
                    <Typography variant="body2">and</Typography>
                    <TextField
                        value={currentFilters?.vendor || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                vendor: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="Vendor Name"
                    />
                    <Typography variant="body2">and</Typography>
                    <TextField
                        value={currentFilters?.user || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                user: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="User Name"
                    />
                    <Typography variant="body2">and</Typography>
                    <TextField
                        value={currentFilters?.bill || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                bill: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="Bill No."
                    />
                    <Typography variant="body2">and</Typography>
                    <TextField
                        value={currentFilters?.po_id || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                po_id: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="PO No."
                    />
                    <Typography variant="body2">and</Typography>
                    <TextField
                        multiline
                        rows={3}
                        value={currentFilters?.text || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                text: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="Text in Description"
                    />
                </Stack>
                <ButtonGroup fullWidth variant="outlined" sx={{ px: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setFilters(null);
                            setOpen(null);
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setFilters(currentFilters);
                            setOpen(null);
                        }}
                    >
                        Submit
                    </Button>
                </ButtonGroup>
            </Menu>
        </Box>
    );
};

export default FilterForm;

import {
    Box,
    Menu,
    TextField,
    Button,
    Stack,
    Typography,
    Icon,
    ButtonGroup,
    IconButton,
} from "@mui/material";
import { blue } from "@mui/material/colors";
import _ from "lodash";
import React, { forwardRef, useEffect, useState } from "react";

const FilterForm = forwardRef(({ filters, setFilters }, ref) => {
    const [currentFilters, setCurrent] = useState({ ...filters });
    const [open, setOpen] = useState(null);
    return (
        <Box>
            <IconButton
                onClick={(e) => setOpen(e.currentTarget)}
                sx={{ border: 1, borderColor: blue[600] }}
            >
                <Icon sx={{ color: blue[600] }}>filter_alt</Icon>
            </IconButton>
            <Menu
                sx={{ mt: 0.5 }}
                open={Boolean(open)}
                anchorEl={open}
                onClose={() => setOpen(null)}
            >
                <Stack direction={"column"} sx={{ p: 2 }}>
                    <Typography variant="body2">Where</Typography>
                    <TextField
                        value={currentFilters?.JRNo || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                JRNo: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="JR No."
                    />
                    <TextField
                        value={currentFilters?.trans || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                trans: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="Trans No."
                    />
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
                    {/* <Typography variant="body2">and</Typography> */}
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
                    {/* <Typography variant="body2">and</Typography> */}
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
                    {/* <Typography variant="body2">and</Typography> */}
                    <TextField
                        value={currentFilters?.item || ""}
                        onChange={(e) =>
                            setCurrent({
                                ...currentFilters,
                                item: e.target.value,
                            })
                        }
                        margin="dense"
                        size="small"
                        label="Item Name"
                    />
                    {/* <Typography variant="body2">and</Typography> */}

                    {/* <Typography variant="body2">and</Typography> */}
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
                        label="Text"
                    />
                    <Stack direction={"row"} alignItems={"center"} mt={1}>
                        <TextField
                            size="small"
                            value={currentFilters?.debit?.opr}
                            onChange={(e) =>
                                setCurrent((prv) => {
                                    let update = { ...prv };
                                    update["debit"]["opr"] = e.target.value;
                                    return update;
                                })
                            }
                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option key="0" value={"="}>
                                {"="}
                            </option>
                            <option key="1" value={">"}>
                                {">"}
                            </option>
                            <option key="2" value={"<"}>
                                {"<"}
                            </option>
                            <option key="3" value={"<>"}>
                                {"<>"}
                            </option>
                        </TextField>
                        <TextField
                            size="small"
                            value={currentFilters?.debit?.value}
                            onChange={(e) =>
                                setCurrent((prv) => {
                                    let update = { ...prv };
                                    update["debit"]["value"] = e.target.value;
                                    return update;
                                })
                            }
                            label="DR"
                        />
                    </Stack>
                    <Stack direction={"row"} alignItems={"center"} mt={1}>
                        <TextField
                            size="small"
                            value={currentFilters?.credit?.opr}
                            onChange={(e) =>
                                setCurrent((prv) => {
                                    let update = { ...prv };
                                    update["credit"]["opr"] = e.target.value;
                                    return update;
                                })
                            }
                            select
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option key="0" value={"="}>
                                {"="}
                            </option>
                            <option key="1" value={">"}>
                                {">"}
                            </option>
                            <option key="2" value={"<"}>
                                {"<"}
                            </option>
                            <option key="3" value={"<>"}>
                                {"<>"}
                            </option>
                        </TextField>
                        <TextField
                            size="small"
                            value={currentFilters?.credit?.value}
                            onChange={(e) =>
                                setCurrent((prv) => {
                                    let update = { ...prv };
                                    update["credit"]["value"] = e.target.value;
                                    return update;
                                })
                            }
                            label="CR"
                        />
                    </Stack>
                </Stack>
                <ButtonGroup fullWidth variant="outlined" sx={{ px: 1 }}>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setFilters(null);
                            setCurrent({});
                            setOpen(null);
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setOpen(null);
                            setFilters(currentFilters);
                        }}
                    >
                        Submit
                    </Button>
                </ButtonGroup>
            </Menu>
        </Box>
    );
});

export default FilterForm;

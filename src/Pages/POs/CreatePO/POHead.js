import { Autocomplete, Box, TextField } from "@mui/material";

import _ from "lodash";

const POHead = ({ po, setPo, selects }) => {
    return (
        <Box>
            <Autocomplete
                options={selects?.assigned_projects || []}
                getOptionLabel={(option) => option.name}
                value={po?.project || null}
                onChange={(e, v) => setPo({ ...po, project: v })}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Project"
                        margin="dense"
                        required
                    />
                )}
            />
            <Autocomplete
                options={selects?.vendors || []}
                getOptionLabel={(option) => option.name}
                value={po?.vendor || null}
                onChange={(e, v) => setPo({ ...po, vendor: v })}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Vendor"
                        margin="dense"
                        required
                    />
                )}
            />
            <TextField
                label="Ref No."
                value={po.ref || ""}
                onChange={(e) => setPo({ ...po, ref: e.target.value })}
                fullWidth
                margin="dense"
            />
            <TextField
                type="date"
                label="Expires On"
                value={po.expiry_date || ""}
                onChange={(e) => setPo({ ...po, expiry_date: e.target.value })}
                fullWidth
                margin="dense"
                required
            />
            <TextField
                label="Description"
                multiline
                rows={3}
                value={po.description || ""}
                onChange={(e) => setPo({ ...po, description: e.target.value })}
                fullWidth
                margin="dense"
            />
        </Box>
    );
};
export default POHead;

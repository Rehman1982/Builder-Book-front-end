import { Autocomplete, Box, TextField } from "@mui/material";

import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { setPOHead } from "../../../features/purchseOrders/poSlice";

const POHead = () => {
    const dispatch = useDispatch();
    const po = useSelector((state) => state.purchaseOrder.createPo.po);
    const projects = useSelector((state) => state.purchaseOrder.projects);
    const vendors = useSelector((state) => state.purchaseOrder.vendors);
    return (
        <Box>
            <Autocomplete
                options={projects || []}
                getOptionLabel={(option) => option.name}
                value={po?.project || null}
                onChange={(e, v) => dispatch(setPOHead({ ...po, project: v }))}
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
                options={vendors || []}
                getOptionLabel={(option) => option.name}
                value={po?.vendor || null}
                onChange={(e, v) => dispatch(setPOHead({ ...po, vendor: v }))}
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
                value={po?.ref || ""}
                onChange={(e) =>
                    dispatch(setPOHead({ ...po, ref: e.target.value }))
                }
                fullWidth
                margin="dense"
            />
            <TextField
                type="date"
                label="Expires On"
                value={po?.expiry_date || ""}
                onChange={(e) =>
                    dispatch(setPOHead({ ...po, expiry_date: e.target.value }))
                }
                fullWidth
                margin="dense"
                required
            />
            <TextField
                label="Description"
                multiline
                rows={3}
                value={po?.description || ""}
                onChange={(e) =>
                    dispatch(setPOHead({ ...po, description: e.target.value }))
                }
                fullWidth
                margin="dense"
            />
        </Box>
    );
};
export default POHead;

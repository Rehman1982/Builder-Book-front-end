import {
    Grid,
    Stack,
    Typography,
    Divider,
    IconButton,
    Paper,
    Box,
    FormControl,
    Autocomplete,
    Button,
    TextField,
    Dialog,
    DialogContent,
    DialogTitle,
    Tabs,
    Tab,
    DialogActions,
} from "@mui/material";

import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { amber, grey, lime, purple, red } from "@mui/material/colors";
import React from "react";
import { useState } from "react";
import BOQ from "./BOQ";
import { Schedule } from "./Schedule";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import { useEffect } from "react";
forwardRef();
// const Header = ({
//     shouldlock,
//     baseForAnalysis,
//     setBaseForAnalysis,
//     calculateReqQty,
//     errors,
//     state,
//     setState,
//     setAnalysis,
// }) => {
//     return (
//         <Stack direction="row" spacing={2}>
//             <TextField
//                 // disabled={shouldlock}
//                 name="base_qty"
//                 value={baseForAnalysis.base_qty}
//                 onChange={(e) => {
//                     setBaseForAnalysis({
//                         ...baseForAnalysis,
//                         base_qty: e.target.value,
//                     });
//                 }}
//                 onBlur={calculateReqQty}
//                 sx={{ width: "33%" }}
//                 margin="dense"
//                 size="small"
//                 label="Base Qty"
//                 error={"base_qty" in errors}
//                 helperText={
//                     "base_qty" in errors && errors.base_qty.map((e) => e)
//                 }
//             />
//             <TextField
//                 // disabled={shouldlock}
//                 name="base_unit"
//                 value={baseForAnalysis.base_unit}
//                 onBlur={calculateReqQty}
//                 onChange={(e) => {
//                     setBaseForAnalysis({
//                         ...baseForAnalysis,
//                         base_unit: e.target.value,
//                     });
//                 }}
//                 sx={{ width: "33%" }}
//                 margin="dense"
//                 size="small"
//                 label="Unit"
//                 error={"base_unit" in errors}
//                 helperText={
//                     "base_unit" in errors && errors.base_unit.map((e) => e)
//                 }
//             />
//             <TextField
//                 name="cf"
//                 type="number"
//                 value={baseForAnalysis.cf}
//                 onBlur={calculateReqQty}
//                 onChange={(e) => {
//                     setBaseForAnalysis({
//                         ...baseForAnalysis,
//                         cf: e.target.value,
//                     });
//                 }}
//                 sx={{ width: "34%" }}
//                 margin="dense"
//                 size="small"
//                 label={`Coversion Factor (${state.boqunit} to ${baseForAnalysis.base_unit})`}
//                 error={"cf" in errors}
//                 helperText={"cf" in errors && errors.cf.map((e) => e)}
//             />
//         </Stack>
//     );
// };
const Analysis = forwardRef(
    (
        {
            boq,
            itms,
            boqAnalysis,
            setBoqAnalysis,
            schAnalysis,
            variant,
            errors,
        },
        ref
    ) => {
        const [activeTab, setActiveTab] = useState(0);

        const [open, setOpen] = useState(false);
        useImperativeHandle(ref, () => ({
            openAnalysis() {
                setOpen(true);
            },
            closeAnalysis() {
                setOpen(false);
            },
        }));
        return (
            <>
                <Dialog
                    open={open}
                    onClose={() => setOpen(false)}
                    fullWidth
                    maxWidth="md"
                >
                    <DialogTitle>{variant + " "}Analysis </DialogTitle>
                    <DialogContent>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                value={activeTab}
                                onChange={(e, value) => setActiveTab(value)}
                            >
                                <Tab label="BOQ" value={0} />
                                {schAnalysis && (
                                    <Tab label="Schedule" value={1} />
                                )}
                            </Tabs>
                        </Box>
                        <Box mt={2} minHeight={300}>
                            {activeTab == 0 && (
                                <BOQ
                                    variant={variant}
                                    itms={itms}
                                    boq={boq}
                                    schAnalysis={schAnalysis}
                                    boqAnalysis={boqAnalysis}
                                    setBoqAnalysis={setBoqAnalysis}
                                    errors={errors}
                                />
                            )}
                            {activeTab == 1 && (
                                <Schedule
                                    variant={variant}
                                    schAnalysis={schAnalysis}
                                />
                            )}
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setOpen(false);
                            }}
                            variant="contained"
                        >
                            Back
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
);
const TabContainer = (props) => {
    <div role="tabpanel" id={`tab-${props.index}`}>
        {props.value === props.index && (
            <Box sx={{ p: 3 }}>{props.children}</Box>
        )}
    </div>;
};

export default Analysis;

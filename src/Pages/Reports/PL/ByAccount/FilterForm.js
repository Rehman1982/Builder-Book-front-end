import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import React from "react";
import { useEffect } from "react";
import { use } from "react";
import _, { set } from "lodash";
import { blue, grey, orange } from "@mui/material/colors";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import API from "../../../../api/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { useReportPartialsQuery } from "../../../../features/reports/reportApi";
import {
  setBusinessType,
  setProjectId,
  setProjectStatus,
} from "../../../../features/reports/plReportSlice";

const FilterForm = (props, ref) => {
  const dispatch = useDispatch();
  // global State
  const { businessType, projectId, projectStatus } = useSelector(
    (state) => state.plReportSlice
  );
  // Local State
  const [show, setShow] = React.useState(false);

  // API Call
  const { data = [], isLoading, isError } = useReportPartialsQuery({});
  const { businesses, projects, status } = data;
  useEffect(() => {
    console.log(data);
  }, [data]);
  // UI Renders
  return (
    <>
      <Button variant="outlined" onClick={() => setShow(true)}>
        Filter
      </Button>
      <Dialog
        open={show}
        onClose={() => setShow(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          <Stack>
            <Autocomplete
              options={businesses || []}
              getOptionLabel={(opt) => opt || "NO-Name"}
              value={businessType || ""}
              renderInput={(params) => (
                <TextField {...params} label="Business Type" margin="dense" />
              )}
              onChange={(e, value) => {
                dispatch(setBusinessType(value));
              }}
            />
            <Autocomplete
              options={status || []}
              getOptionLabel={(opt) => opt.status || ""}
              value={projectStatus || "All"}
              renderInput={(params) => (
                <TextField {...params} label="Project Status" margin="dense" />
              )}
              onChange={(e, value) => {
                // props.setPrStatus(value);
                dispatch(setProjectStatus(value));
              }}
            />
            <Autocomplete
              options={projects || []}
              getOptionLabel={(option) => option.name || ""}
              value={projectId || ""}
              renderInput={(params) => (
                <TextField {...params} label="Projects" margin="dense" />
              )}
              onChange={(e, value) => {
                dispatch(setProjectId(value));
              }}
            />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default FilterForm;

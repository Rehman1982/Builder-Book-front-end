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

const FilterForm = React.forwardRef((props, ref) => {
  const [show, setShow] = React.useState(false);
  const [businessTypes, setBusinessTypes] = React.useState(null);
  const [projects, setProjects] = React.useState([
    { id: 99, name: "abc" },
    { id: 102, name: "xyz" },
  ]);
  const [projectStatus, setProjectStatus] = React.useState([]);
  const [aggPeriods, setAggPeriods] = React.useState([
    "Current Year",
    "Current Month",
    "Current Week",
    "Today",
    "Last Year",
    "Last Month",
    "Last Week",
    "Last Day",
  ]);
  useImperativeHandle(ref, () => ({
    open: () => {
      setShow(true);
    },
  }));
  const getBusinessTypes = async () => {
    try {
      const res = await API.get("reports/profitloss/byproject", {
        params: {
          type: "getBusinessType",
        },
      });
      console.log(res.data);
      setBusinessTypes(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getProjects = async () => {
    try {
      const res = await API.get("reports/profitloss/byproject", {
        params: {
          type: "getProject",
          business_type: props.selectedBusiness,
          status: props.prstatus,
        },
      });
      console.log(res.data);
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getPrStatus = async () => {
    try {
      const res = await API.get("reports/profitloss/byproject", {
        params: {
          type: "getPrStatus",
          business_type: props.selectedBusiness,
        },
      });
      console.log(res.data);
      setProjectStatus(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = () => {};
  useEffect(() => {
    getBusinessTypes();
    getPrStatus();
  }, []);
  useEffect(() => {
    getProjects();
  }, [props.selectedBusiness, props.prstatus]);
  return (
    <Dialog
      open={show}
      onClose={() => setShow(false)}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            minHeight: 500,
          },
        },
      }}
      PaperProps={{
        sx: {
          backgroundColor: grey[50],
          color: grey[900],
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogContent>
        <Grid
          container
          alignItems={"center"}
          component={"fieldset"}
          border={1}
          borderColor="divider"
          borderRadius={2}
          p={2}
          mb={2}
        >
          <Chip
            component={"legend"}
            label="Filter Options"
            sx={{ width: "30%" }}
          />
          <Grid item xs={12} textAlign={"right"}>
            {props.loading && "Loading ..."}
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={businessTypes?.map((option) =>
                option == null ? (option = "No-Name") : option
              )}
              value={props.selectedBusiness || "All"}
              renderInput={(params) => (
                <TextField {...params} label="Business Type" margin="dense" />
              )}
              onChange={(e, value) => {
                props.setBusinessType(value == "All" ? null : value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={projectStatus}
              value={props.prstatus || "All"}
              renderInput={(params) => (
                <TextField {...params} label="Project Status" margin="dense" />
              )}
              onChange={(e, value) => {
                props.setPrStatus(value);
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              options={projects}
              getOptionLabel={(option) => option.name}
              value={props.selectedProject || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={`${props.selectedBusiness || "All"} -> ${
                    props.prstatus || ""
                  } Projects`}
                  margin="dense"
                />
              )}
              onChange={(e, value) => {
                props.setProject(value);
              }}
            />
          </Grid>
        </Grid>

        <Grid
          container
          component={"fieldset"}
          border={1}
          borderColor="divider"
          borderRadius={2}
          p={2}
        >
          <Chip
            component={"legend"}
            label="Reporting Period"
            sx={{ width: "30%" }}
          />
          <Grid item xs={12}>
            <Autocomplete
              options={aggPeriods}
              value={props?.AggPeriod || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Reporting Period"
                  margin="dense"
                />
              )}
              onChange={(e, value) => {
                props.setAggPeriod(value);
                props.setPeriod({
                  from: null,
                  to: null,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} textAlign={"center"}>
            OR
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="datef"
                type={"date"}
                label="From"
                margin="dense"
                value={props.period.from || ""}
                onChange={(e) => {
                  props.setPeriod({
                    ...props.period,
                    from: e.target.value,
                  });
                  props.setAggPeriod(null);
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="datet"
                type="date"
                margin="dense"
                label="To"
                value={props.period.to || ""}
                onChange={(e) => {
                  props.setPeriod({
                    ...props.period,
                    to: e.target.value,
                  });
                  props.setAggPeriod(null);
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      {/* <DialogActions>
                <Button variant="contained">Update</Button>
                <Button onClick={() => setShow(false)} variant="outlined">
                    Close
                </Button>
            </DialogActions> */}
    </Dialog>
  );
});
export default FilterForm;

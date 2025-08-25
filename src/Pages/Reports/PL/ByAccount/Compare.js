import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { set } from "lodash";
import { useEffect } from "react";
import API from "../../../../api/axiosApi";

export const Compare = (props) => {
  const [open, setOpen] = React.useState(false);
  const [period, setPeriod] = React.useState({
    from: null,
    to: null,
  });
  const fetchData = async () => {
    props.setLoading(true);
    // setError(null);
    try {
      const res = await API.get("reports/profitloss", {
        params: {
          type: "data",
          business_type: props.business_type,
          project_id: props.project_id,
          period: props.comPeriod,
          aggregatedPeriod: props.aggregatedPeriod,
          prStatus: props.currrentprstatus,
        },
      });
      if (res.status == 200) {
        setOpen(false);
        console.log(res.data);
        props.setCompare(res.data);
      }
    } catch (error) {
      console.log(error);
      // setError(error);
    } finally {
      props.setLoading(false);
    }
  };
  useEffect(() => {
    if (props.comPeriod.from || props.comPeriod.to) {
      fetchData();
    }
  }, [
    props.business_type,
    props.project_id,
    props.aggregatedPeriod,
    props.currrentprstatus,
  ]);
  return (
    <Box>
      <Button
        onClick={() => {
          setOpen(true);
        }}
        color="primary"
      >
        Compare With
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Box
            component={"fieldset"}
            border={1}
            borderColor={"divider"}
            p={2}
            borderRadius={2}
          >
            <Chip
              label="Select Period"
              variant="outlined"
              component={"legend"}
              sx={{ width: "auto" }}
            />
            <TextField
              type="date"
              name="from"
              value={props?.comPeriod.from || ""}
              onChange={(e) => {
                props.setComPeriod({
                  ...props.comPeriod,
                  from: e.target.value,
                });
              }}
              label="From"
              fullWidth
              margin="dense"
            />
            <TextField
              type="date"
              name="to"
              value={props?.comPeriod.to || ""}
              onChange={(e) => {
                props.setComPeriod({
                  ...props.comPeriod,
                  to: e.target.value,
                });
              }}
              label="To"
              fullWidth
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => fetchData()}>Compare</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

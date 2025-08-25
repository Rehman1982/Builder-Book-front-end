import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import axios from "axios";
import dayjs from "dayjs";
import _ from "lodash";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import API from "../../../../api/axiosApi";
const MoreDetails = forwardRef((props, ref) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([]);
  const [groupData, setGroupData] = useState([]);
  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }));
  const grouping = (by) => {
    setGroupData([]);
    const GroupedData = _.groupBy(state, `${by}`);
    setGroupData(GroupedData);
    console.log(GroupedData);
  };
  const fetchData = async (params) => {
    setState([]);
    console.log("wehrerClauses", props);
    setLoading(true);
    try {
      const res = await API.get("reports/liability/byproject/show", {
        params: {
          byproject: 1,
          project_id: props.project_id,
          whereClauses: props.whereClauses,
        },
      });
      console.log("More details returned data", res.data);
      if (res.status == 200) {
        setState(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth>
      <DialogTitle>
        {props?.title}
        <Box>
          <Button onClick={() => grouping("item_name")}>Item</Button>
          <Button onClick={() => grouping("vendor_name")}>Vendor</Button>
          <Button onClick={() => grouping("user_name")}>user</Button>
          <Button onClick={() => grouping("account_name")}>AC</Button>
        </Box>
      </DialogTitle>
      <DialogTitle>
        <Header />
      </DialogTitle>
      <DialogContent>
        <GrpData data={groupData} />
        <NonGrpData data={state} />
      </DialogContent>
      <DialogTitle>
        <Grid
          container
          p={1}
          borderBottom={1}
          borderColor={"divider"}
          bgcolor={orange[300]}
        >
          <Grid item xs={6}>
            Total
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            {_.sumBy(state, (v) => Number(v.credit))}
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            {_.sumBy(state, (v) => Number(v.debit))}
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            {_.sumBy(state, (v) => Number(v.credit - v.debit))}
          </Grid>
        </Grid>
      </DialogTitle>
    </Dialog>
  );
});
export default React.memo(MoreDetails);
/// functions

const Header = () => (
  <Grid
    container
    p={1}
    borderBottom={1}
    borderColor={"divider"}
    bgcolor={orange[300]}
  >
    <Grid item xs={2}></Grid>
    <Grid item xs={4}>
      Desp
    </Grid>
    <Grid item xs={2} textAlign={"right"}>
      Credit
    </Grid>
    <Grid item xs={2} textAlign={"right"}>
      Debit
    </Grid>
    <Grid item xs={2} textAlign={"right"}>
      Total
    </Grid>
  </Grid>
);

const GrpData = ({ data }) => {
  return (
    <Box>
      {Object.entries(data).map(([Header, data]) => (
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h6">{Header}</Typography>
            {data.map((item) => (
              <Grid
                alignItems={"center"}
                container
                p={1}
                borderBottom={1}
                borderColor={"divider"}
                key={Math.random()}
              >
                <Grid item xs={2}>
                  <Stack direction={"column"}>
                    {item.trans_no && (
                      <Typography variant="body2">
                        TR # : {item.trans_no}
                      </Typography>
                    )}
                    {item.bill_no && (
                      <Typography variant="body2">
                        Bill #: {item.bill_no}
                      </Typography>
                    )}
                    {item.entry_no > 0 && (
                      <Typography variant="body2">
                        JR #: {item.entry_no}
                      </Typography>
                    )}
                    {item.payment_no && (
                      <Typography variant="body2">
                        PY#:{item.payment_no}
                      </Typography>
                    )}
                    {item.created_at && (
                      <Typography variant="body2">
                        DT: {dayjs(item.created_at).format("DD-MM-YYYY")}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={4}>
                  {item.desp && item.desp}
                </Grid>
                <Grid item xs={2} textAlign={"right"}>
                  {item.credit}
                </Grid>
                <Grid item xs={2} textAlign={"right"}>
                  {item.debit}
                </Grid>
                <Grid item xs={2} textAlign={"right"}>
                  {Number(item.credit - item.debit)}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

const NonGrpData = ({ data }) => {
  return data?.map((item) => (
    <Grid
      alignItems={"center"}
      container
      p={1}
      borderBottom={1}
      borderColor={"divider"}
      key={Math.random()}
    >
      <Grid item xs={2}>
        <Stack direction={"column"}>
          {item.trans_no && (
            <Typography variant="body2">TR # : {item.trans_no}</Typography>
          )}
          {item.bill_no && (
            <Typography variant="body2">Bill #: {item.bill_no}</Typography>
          )}
          {item.entry_no > 0 && (
            <Typography variant="body2">JR #: {item.entry_no}</Typography>
          )}
          {item.payment_no && (
            <Typography variant="body2">PY#:{item.payment_no}</Typography>
          )}
          {item.created_at && (
            <Typography variant="body2">
              DT: {dayjs(item.created_at).format("DD-MM-YYYY")}
            </Typography>
          )}
        </Stack>
      </Grid>
      <Grid item xs={4}>
        {item.desp && item.desp}
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        {item.credit}
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        {item.debit}
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        {Number(item.credit - item.debit)}
      </Grid>
    </Grid>
  ));
};

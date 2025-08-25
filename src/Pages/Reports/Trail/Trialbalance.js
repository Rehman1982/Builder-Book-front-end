import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Button,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  Autocomplete,
  TableFooter,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import { blue, orange } from "@mui/material/colors";
import React, { useMemo } from "react";
import _ from "lodash";

import { useEffect } from "react";

import dayjs from "dayjs";
import API from "../../../api/axiosApi";
import { useReportTrailbalanceQuery } from "../../../features/reports/reportApi";
import PageLayout from "../../../components/ui/PageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  openDetails,
  setDefaults,
} from "../../../features/reports/reportSlice";
import Details from "../Report/Details";
const Trialbalance = () => {
  const dispatch = useDispatch();
  // golabl State

  // Local State
  const [million, setMillion] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [reportType, setReportType] = React.useState(null);
  const [as_of, setAsOf] = React.useState(dayjs().format("YYYY-MM-DD"));
  // API Call
  const {
    data = [],
    isLoading,
    isError,
  } = useReportTrailbalanceQuery({
    isIndexpage: true,
    reportType: reportType,
    as_of: as_of,
  });
  // function
  const state = useMemo(() => {
    console.log(data);
    if (isLoading) return [];
    if (isError) return [];
    if (million) {
      return data.map((v) => ({
        ...v,
        debit: _.round(String(v.debit) / 1000000, 2),
        credit: _.round(String(v.credit) / 1000000, 2),
        balance: _.round(String(v.balance) / 1000000, 2),
      }));
    }

    return data;
  }, [data, million]);
  // Render
  useEffect(() => {
    dispatch(
      setDefaults({
        endpoint: "reports/trailbalance",
      })
    );
  }, []);
  return (
    <>
      <Details />
      <Paper sx={{ p: 2 }}>
        <PageLayout
          create={
            <>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={million}
                    onChange={(e) => setMillion(e.target.checked)}
                    name="million"
                  />
                }
                label="in Millions"
                labelPlacement="end"
                sx={{ ml: 2 }}
              />
              <FilterForm
                reportType={reportType}
                setReportType={setReportType}
                setAsOf={setAsOf}
                as_of={as_of}
              />
            </>
          }
          left={
            <>
              <Heading
                reportType={reportType}
                setReportType={setReportType}
                as_of={as_of}
                setAsOf={setAsOf}
              />
            </>
          }
        >
          <Contents state={state} />
        </PageLayout>
      </Paper>
    </>
  );
};
export default Trialbalance;

const Heading = (props) => {
  return (
    <Box>
      <Typography variant="body1">
        {props?.as_of ? `As of ${props?.as_of}` : "Up to Date"}
      </Typography>
      <Typography variant="body1">
        {props?.reportType === "all_accounts"
          ? "All Accounts"
          : "Minimal Report"}
      </Typography>
    </Box>
  );
};

const Contents = ({ state }) => {
  const dispatch = useDispatch();

  return (
    <TableContainer>
      <Table size="small">
        <TableHead bgcolor={blue[50]}>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell></TableCell>
            <TableCell>Debit</TableCell>
            <TableCell>Credit</TableCell>
            <TableCell>Balance</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state?.map((v, i) => (
            <TableRow key={i}>
              <TableCell>{v.type.toUpperCase()}</TableCell>
              <TableCell>
                {v.acctname ? (
                  <Button
                    onClick={() => {
                      dispatch(
                        openDetails({
                          title: v.acctname || "",
                          condition: { key: "account_id", value: v.id },
                          groupOn: "user_id",
                        })
                      );
                    }}
                  >
                    {v.acctname}
                  </Button>
                ) : (
                  ""
                )}
              </TableCell>
              <TableCell>{v.debit}</TableCell>
              <TableCell>{v.credit}</TableCell>
              <TableCell>
                {v.acctname ? (
                  v.balance
                ) : (
                  <Button
                    onClick={() => {
                      dispatch(
                        openDetails({
                          title: v.type || "",
                          condition: { key: "c.type", value: v.type },
                          groupOn: "account_id",
                        })
                      );
                    }}
                  >
                    {v.balance}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter bgcolor={orange[50]}>
          <TableRow>
            <TableCell colSpan={2} children="Total" />
            <TableCell>
              {_.round(
                _.sumBy(state, (i) => Number(i.debit)),
                2
              )}
            </TableCell>
            <TableCell>
              {_.round(
                _.sumBy(state, (i) => Number(i.credit)),
                2
              )}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

const FilterForm = (props) => {
  const [open, setOpen] = React.useState(false);
  const [reportType, setReportType] = React.useState(null);
  const [as_of, setAsOf] = React.useState(null);
  useEffect(() => {
    if (props?.reportType) {
      setReportType(props.reportType);
    }
    if (props?.as_of) {
      setAsOf(props.as_of);
    }
  }, []);
  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outlined" sx={{ mb: 1 }}>
        Filter
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogContent>
          <Autocomplete
            fullWidth
            options={["all_accounts", "minimal_report"]}
            value={props?.reportType || "Minimal Report"}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Report Type"
                variant="outlined"
                margin="dense"
                fullWidth
              />
            )}
            onChange={(event, value) => {
              setReportType(value);
            }}
          />
          <TextField
            label="Up to"
            value={as_of || ""}
            type="date"
            margin="dense"
            onChange={(e) => setAsOf(e.target.value)}
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              props.setReportType(reportType);
              props.setAsOf(as_of);
              setOpen(false);
            }}
          >
            Apply
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

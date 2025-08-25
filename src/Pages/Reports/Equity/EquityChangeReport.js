import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Grid,
  Stack,
  TextField,
  Skeleton,
} from "@mui/material";
import { blue, orange } from "@mui/material/colors";
import { useState } from "react";
import PeriodSelector from "../../helpers/PeriodSelector";
import axios from "axios";
import { useEffect } from "react";
import dayjs from "dayjs";
import _ from "lodash";
import MyLoader from "../../helpers/MyLoader";
import API from "../../../api/axiosApi";
import PageLayout from "../../../components/ui/PageLayout";
import { useDispatch } from "react-redux";
import { useReportEquitychangeQuery } from "../../../features/reports/reportApi";

export default function EquityChangeReport({ reportData }) {
  const dispatch = useDispatch();
  // global State

  // Local State
  const [str, setStr] = useState("");
  const [period, setPeriod] = useState({
    from: dayjs().startOf("year").format("YYYY-MM-DD"),
    to: dayjs().endOf("year").format("YYYY-MM-DD"),
  });

  // API Calls
  const {
    data = [],
    isLoading,
    isFetching,
  } = useReportEquitychangeQuery({
    period: period,
  });
  const state = useMemo(() => {
    if (isLoading) return [];
    if (isFetching) return [];
    if (str) {
      return _.filter(data, (o) => o.display_name.toLowerCase().includes(str));
    }
    return data;
  }, [data, str]);
  return (
    <>
      <Paper sx={{ p: 2 }}>
        <PageLayout period={period} setPeriod={(v) => setPeriod(v)}>
          <Box>
            <Grid
              container
              alignItems={"center"}
              p={2}
              sx={{ bgcolor: blue[100] }}
              borderBottom={1}
              borderColor={"divider"}
            >
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  size="small"
                  value={str || ""}
                  placeholder="Search..."
                  onChange={(e) => setStr(e.target.value.toLowerCase())}
                />
              </Grid>
              <Grid item xs={2} textAlign={"right"} fontWeight={800}>
                <Typography variant="body1">Opening Balance</Typography>
              </Grid>
              <Grid item xs={2} textAlign={"right"} fontWeight={800}>
                <Typography variant="body1">Contribution</Typography>
              </Grid>
              <Grid item xs={2} textAlign={"right"} fontWeight={800}>
                <Typography variant="body1">Closing Balance</Typography>
              </Grid>
            </Grid>

            {isLoading || isFetching ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} sx={{ my: 1 }} height={60} />
              ))
            ) : (
              <Contents state={state} />
            )}
            {state.length > 0 && <Total state={state} />}
          </Box>
        </PageLayout>
      </Paper>
    </>
  );
}

const Contents = ({ state }) => {
  return state?.map((item, index) => (
    <Grid
      key={index}
      container
      alignItems={"center"}
      p={2}
      borderBottom={1}
      borderColor={"divider"}
    >
      <Grid item xs={6}>
        <Typography variant="body1">{item.display_name}</Typography>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Typography variant="body1">{item.OpeningBalance}</Typography>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Typography variant="body1">{item.contribution}</Typography>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Typography variant="body1">
          {Number(item.OpeningBalance) + Number(item.contribution)}
        </Typography>
      </Grid>
    </Grid>
  ));
};

const Total = ({ state }) => {
  return (
    <Grid container alignItems={"center"} p={2} sx={{ bgcolor: orange[200] }}>
      <Grid item xs={6}>
        <Typography variant="body1" fontWeight={700}>
          Total
        </Typography>
      </Grid>
      <Grid item xs={2} textAlign={"right"} fontWeight={700}>
        <Typography variant="body1">
          {_.sumBy(state, (v) => Number(v.OpeningBalance))}
        </Typography>
      </Grid>
      <Grid item xs={2} textAlign={"right"} fontWeight={700}>
        <Typography variant="body1">
          {_.sumBy(state, (v) => Number(v.contribution))}
        </Typography>
      </Grid>
      <Grid item xs={2} textAlign={"right"} fontWeight={700}>
        <Typography variant="body1">
          {_.sumBy(
            state,
            (v) => Number(v.OpeningBalance) + Number(v.contribution)
          )}
        </Typography>
      </Grid>
    </Grid>
  );
};

import {
  Box,
  Grid,
  Typography,
  Container,
  Collapse,
  Paper,
  Divider,
  Switch,
  FormLabel,
  Button,
} from "@mui/material";
import { blue, green, orange } from "@mui/material/colors";
import axios from "axios";

import React, { useEffect, useMemo, useState } from "react";
import PeriodSelector from "../../helpers/PeriodSelector";
import dayjs from "dayjs";
import MyLoader from "../../helpers/MyLoader";
import API from "../../../api/axiosApi";
import _ from "lodash";
import PageLayout from "../../../components/ui/PageLayout";
import { useDispatch, useSelector } from "react-redux";
import { useReportCashflowQuery } from "../../../features/reports/reportApi";
import {
  openDetails,
  setDefaults,
  setPeriod,
} from "../../../features/reports/reportSlice";
import Details from "../Report/Details";

const Report = () => {
  const dispatch = useDispatch();
  // gloabl State
  const { period } = useSelector((S) => S.reportSlice);
  // Local State
  const [inMillions, setInMillions] = useState(false);
  // API Call
  const {
    data = [],
    isLoading,
    isFetching,
  } = useReportCashflowQuery({
    isIndexPage: true,
    period: period,
  });

  // functions
  const state = useMemo(() => {
    if (isLoading) return [];
    if (isFetching) return [];
    console.log(data);
    if (inMillions) {
      return data.map((v) => ({
        ...v,
        credit: _.round(String(v.credit) / 1000000, 2),
        debit: _.round(String(v.debit) / 1000000, 2),
        net: _.round(String(v.net) / 1000000, 2),
        value: _.round(String(v.value) / 1000000, 2),
      }));
    }
    return data;
  }, [data, inMillions]);
  useEffect(() => {
    dispatch(
      setDefaults({
        endpoint: "reports/cashflow",
      })
    );
  }, []);
  return (
    <>
      <Details />
      <Paper sx={{ p: 2 }} elevation={3}>
        <PageLayout
          create={
            <FormLabel>
              <Switch
                checked={inMillions}
                onChange={(v, check) => {
                  setInMillions(check);
                }}
              />
              <Typography variant="caption">Million</Typography>
            </FormLabel>
          }
          period={period}
          setPeriod={(v) => dispatch(setPeriod(v))}
        >
          {isLoading || isFetching ? <MyLoader /> : <Contents state={state} />}
        </PageLayout>
      </Paper>
    </>
  );
};

export default Report;
const Contents = ({ state }) => {
  return (
    <>
      <Box>
        {Object.entries(_.groupBy(state, (v) => v.type)).map(([head, data]) => (
          <CollapsableBox key={head} head={head} data={data} />
        ))}
        <Grid component={Paper} bgcolor={green[200]} container p={2}>
          <Grid item xs={8}>
            <Typography variant="body1">Closing Cash Balance</Typography>
          </Grid>
          <Grid item xs={4} textAlign={"right"}>
            <Typography variant="body1">
              {_.chain(state)
                .sumBy((v) => Number(v.value))
                .round(2)
                .value()}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
const CollapsableBox = ({ head, data }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(null);
  return (
    <Box mb={0.5}>
      <Collapse in={open}>
        <Typography
          variant="body1"
          fontWeight={600}
          gutterBottom
          onClick={() => setOpen(!open)}
          sx={{ cursor: "pointer" }}
          m={1}
        >
          {head.toUpperCase()}
        </Typography>
        <Box pl={2}>
          {data?.map((item) => (
            <Grid
              key={item.id}
              container
              p={1}
              borderBottom={1}
              borderColor={"divider"}
            >
              <Grid item xs={4}>
                <Button
                  sx={{ p: 0 }}
                  onClick={() => {
                    console.log(item);
                    dispatch(
                      openDetails({
                        title: item.display_name,
                        condition: [
                          { key: "c.type", value: item.account_type },
                          { key: "account_id", value: item.id },
                        ],
                        groupOn: "account_id",
                      })
                    );
                  }}
                >
                  <Typography variant="body1">{item.name}</Typography>
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="caption">
                  {"DR: " + item?.debit || ""}
                </Typography>
                <Typography variant="caption">
                  {" - CR: " + item?.credit || ""}
                </Typography>
              </Grid>
              <Grid item xs={4} textAlign={"right"}>
                <Typography variant="body1">{item.value}</Typography>
              </Grid>
            </Grid>
          ))}
        </Box>
      </Collapse>
      <Grid
        component={Paper}
        container
        p={1}
        onClick={() => setOpen(!open)}
        sx={{ cursor: "pointer" }}
        bgcolor={blue[50]}
      >
        <Grid item xs={8}>
          <Typography variant="body1">{head}</Typography>
        </Grid>
        <Grid item xs={4} textAlign={"right"}>
          <Typography variant="body1">
            {_.chain(data)
              .sumBy((v) => Number(v.value))
              .round(2)
              .value()}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

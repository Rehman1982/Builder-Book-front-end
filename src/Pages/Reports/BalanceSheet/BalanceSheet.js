import {
  Box,
  Grid,
  Container,
  Typography,
  Divider,
  Stack,
  Autocomplete,
  TextField,
  Backdrop,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Switch,
  FormLabel,
} from "@mui/material";
import { blue, green, grey, orange, red } from "@mui/material/colors";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";

import dayjs from "dayjs";

import PageLayout from "../../../components/ui/PageLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  openDetails,
  setDefaults,
  setPeriod,
} from "../../../features/reports/reportSlice";
import { useReportBalancesheetQuery } from "../../../features/reports/reportApi";
import Details from "../Report/Details";

const BalanceSheet = () => {
  const dispatch = useDispatch();
  // gloabal State
  const { period } = useSelector((S) => S.reportSlice);
  // Local State
  const [inMillions, setInMillions] = useState(false);
  // const [period, setPeriod] = useState({ to: dayjs().format("YYYY-MM-DD") });
  // const [currentperiod, setCurrentPeriod] = React.useState({
  //   to: dayjs().format("YYYY-MM-DD"),
  // });

  // API Calls
  const {
    data = [],
    isLoading,
    isFetching,
  } = useReportBalancesheetQuery(
    {
      isIndexpage: true,
      period: period,
    },
    { skip: !period }
  );
  // Function
  const state = useMemo(() => {
    if (isLoading) return [];
    if (isFetching) return [];
    if (inMillions) {
      return {
        ...data,
        assets: data.assets.map((v) => ({
          ...v,
          balance: _.round(String(v.balance / 1000000), 3),
        })),
        liabilities: data.liabilities.map((v) => ({
          ...v,
          balance: _.round(String(v.balance / 1000000), 3),
        })),
        equity: data.equity.map((v) => ({
          ...v,
          balance: _.round(String(v.balance / 1000000), 3),
        })),
      };
    }
    console.log(data);
    return data;
  }, [data, inMillions]);
  useEffect(() => {
    dispatch(setPeriod({ to: dayjs().format("YYYY-MM-DD") }));
    dispatch(
      setDefaults({
        endpoint: "reports/balancesheet",
      })
    );
  }, []);

  // Renders

  return (
    <>
      <Details />
      <Backdrop open={isLoading || isFetching}>
        <CircularProgress />
      </Backdrop>
      <PageLayout
        period={period}
        setPeriod={(v) => dispatch(setPeriod({ to: v.to }))}
        create={
          <FormLabel>
            <Typography variant="caption">Millions</Typography>
            <Switch
              color="success"
              checked={inMillions}
              onChange={(v, check) => {
                setInMillions(check);
              }}
            />
          </FormLabel>
        }
      >
        <Contents state={state} />
      </PageLayout>
    </>
  );
};
export default BalanceSheet;
const Contents = ({ state }) => {
  return (
    <Stack direction={"row"} justifyContent={"space-between"} spacing={2}>
      <Stack
        component={Paper}
        elevation={3}
        p={2}
        flexGrow={1}
        borderRadius={2}
      >
        <Typography variant="h6"> Assets</Typography>
        <Assets data={state.assets} />
      </Stack>

      <Stack
        component={Paper}
        elevation={3}
        p={2}
        flexGrow={1}
        borderRadius={2}
        justifyContent="space-evenly"
      >
        <Typography variant="h6"> Liability + Equity</Typography>
        <Liabilities data={state.liabilities} />
        <Divider sx={{ my: 1 }} />
        <Equity data={state.equity} />
        <Divider sx={{ my: 1 }} />

        <ListItem dense divider sx={{ bgcolor: red[100] }}>
          <ListItemText primary="Liabilities + Equities" />
          <Typography variant="body2">
            {_.chain(state.liabilities)
              .sumBy((i) => Number(i.balance))
              .round(3)
              .value() +
              _.chain(state.equity)
                .sumBy((i) => Number(i.balance))
                .round(3)
                .value()}
          </Typography>
        </ListItem>
      </Stack>
    </Stack>
  );
};

const Assets = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <>
      <List sx={{ maxHeight: "65vh", overflow: "auto" }}>
        {data?.map((asset) => (
          <ListItem key={asset.id} dense divider>
            <ListItemText primary={asset.acctname} />
            <Button
              sx={{ p: 0 }}
              onClick={() => {
                dispatch(
                  openDetails({
                    title: asset.acctname,
                    condition: [
                      { key: "c.type", value: asset.type },
                      { key: "account_id", value: asset.id },
                    ],

                    groupOn: "user_id",
                  })
                );
              }}
            >
              {asset.balance}
            </Button>
          </ListItem>
        ))}
      </List>
      <ListItem dense divider sx={{ bgcolor: green[100] }}>
        <ListItemText primary="Total Assets" />
        <Typography variant="body2">
          {_.chain(data)
            .sumBy((i) => Number(i.balance))
            .round(3)
            .value()}
        </Typography>
      </ListItem>
    </>
  );
};
const Liabilities = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <>
      <List
        dense
        subheader="Liabilities"
        sx={{ maxHeight: "25vh", overflow: "auto" }}
      >
        {data?.map((asset) => (
          <ListItem key={asset.id} dense divider>
            <ListItemText primary={asset.acctname} />
            <Button
              sx={{ p: 0 }}
              onClick={() => {
                dispatch(
                  openDetails({
                    title: asset.acctname,
                    condition: [
                      { key: "c.type", value: asset.type },
                      { key: "account_id", value: asset.id },
                    ],

                    groupOn: "user_id",
                  })
                );
              }}
            >
              {asset.balance}
            </Button>
          </ListItem>
        ))}
      </List>
      <ListItem dense divider sx={{ bgcolor: blue[100] }}>
        <ListItemText primary="Total Liabilities" />
        <Typography variant="body2">
          {_.chain(data)
            .sumBy((i) => Number(i.balance))
            .round(3)
            .value()}
        </Typography>
      </ListItem>
    </>
  );
};
const Equity = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <>
      <List subheader="Equities" sx={{ maxHeight: "25vh", overflow: "auto" }}>
        {data
          ?.filter((v) => v.acctname !== "Retained Earning")
          .map((asset) => (
            <ListItem key={asset.id} dense divider>
              <ListItemText primary={asset.acctname} />
              <Button
                sx={{ p: 0 }}
                onClick={() => {
                  dispatch(
                    openDetails({
                      title: asset.acctname,
                      condition: [
                        { key: "c.type", value: asset.type },
                        { key: "account_id", value: asset.id },
                      ],

                      groupOn: "user_id",
                    })
                  );
                }}
              >
                {asset.balance}
              </Button>
            </ListItem>
          ))}
      </List>
      <ListItem dense divider sx={{ bgcolor: orange[100] }}>
        <ListItemText primary="Total Equities" />
        <Typography variant="body2">
          {_.chain(data)
            .sumBy((i) => {
              if (i.acctname !== "Retained Earning") return Number(i.balance);
            })
            .round(2)
            .value()}
        </Typography>
      </ListItem>
      <Divider sx={{ my: 0.2 }} />
      <ListItem dense divider sx={{ bgcolor: orange[100] }}>
        <ListItemText primary="Retained Earning" />
        <Typography variant="body2">
          {_.get(
            _.find(data, (o) => o.acctname === "Retained Earning"),
            "balance"
          )}
        </Typography>
      </ListItem>
    </>
  );
};

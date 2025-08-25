import {
  Button,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { blue, green, grey, orange } from "@mui/material/colors";
import FilterForm from "../../FilterForm";
import { Compare } from "./Compare";

import PageLayout from "../../../../components/ui/PageLayout";
import { useDispatch, useSelector } from "react-redux";
import { useReportPlbyAccountQuery } from "../../../../features/reports/reportApi";
import Details from "../../Report/Details";
import {
  openDetails,
  setDefaults,
  setPeriod,
} from "../../../../features/reports/reportSlice";

const ProfitLoss = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setDefaults({
        endpoint: "reports/profitloss/byaccount",
        groupOn: "project_id",
        // period: period,
      })
    );
  }, [props]);

  // global States
  const { conditions, groupOn, period } = useSelector(
    (state) => state.reportSlice
  );
  const [inMillions, setInMillions] = useState(false);
  const {
    data = [],
    isLoading,
    isFetching,
    isError,
  } = useReportPlbyAccountQuery({
    indexPage: true,
    conditions: conditions,
    groupby: groupOn,
    period: period,
  });
  const state = useMemo(() => {
    if (isLoading) return [];
    if (isFetching) return [];
    if (isError) return [];
    if (inMillions) {
      return {
        income: data.income.map((v) => ({
          ...v,
          net: _.round(String(v.net) / 1000000, 2),
        })),
        cogs: data.cogs.map((v) => ({
          ...v,
          net: _.round(String(v.net) / 1000000, 2),
        })),
      };
    }
    return data;
  }, [data, inMillions, isError, isLoading]);
  return (
    <>
      <Details />
      <Paper sx={{ padding: 1 }}>
        <PageLayout
          period={period}
          setPeriod={(v) => {
            dispatch(setPeriod(v));
          }}
          left={
            <Stack>
              <FirstRow />
            </Stack>
          }
          create={
            <>
              <FilterForm />
              <FormControlLabel
                control={<Switch checked={inMillions} />}
                label="Millions"
                onChange={(e) => {
                  setInMillions(e.target.checked);
                }}
                sx={{ marginLeft: 2 }}
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
export default ProfitLoss;

const Contents = ({ state }) => {
  return (
    <List disablePadding>
      <Income income={state?.income} />
      <Divider sx={{ my: 1 }} />
      <Cogs cogs={state?.cogs} />
      <Divider sx={{ my: 1 }} />
      <Net income={state?.income} cogs={state?.cogs} />
    </List>
  );
};

const Income = ({ income }) => {
  const dispatch = useDispatch();
  return (
    <>
      <ListItem divider sx={{ bgcolor: blue[200] }}>
        <ListItemText primary="Income" />
      </ListItem>
      {income?.map((item) => (
        <ListItem key={item.id} divider sx={{ bgcolor: blue[50], py: 0.2 }}>
          <ListItemButton
            onClick={() => {
              dispatch(
                openDetails({
                  title: item.account_name,
                  condition: { key: "account_id", value: item.id },
                  groupOn: "account_id",
                })
              );
            }}
            disableGutters
            sx={{ p: 0 }}
          >
            <ListItemText primary={item.account_name} />
            <Typography variant="body2">{item?.net}</Typography>
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem divider sx={{ bgcolor: blue[200] }}>
        <ListItemText primary="Total Income" />
        <Typography>
          {_.round(
            _.sumBy(income, (o) => +String(o.net)),
            2
          )}
        </Typography>
      </ListItem>
    </>
  );
};
const Cogs = ({ cogs }) => {
  const dispatch = useDispatch();
  return (
    <>
      <ListItem divider sx={{ bgcolor: orange[200] }}>
        <ListItemText primary="Cost of Goods" />
      </ListItem>
      {cogs?.map((item) => (
        <ListItem key={item.id} divider sx={{ bgcolor: orange[50], py: 0.2 }}>
          <ListItemButton
            onClick={() => {
              dispatch(
                openDetails({
                  title: item.account_name,
                  condition: { key: "account_id", value: item.id },
                  groupOn: "account_id",
                })
              );
            }}
            disableGutters
            sx={{ p: 0 }}
          >
            <ListItemText primary={item.account_name} />
            <Typography variant="body2">{item?.net}</Typography>
          </ListItemButton>
        </ListItem>
      ))}
      <ListItem divider sx={{ bgcolor: orange[200] }}>
        <ListItemText primary="Total Cost" />
        <Typography>
          {_.round(
            _.sumBy(cogs, (o) => +String(o.net)),
            2
          )}
        </Typography>
      </ListItem>
    </>
  );
};
const Net = ({ income, cogs }) => {
  const TotalIncome = _.sumBy(income, (o) => +String(o.net));
  const TotalCogs = _.sumBy(cogs, (o) => +String(o.net));
  return (
    <>
      <ListItem divider sx={{ bgcolor: green[200] }}>
        <ListItemText primary="Net Profit/Loss" />
        <Typography>{_.round(TotalIncome - TotalCogs, 2)}</Typography>
      </ListItem>
    </>
  );
};
const GridRow = (props) => {
  const dispatch = useDispatch();
  return (
    <Grid
      container
      justifyContent="start"
      alignItems="center"
      px={1}
      py={0.5}
      borderBottom={0.5}
      borderColor={"grey.500"}
      {...props}
    >
      <Grid item xs={6} sm={6} md={8} lg={9}>
        <Button
          onClick={() => {
            dispatch(
              openDetails({
                title: props.title,
                condition: { key: "account_id", value: props.id },
                groupOn: "account_id",
              })
            );
          }}
          sx={{ p: 0 }}
          variant="text"
        >
          {props.title}
        </Button>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={4}
        lg={3}
        display={"flex"}
        justifyContent="flex-end"
      >
        {/* {props.value} */}
        {props.value}
      </Grid>
    </Grid>
  );
};

const FirstRow = () => {
  const { conditions, partials } = useSelector((state) => state.reportSlice);
  const business = conditions.find((b) => b.key === "link")?.value || null;
  const status = conditions.find((b) => b.key === "p.status")?.value || null;
  const project_id =
    conditions.find((b) => b.key === "project_id")?.value || null;
  return (
    <Stack>
      {project_id ? (
        <Typography>
          {"Project:   " + _.find(partials.projects, { id: project_id })?.name}
        </Typography>
      ) : (
        <Stack>
          {business && <Typography>{`Business: ${business}`}</Typography>}
          {status && <Typography>{`Project Status : ${status}`}</Typography>}
        </Stack>
      )}
    </Stack>
  );
};
const SecondRow = (props) => {
  return (
    <Grid container>
      <Grid item xs={6} lg={8} md={8} sm={8}>
        {props.currentBusinessType ? (
          <Typography variant="h6">{props.currentBusinessType}</Typography>
        ) : (
          <Typography variant="h6">{"All Type of Business"}</Typography>
        )}
        {props.currentProject && (
          <Typography variant="h6">{props.currentProject?.name}</Typography>
        )}
      </Grid>
    </Grid>
  );
};

const CompareRow = (props) => {
  const value = props.value;
  const compare = props.compare?.Total;
  const diff = _.round(value - compare, 2);
  return (
    <Grid
      container
      spacing={1}
      justifyContent={"flex-end"}
      alignItems={"center"}
      columns={3}
    >
      <Grid item>{value} - </Grid>
      <Grid item>{compare}</Grid>
      <Grid item>
        {" "}
        ={" "}
        {diff < 0 ? (
          <>
            {diff} <ArrowDownwardIcon sx={{ color: "red", fontSize: 20 }} />
          </>
        ) : (
          <>
            {`(${diff})`}{" "}
            <ArrowUpwardIcon sx={{ color: "green", fontSize: 20 }} />
          </>
        )}
      </Grid>
    </Grid>
  );
};

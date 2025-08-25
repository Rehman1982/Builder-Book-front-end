import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import _, { eq, set } from "lodash";
import { blue, grey, orange } from "@mui/material/colors";
import FilterForm from "./FilterForm";
import { Compare } from "./Compare";
import { use } from "react";
import API from "../../../../api/axiosApi";

const ProfitLoss = () => {
  const [compare, setCompare] = React.useState([]);
  const [comPeriod, setComPeriod] = React.useState({ from: null, to: null });
  const [state, setSate] = React.useState([]);
  const [inMillions, setInMillions] = React.useState(false);
  const [hide, setHide] = React.useState({
    greterThan: null,
    lessThan: null,
    equal: null,
  });
  const [business_type, setBusinessType] = React.useState([]);
  const [currentBusinessType, setCurrentBusinessType] = React.useState(null);
  const [currentProject, setCurrentProject] = React.useState(null);
  const [currrentprstatus, setCurrentPrStatus] = React.useState(null);
  const [period, setPeriod] = React.useState({
    from: null,
    to: null,
  });
  const [aggregatedPeriod, setAggregatedPeriod] = React.useState(null); // currentYear, currentMonth, currentWeek, today, prviousYear, previousMonth, previousWeek, lastDay
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("reports/profitloss/bybusiness", {
        params: {
          type: "data",
          business_type: currentBusinessType,
          project_id: currentProject?.id,
          period: period,
          aggregatedPeriod: aggregatedPeriod,
          prStatus: currrentprstatus,
        },
      });
      console.log(res.data);
      setSate(res.data);
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [
    currentBusinessType,
    currentProject,
    period,
    currrentprstatus,
    aggregatedPeriod,
  ]);

  useEffect(() => {
    if (inMillions) {
      setSate(
        state?.map((item) => {
          item.cogs = _.round(item.cogs / 1000000, 2);
          item.income = _.round(item.income / 1000000, 2);
          item.net = _.round(item.net / 1000000, 2);
          return item;
        })
      );
      setCompare(
        compare?.map((item) => {
          item.cogs = _.round(item.cogs / 1000000, 2);
          item.income = _.round(item.income / 1000000, 2);
          item.net = _.round(item.net / 1000000, 2);
          return item;
        })
      );
    } else {
      setCompare(
        compare?.map((item) => {
          item.cogs = _.round(item.cogs * 1000000, 2);
          item.income = _.round(item.income * 1000000, 2);
          item.net = _.round(item.net * 1000000, 2);
          return item;
        })
      );
      fetchData();
    }
  }, [inMillions]);

  return (
    <Box sx={{ padding: 2 }}>
      <Backdrop
        open={loading}
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <FirstRow
        setCurrentBusinessType={setCurrentBusinessType}
        currentBusinessType={currentBusinessType}
        currentProject={currentProject}
        setCurrentProject={setCurrentProject}
        loading={loading}
        period={period}
        setPeriod={setPeriod}
        currrentprstatus={currrentprstatus}
        setCurrentPrStatus={setCurrentPrStatus}
        aggregatedPeriod={aggregatedPeriod}
        setAggregatedPeriod={setAggregatedPeriod}
        compare={compare}
        setCompare={setCompare}
        comPeriod={comPeriod}
        setComPeriod={setComPeriod}
        setLoading={setLoading}
      />
      <Divider sx={{ my: 1 }} />
      <SecondRow
        currentBusinessType={currentBusinessType}
        currentProject={currentProject}
        setBusinessType={setCurrentBusinessType}
        inMillions={inMillions}
        setInMillions={setInMillions}
        period={period}
        currrentprstatus={currrentprstatus}
      />

      <HeaderRow bgcolor={blue[300]} />
      {state.map((item) => (
        <GridRow
          key={Math.random()}
          item={item}
          compare={_.find(compare, { id: item.id })}
        />
      ))}
      <FooterRow state={state} compare={compare} />
    </Box>
  );
};
export default ProfitLoss;

const GridRow = (props) => {
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
      <Grid item xs={6} sm={6} md={6} lg={6}>
        {props?.item?.business_name}
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        {/* {props.income} */}
        {props?.compare ? (
          <>
            <Typography variant="body1">{props?.item?.income}</Typography>
            <Typography variant="body1">{props?.compare?.income}</Typography>
          </>
        ) : (
          props?.item?.income
        )}
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        {/* {props.cogs} */}
        {props?.compare ? (
          <>
            <Typography variant="body1">{props?.item?.cogs}</Typography>
            <Typography variant="body1">{props?.compare?.cogs}</Typography>
          </>
        ) : (
          props?.item?.cogs
        )}
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        {props?.compare ? (
          <>
            <Typography variant="body1">{props?.item?.net}</Typography>
            <Typography variant="body1">{props?.compare?.net}</Typography>
          </>
        ) : (
          props?.item?.net
        )}
      </Grid>
    </Grid>
  );
};
const HeaderRow = (props) => {
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
      <Grid item xs={6} sm={6} md={6} lg={6}>
        Business Title
      </Grid>
      <Grid
        item
        xs={2}
        sm={2}
        md={2}
        lg={2}
        display={"flex"}
        justifyContent="flex-end"
      >
        Income
      </Grid>
      <Grid
        item
        xs={2}
        sm={2}
        md={2}
        lg={2}
        display={"flex"}
        justifyContent="flex-end"
      >
        COGS
      </Grid>
      <Grid
        item
        xs={2}
        sm={2}
        md={2}
        lg={2}
        display={"flex"}
        justifyContent="flex-end"
      >
        Net Pofit/Loss
      </Grid>
    </Grid>
  );
};
const FooterRow = ({ state, compare }) => {
  const [totals, setTotals] = React.useState({
    income: 0,
    cogs: 0,
    net: 0,
    cincome: 0,
    ccogs: 0,
    cnet: 0,
  });
  useEffect(() => {
    setTotals({
      income: _.round(
        _.reduce(state, (sum, n) => (sum += Number(n.income)), 0),
        2
      ),
      cogs: _.round(
        _.reduce(state, (sum, n) => (sum += Number(n.cogs)), 0),
        2
      ),
      net: _.round(
        _.reduce(state, (sum, n) => (sum += Number(n.net)), 0),
        2
      ),
    });
    if (compare.length > 0) {
      setTotals({
        ...totals,
        cincome: _.round(
          _.reduce(compare, (sum, n) => (sum += Number(n.income)), 0),
          2
        ),
        ccogs: _.round(
          _.reduce(compare, (sum, n) => (sum += Number(n.cogs)), 0),
          2
        ),
        cnet: _.round(
          _.reduce(compare, (sum, n) => (sum += Number(n.net)), 0),
          2
        ),
      });
    }
  }, [state, compare]);
  return (
    <Grid
      container
      justifyContent="start"
      alignItems="center"
      px={1}
      py={0.5}
      borderBottom={0.5}
      borderColor={"grey.500"}
      bgcolor={blue[300]}
    >
      <Grid item xs={6} sm={6} md={6} lg={6}>
        Total
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        <Typography variant="body1">{totals.income}</Typography>
        <Typography variant="body1">{totals.cincome}</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        <Typography variant="body1">{totals.cogs}</Typography>
        <Typography variant="body1">{totals.ccogs}</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        <Typography variant="body1">{totals.net}</Typography>
        <Typography variant="body1">{totals.cnet}</Typography>
      </Grid>
    </Grid>
  );
};

const FirstRow = (props) => {
  const filter = useRef();
  return (
    <Grid container>
      <Grid item xs={6} lg={8} md={8} sm={8}>
        <Stack direction="row" alignItems="center" justifyContent={"start"}>
          <Typography variant="h4" mr={1}>
            Profit & Loss
          </Typography>
          <Typography variant="subtitle1">(By Business)</Typography>
        </Stack>
        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          spacing={1}
        >
          <Grid item>
            <Typography variant="h6" color="textSecondary">
              {props?.period?.from && `From: ${props.period.from}`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" color="textSecondary">
              {props?.period?.to && `To: ${props.period.to}`}
            </Typography>
          </Grid>
          {props?.aggregatedPeriod && (
            <Grid item xs={12} display={"flex"} justifyContent={"start"}>
              <Typography
                variant="h6"
                color="textSecondary"
                gutterBottom
                mr={1}
              >
                {props.aggregatedPeriod}
              </Typography>
              {(props?.comPeriod.from || props.comPeriod.to) && (
                // <Grid item xs={12}>
                <Typography variant="h6" color="textSecondary">
                  {"Compare with "}
                  {props?.comPeriod?.from} {"to " + props?.comPeriod?.to}
                </Typography>
                // </Grid>
              )}
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={6} lg={4} md={4} sm={4} textAlign={"end"} pr={2}>
        <FilterForm
          ref={filter}
          setBusinessType={props.setCurrentBusinessType}
          setProject={props.setCurrentProject}
          selectedBusiness={props.currentBusinessType}
          selectedProject={props.currentProject}
          loading={props.loading}
          period={props.period}
          setPeriod={props.setPeriod}
          prstatus={props.currrentprstatus}
          setPrStatus={props.setCurrentPrStatus}
          AggPeriod={props.aggregatedPeriod}
          setAggPeriod={props.setAggregatedPeriod}
        />
        <ButtonGroup variant="outlined">
          <Button onClick={() => filter.current.open()}>Filter</Button>
          <Compare
            compare={props?.compare}
            setCompare={props?.setCompare}
            comPeriod={props?.comPeriod}
            setComPeriod={props?.setComPeriod}
            business_type={props?.currentBusinessType}
            project_id={props?.currentProject?.id}
            aggregatedPeriod={props?.aggregatedPeriod}
            prStatus={props?.currrentprstatus}
            setLoading={props?.setLoading}
          />
        </ButtonGroup>
      </Grid>
    </Grid>
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
      <Grid item xs={6} lg={4} md={4} sm={4} textAlign={"end"}>
        <FormControlLabel
          control={<Switch checked={props.inMillions} />}
          label="Millions"
          onChange={(e) => {
            props.setInMillions(e.target.checked);
          }}
          sx={{ marginLeft: 2 }}
        />
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

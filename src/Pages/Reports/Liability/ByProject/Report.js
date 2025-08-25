import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import axios from "axios";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import _, { eq, set } from "lodash";
import { blue, grey, orange } from "@mui/material/colors";
import FilterForm from "./FilterForm";
import { Compare } from "./Compare";
import { use } from "react";
import GroupedData from "./Details";
import MyLoader from "../../../helpers/MyLoader";
import { Alert } from "../../../../context/AlertBar/AlertBar";
import API from "../../../../api/axiosApi";

const Report = ({ accountType, by }) => {
  const DetailsRef = useRef();
  const FilterFormRef = useRef();
  const { showAlert, setMessage, setSeverity } = useContext(Alert);
  const [groupData, setgroupData] = React.useState(null);
  const openDetailsDialoge = useCallback((data) => {
    console.log(data);
    setgroupData(data);
    DetailsRef.current.open();
  }, []);
  const [grouped, setGrouped] = React.useState({
    name: "Project",
    value: "project_id",
  });
  const [conditions, setConditions] = React.useState(null);
  const [compare, setCompare] = React.useState([]);
  const [comPeriod, setComPeriod] = React.useState({ from: null, to: null });
  const [state, setSate] = React.useState([]);
  const [inMillions, setInMillions] = React.useState(false);
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
      const res = await API.get("reports/liability/byproject", {
        params: {
          type: "data",
          // conditions: [{ key: "p.link", value: "null" }],
          groupby: grouped.value,
          // groupby: "account_id",
          // business_type: currentBusinessType,
          // project_id: currentProject?.id,
          // period: period,
          // aggregatedPeriod: aggregatedPeriod,
          // prStatus: currrentprstatus,
        },
      });
      console.log(res.data);
      setSate(res.data);
    } catch (error) {
      setMessage(error?.response?.data?.message);
      setSeverity("error");
      showAlert(true);
      console.log(error.response);
      console.log(error?.response?.data?.message);
      // setError(error);
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
          item.credit = _.round(item.credit / 1000000, 2);
          item.debit = _.round(item.debit / 1000000, 2);
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
      <Loader loading={loading} />
      {/* {fiter Form} */}
      <FilterForm
        ref={FilterFormRef}
        setBusinessType={setCurrentBusinessType}
        setProject={setCurrentProject}
        selectedBusiness={currentBusinessType}
        selectedProject={currentProject}
        loading={loading}
        period={period}
        setPeriod={setPeriod}
        prstatus={currrentprstatus}
        setPrStatus={setCurrentPrStatus}
        AggPeriod={aggregatedPeriod}
        setAggPeriod={setAggregatedPeriod}
      />
      <Loader loading={loading} />
      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <PageHeader title={"Payables"} subtitle={`By ${grouped.name}`} />
        <ButtonGroup variant="outlined">
          <Button onClick={() => FilterFormRef.current.open()}>Filter</Button>
          <Compare
            compare={compare}
            setCompare={setCompare}
            comPeriod={comPeriod}
            setComPeriod={setComPeriod}
            business_type={currentBusinessType}
            project_id={currentProject?.id}
            aggregatedPeriod={aggregatedPeriod}
            prStatus={currrentprstatus}
            setLoading={setLoading}
          />
        </ButtonGroup>
      </Stack>
      <Periods
        period={period}
        // aggregatedPeriod={props.aggregatedPeriod}
      />
      <SecondRow
        currentBusinessType={currentBusinessType}
        currentProject={currentProject}
        setBusinessType={setCurrentBusinessType}
        inMillions={inMillions}
        setInMillions={setInMillions}
        period={period}
        currrentprstatus={currrentprstatus}
      />

      <Contents loading={loading} state={state} compare={compare} />
    </Box>
  );
};
export default Report;

const HeaderRow = (props) => {
  return (
    <Grid
      container
      justifyContent="start"
      alignItems="center"
      px={1}
      p={1}
      borderBottom={0.5}
      borderColor={"grey.500"}
      {...props}
    >
      <Grid item xs={6} sm={6} md={6} lg={6}>
        Project Name
      </Grid>
      <Grid item xs={2} display={"flex"} justifyContent="flex-end">
        CR
      </Grid>
      <Grid item xs={2} display={"flex"} justifyContent="flex-end">
        DR
      </Grid>
      <Grid item xs={2} display={"flex"} justifyContent="flex-end">
        Net
      </Grid>
    </Grid>
  );
};
const FooterRow = ({ state, compare }) => {
  const [totals, setTotals] = React.useState({
    credit: 0,
    debit: 0,
    net: 0,
    cincome: 0,
    ccogs: 0,
    cnet: 0,
  });
  useEffect(() => {
    setTotals({
      credit: _.round(
        _.reduce(state, (sum, n) => (sum += Number(n.credit)), 0),
        2
      ),
      debit: _.round(
        _.reduce(state, (sum, n) => (sum += Number(n.debit)), 0),
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
        <Typography variant="body1">{totals.credit}</Typography>
        <Typography variant="body1">{totals.cincome}</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        <Typography variant="body1">{totals.debit}</Typography>
        <Typography variant="body1">{totals.ccogs}</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        <Typography variant="body1">{totals.net}</Typography>
        <Typography variant="body1">{totals.cnet}</Typography>
      </Grid>
    </Grid>
  );
};

// const FirstRow = (props) => {
//     const filter = useRef();
//     return (
//         <Grid container>
//             <Grid item xs={6} lg={8} md={8} sm={8}>
//                 <PageHeader title={"payables"} />
//                 <Periods
//                     period={props.period}
//                     // aggregatedPeriod={props.aggregatedPeriod}
//                 />
//                 {/* <Grid
//                     container
//                     justifyContent={"flex-start"}
//                     alignItems={"center"}
//                     spacing={1}
//                 >
//                     {props?.aggregatedPeriod && (
//                         <Grid
//                             item
//                             xs={12}
//                             display={"flex"}
//                             justifyContent={"start"}
//                         >
//                             <Typography
//                                 variant="h6"
//                                 color="textSecondary"
//                                 gutterBottom
//                                 mr={1}
//                             >
//                                 {props.aggregatedPeriod}
//                             </Typography>
//                             {(props?.comPeriod.from || props.comPeriod.to) && (
//                                 // <Grid item xs={12}>
//                                 <Typography variant="h6" color="textSecondary">
//                                     {"Compare with "}
//                                     {props?.comPeriod?.from}{" "}
//                                     {"to " + props?.comPeriod?.to}
//                                 </Typography>
//                                 // </Grid>
//                             )}
//                         </Grid>
//                     )}
//                 </Grid> */}
//             </Grid>
//             <Grid item xs={6} lg={4} md={4} sm={4} textAlign={"end"} pr={2}>
//                 <FilterForm
//                     ref={filter}
//                     setBusinessType={props.setCurrentBusinessType}
//                     setProject={props.setCurrentProject}
//                     selectedBusiness={props.currentBusinessType}
//                     selectedProject={props.currentProject}
//                     loading={props.loading}
//                     period={props.period}
//                     setPeriod={props.setPeriod}
//                     prstatus={props.currrentprstatus}
//                     setPrStatus={props.setCurrentPrStatus}
//                     AggPeriod={props.aggregatedPeriod}
//                     setAggPeriod={props.setAggregatedPeriod}
//                 />
//                 <ButtonGroup variant="outlined">
//                     <Button onClick={() => filter.current.open()}>
//                         Filter
//                     </Button>
//                     <Compare
//                         compare={props?.compare}
//                         setCompare={props?.setCompare}
//                         comPeriod={props?.comPeriod}
//                         setComPeriod={props?.setComPeriod}
//                         business_type={props?.currentBusinessType}
//                         project_id={props?.currentProject?.id}
//                         aggregatedPeriod={props?.aggregatedPeriod}
//                         prStatus={props?.currrentprstatus}
//                         setLoading={props?.setLoading}
//                     />
//                 </ButtonGroup>
//             </Grid>
//         </Grid>
//     );
// };
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
const Loader = ({ loading }) => (
  <Backdrop
    open={loading}
    sx={{
      color: "#fff",
      zIndex: (theme) => theme.zIndex.drawer + 1,
    }}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
);

const PageHeader = ({ title, subtitle }) => {
  return (
    <Box mb={1}>
      <Typography variant="h4" component="h1" fontWeight="bold">
        {title.toUpperCase()}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

const Periods = ({ period }) => (
  <Grid
    container
    justifyContent={"flex-start"}
    alignItems={"center"}
    spacing={1}
  >
    <Grid item>
      <Typography variant="h6" color="textSecondary">
        {period?.from && `From: ${period.from}`}
      </Typography>
    </Grid>
    <Grid item>
      <Typography variant="h6" color="textSecondary">
        {period?.to && `To: ${period.to}`}
      </Typography>
    </Grid>
  </Grid>
);

const Contents = ({ loading, state, compare }) => {
  return (
    <Box>
      <HeaderRow bgcolor={blue[300]} />
      {loading ? (
        <MyLoader />
      ) : (
        <List>
          {state.map((item) => (
            <ListItem divider key={Math.random()}>
              <ListItemButton onClick={() => openDetailsDialoge(item)}>
                <GridRow
                  item={item}
                  compare={_.find(compare, { id: item.id })}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
      <FooterRow state={state} compare={compare} />
    </Box>
  );
};
const GridRow = (props) => {
  return (
    <Grid
      container
      justifyContent="start"
      alignItems="center"
      px={1}
      py={0.5}
      borderColor={"grey.500"}
      {...props}
    >
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <Typography variant="body1">{props?.item?.display_name}</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        {/* {props.income} */}
        {props?.compare ? (
          <>
            <Typography variant="body1">{props?.item?.credit}</Typography>
            <Typography variant="body1">{props?.compare?.credit}</Typography>
          </>
        ) : (
          props?.item?.credit
        )}
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        {/* {props.cogs} */}
        {props?.compare ? (
          <>
            <Typography variant="body1">{props?.item?.debit}</Typography>
            <Typography variant="body1">{props?.compare?.debit}</Typography>
          </>
        ) : (
          props?.item?.debit
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

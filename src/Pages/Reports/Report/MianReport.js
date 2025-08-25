import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { blue, grey } from "@mui/material/colors";
import FilterForm from "../Liability/ByProject/FilterForm";
// import { Compare } from "./Compare";
// import GroupedData from "./Details";
import MyLoader from "../../helpers/MyLoader";
import Details from "./Details";
import { DeleteForever, KeyboardArrowDown } from "@mui/icons-material";
import { useReportMultyQuery } from "../../../features/reports/reportApi";
import { useDispatch, useSelector } from "react-redux";
import {
  openDetails,
  setDefaults,
  setGroupby,
  setHavings,
  setPeriod,
} from "../../../features/reports/reportSlice";
import PageLayout from "../../../components/ui/PageLayout";

const Report = ({ title, subtitle, APIUrl, groupOn }) => {
  const dispatch = useDispatch();
  // global States
  const {
    conditions,
    havings,
    period,
    endpoint,
    groupOn: groupBy,
  } = useSelector((state) => state.reportSlice);
  // Local States
  const [str, setStr] = useState("");
  const [inMillions, setInMillions] = useState(false);
  // API Calls
  const {
    data = [],
    isLoading,
    isError,
  } = useReportMultyQuery({
    url: endpoint,
    conditions: conditions,
    having: havings,
    period: period,
    groupby: groupBy,
  });
  // Functions
  const state = useMemo(() => {
    if (isLoading) return [];
    if (isError) return [];
    if (inMillions) {
      return data.map((item) => ({
        ...item,
        debit: _.round(String(item.debit) / 1000000, 2),
        credit: _.round(String(item.credit) / 1000000, 2),
        net: _.round(String(item.net) / 1000000, 2),
      }));
    }
    if (str) {
      return data.filter((item) =>
        item.display_name.toLowerCase().includes(str.toLowerCase())
      );
    }
    return data;
  }, [data, str, inMillions]);
  useEffect(() => {
    dispatch(
      setDefaults({
        title: title,
        endpoint: APIUrl,
        groupOn: groupOn,
      })
    );
  }, []);
  const [compare, setCompare] = React.useState([]);
  // const [inMillions, setInMillions] = React.useState(false);
  return (
    <>
      <Details />
      <Paper sx={{ p: 2 }}>
        <PageLayout
          left={
            <>
              <SecondRow />
              <PageHeader />
            </>
          }
          create={
            <>
              <FilterForm />
              <ToggleMillions
                inMillions={inMillions}
                setInMillions={setInMillions}
              />
            </>
          }
          period={period}
          setPeriod={(v) => dispatch(setPeriod(v))}
        >
          {isLoading ? (
            <MyLoader />
          ) : (
            <Contents
              state={state}
              groupOn={groupBy}
              compare={compare}
              setStr={setStr}
            />
          )}
        </PageLayout>
      </Paper>
    </>
  );
};
export default Report;
const Contents = React.memo(({ compare, state, groupOn, setStr }) => {
  const dispatch = useDispatch();
  return (
    <Box>
      <HeaderRow setStr={setStr} />
      <List>
        {state
          .filter((i) => !i.hide)
          .map((item) => (
            <ListItem disablePadding divider key={Math.random()}>
              {console.log("renders")}
              <ListItemButton
                onClick={() =>
                  dispatch(
                    openDetails({
                      title: item.display_name || "",
                      condition: { key: groupOn, value: item.id },
                      groupOn: "account_id",
                    })
                  )
                }
              >
                <GridRow
                  rowitem={item}
                  compare={_.find(compare, {
                    id: item.id,
                  })}
                />
              </ListItemButton>
            </ListItem>
          ))}
      </List>
      <FooterRow state={state} compare={compare} />
    </Box>
  );
});
const HeaderRow = ({ setStr }) => {
  return (
    <Grid
      container
      justifyContent="start"
      alignItems="center"
      px={1}
      p={1}
      bgcolor={blue[200]}
      borderRadius={2}
    >
      <Grid item xs={6} sm={6} md={6} lg={6}>
        {/* <Filter state={state} setState={setState} /> */}
        <TextField
          size="small"
          fullWidth
          onChange={(e) => setStr(e.target.value)}
          placeholder="Search..."
        />
      </Grid>
      <Grid item xs={2} display={"flex"} justifyContent="flex-end">
        DR
      </Grid>
      <Grid item xs={2} display={"flex"} justifyContent="flex-end">
        CR
      </Grid>

      <Grid item xs={2} display={"flex"} justifyContent="flex-end">
        <HavingConditions />
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
        <Typography variant="body1">{totals.debit}</Typography>
        <Typography variant="body1">{totals.ccogs}</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        <Typography variant="body1">{totals.credit}</Typography>
        <Typography variant="body1">{totals.cincome}</Typography>
      </Grid>

      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        <Typography variant="body1">{totals.net}</Typography>
        <Typography variant="body1">{totals.cnet}</Typography>
      </Grid>
    </Grid>
  );
};

const SecondRow = () => {
  const conditions = useSelector((state) => state.reportSlice.conditions);
  const arr = [
    {
      default: "All Business Types",
      name: "Business Type",
      slug: "link",
      var: "h6",
    },
    { default: "", name: "Project Status", slug: "p.status", var: "body1" },
    { default: "", name: "Projects", slug: "project_id", var: "body1" },
  ];
  return (
    <Stack>
      {arr.map(
        (itm) =>
          conditions.find((cond) => cond.key === itm.slug)?.value && (
            <Typography color={blue[900]} key={itm.slug} variant="body1">
              {itm.name +
                " : " +
                conditions.find((cond) => cond.key === itm.slug)?.value ||
                itm.default}
            </Typography>
          )
      )}

      <Grid item xs={6} lg={4} md={4} sm={4} textAlign={"end"}></Grid>
    </Stack>
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

const PageHeader = () => {
  const { groupby, groupOn } = useSelector((state) => state.reportSlice);
  return (
    <Stack>
      {groupby.map(
        (group) =>
          group.value === groupOn && (
            <Stack
              key={group.name}
              direction={"row"}
              alignItems={"center"}
              spacing={1}
            >
              <Typography variant="body1">
                {`Grouped By ${group?.name}`}
              </Typography>
              <Grouping />
            </Stack>
          )
      )}
    </Stack>
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

const GridRow = ({ rowitem, compare }) => {
  return (
    <Grid
      container
      justifyContent="start"
      alignItems="center"
      borderColor={"grey.500"}
    >
      <Grid item xs={6} sm={6} md={6} lg={6}>
        <Typography variant="body1">{rowitem?.display_name}</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        {/* {props.cogs} */}
        {compare ? (
          <>
            <Typography variant="body1">{rowitem?.debit}</Typography>
            <Typography variant="body1">{compare?.debit}</Typography>
          </>
        ) : (
          rowitem?.debit
        )}
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        {/* {props.income} */}
        {compare ? (
          <>
            <Typography variant="body1">{rowitem?.credit}</Typography>
            <Typography variant="body1">{compare?.credit}</Typography>
          </>
        ) : (
          rowitem?.credit
        )}
      </Grid>

      <Grid item xs={2} sm={2} md={2} lg={2} textAlign={"right"}>
        {compare ? (
          <>
            <Typography variant="body1">{rowitem?.net}</Typography>
            <Typography variant="body1">{compare?.net}</Typography>
          </>
        ) : (
          rowitem?.net
        )}
      </Grid>
    </Grid>
  );
};

const Grouping = () => {
  const dispatch = useDispatch();
  const { groupby, groupOn } = useSelector((state) => state.reportSlice);

  const [open, setOpen] = React.useState(null);
  return (
    <Box>
      <IconButton
        sx={{ bgcolor: blue[100] }}
        size="small"
        onClick={(e) => setOpen(e.currentTarget)}
      >
        <KeyboardArrowDown />
      </IconButton>

      <Menu
        open={Boolean(open)}
        anchorEl={open}
        onClose={() => setOpen(null)}
        transitionDuration={{ appear: 700, enter: 700, exit: 700 }}
      >
        <MenuList>
          {groupby?.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => {
                dispatch(setGroupby(option.value));
                setOpen(false);
              }}
            >
              {option.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
const HavingConditions = () => {
  const dispatch = useDispatch();
  const havings = useSelector((state) => state.reportSlice.havings);
  const [open, setOpen] = React.useState(null);
  const symbols = [">", "<", "=", "<>"];
  const [state, setState] = React.useState([]);
  useEffect(() => {
    setState([...havings]);
  }, [havings]);
  return (
    <>
      <Paper>
        <Button
          variant="text"
          endIcon={open ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          onClick={(e) => setOpen(e.currentTarget)}
        >
          Net
        </Button>
      </Paper>
      <Menu open={Boolean(open)} onClose={() => setOpen(null)} anchorEl={open}>
        <MenuList sx={{ minWidth: 300 }}>
          <MenuItem divider dense>
            <IconButton
              size="small"
              onClick={() =>
                setState([...state, { key: "net", operator: "", value: "" }])
              }
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </MenuItem>
          {state.map((having, index) => (
            <MenuItem divider key={index}>
              <Autocomplete
                size="small"
                options={symbols || []}
                renderInput={(params) => (
                  <TextField size="small" {...params} margin="dense" />
                )}
                value={having?.operator || ""}
                onChange={(e, v) => {
                  setState((prv) =>
                    prv.map((hv, i) =>
                      i === index ? { ...hv, operator: v } : hv
                    )
                  );
                }}
              />
              <TextField
                name="value"
                value={having?.value || ""}
                size="small"
                margin="dense"
                onChange={(e) => {
                  setState((prv) => {
                    return prv.map((hv, i) =>
                      i === index ? { ...hv, value: e.target.value } : hv
                    );
                  });
                }}
              />
              <IconButton
                size="small"
                onClick={() => setState(state.filter((v, i) => i !== index))}
              >
                <DeleteForever />
              </IconButton>
            </MenuItem>
          ))}
          {/* {state.length > 0 && ( */}
          <MenuItem dense>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                dispatch(setHavings(state));
                setOpen(null);
              }}
            >
              Update
            </Button>
          </MenuItem>
          {/* )} */}
        </MenuList>
      </Menu>
    </>
  );
};
const ToggleMillions = ({ inMillions, setInMillions }) => {
  return (
    <FormControlLabel
      control={<Switch checked={inMillions} />}
      label="Millions"
      onChange={(e) => {
        setInMillions(e.target.checked);
      }}
      sx={{ marginLeft: 2 }}
    />
  );
};

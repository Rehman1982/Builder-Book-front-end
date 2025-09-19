import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { blue, grey, orange, yellow } from "@mui/material/colors";
import axios from "axios";
import _ from "lodash";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
  useContext,
  useMemo,
} from "react";
// import { Alert } from "../../../context/AlertBar/AlertBar";
import MyLoader from "./MyLoader";
// import Filter from "./Filter";
import dayjs from "dayjs";
// import API from "../../../api/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { useReportMultyQuery } from "../../features/reports/reportApi";
import { closeMoreDetails } from "../../features/reports/reportSlice";
import { view } from "../../features/creditBill/creditBillSlice";
import { Body1, Body2, Bold } from "./MyTypo";
import useIsMobile from "../../hooks/useIsMobile";

const MoreDetails = forwardRef(({ reportProps }, ref) => {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  // global states
  const { endpoint, period, moreDetailReport } = useSelector(
    (state) => state.reportSlice
  );
  const { showComp, conditions, title } = moreDetailReport;
  // local states
  const [groupData, setGroupData] = useState(null);
  const [sumby, setSumBy] = useState("default");
  const [str, setStr] = useState("");
  // RTK Api Call
  const {
    data = [],
    isLoading,
    isFetching,
    isError,
  } = useReportMultyQuery(
    {
      url: endpoint,
      conditions: conditions,
      period: period,
      groupby: null,
    },
    { skip: !showComp }
  );
  // functions

  const state = useMemo(() => {
    if (isLoading || isError) return [];

    if (str) {
      return data.filter((itm) =>
        Object.values(itm).some((value) =>
          String(value).toLowerCase().includes(str.toLowerCase())
        )
      );
    }
    return data;
  }, [data, str]);

  useEffect(() => {
    if (sumby !== "default") {
      setGroupData(_.groupBy(data, sumby));
    } else {
      setGroupData(null);
    }
  }, [sumby]);
  return (
    <>
      <Dialog
        open={showComp}
        onClose={() => {
          dispatch(closeMoreDetails());
        }}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Stack mb={1}>
            <Typography variant="body1">{title || ""}</Typography>
            <SumBy groupby={sumby} setGroupBy={setSumBy} />
          </Stack>
          {isMobile ? (
            <TextField
              sx={{ display: groupData ? "none" : "" }}
              fullWidth
              size="small"
              value={str || ""}
              onChange={(e) => setStr(e.target.value)}
              placeholder="Search..."
            />
          ) : (
            <Grid
              component={Paper}
              container
              alignItems={"center"}
              bgcolor={grey[200]}
              p={1}
              borderRadius={2}
            >
              <Grid item xs={6}>
                {!groupData && (
                  <TextField
                    fullWidth
                    size="small"
                    value={str || ""}
                    onChange={(e) => setStr(e.target.value)}
                    placeholder="Search..."
                  />
                )}
              </Grid>
              <Grid
                item
                xs={2}
                textAlign={"right"}
                component={Typography}
                variant="body1"
              >
                DR
              </Grid>
              <Grid
                item
                xs={2}
                textAlign={"right"}
                component={Typography}
                variant="body1"
              >
                CR
              </Grid>
              <Grid
                item
                xs={2}
                textAlign={"right"}
                component={Typography}
                variant="body1"
              >
                Net
              </Grid>
            </Grid>
          )}
        </DialogTitle>
        <DialogContent>
          <Box>
            {isLoading || isFetching ? (
              <MyLoader />
            ) : groupData ? (
              Object.entries(groupData).map(([heading, data]) => (
                <Box key={heading}>
                  <Grid item xs={12}>
                    <Typography
                      color={grey[600]}
                      fontWeight={550}
                      variant="subtitle1"
                      gutterBottom
                    >
                      {heading}
                    </Typography>
                  </Grid>
                  <Box>
                    {data.map((item, index) => (
                      <ContentRow item={item} key={index} />
                    ))}
                    {isMobile ? (
                      <Stack
                        bgcolor={orange[50]}
                        border={1}
                        borderColor={"divider"}
                        borderRadius={3}
                        p={1}
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        mb={1}
                      >
                        <Body2>Total</Body2>
                        <Body2>
                          {_.sumBy(data, (v) => v.debit) || ""}
                          {_.sumBy(data, (v) => v.credit) || ""}
                        </Body2>
                      </Stack>
                    ) : (
                      <ContentRow
                        item={{
                          desp: "Total",
                          debit: _.sumBy(data, (v) => v.debit),

                          credit: _.sumBy(data, (v) => v.credit),
                          net: _.sumBy(data, (v) => v.net),
                        }}
                      />
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              state?.map((item, index) => (
                <ContentRow item={item} key={index} />
              ))
            )}
          </Box>
        </DialogContent>
        <DialogTitle>
          {isMobile ? (
            <Stack>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Body2>Grand Total</Body2>
                <Body2>{_.sumBy(state, (v) => v.net)}</Body2>
              </Stack>
            </Stack>
          ) : (
            <Grid
              component={Paper}
              container
              alignItems={"center"}
              bgcolor={grey[300]}
              p={1}
              borderRadius={2}
            >
              <Grid
                fontWeight={550}
                item
                xs={6}
                component={Typography}
                variant="subtitle1"
              >
                Total
              </Grid>
              <Grid
                fontWeight={550}
                item
                xs={2}
                textAlign={"right"}
                component={Typography}
                variant="subtitle1"
              >
                {_.sumBy(state, (v) => v.debit)}
              </Grid>
              <Grid
                fontWeight={550}
                item
                xs={2}
                textAlign={"right"}
                component={Typography}
                variant="subtitle1"
              >
                {_.sumBy(state, (v) => v.credit)}
              </Grid>
              <Grid
                fontWeight={550}
                item
                xs={2}
                textAlign={"right"}
                component={Typography}
                variant="subtitle1"
              >
                {_.sumBy(state, (v) => v.net)}
              </Grid>
            </Grid>
          )}
        </DialogTitle>
      </Dialog>
    </>
  );
});
export default React.memo(MoreDetails);

const SumBy = ({ groupby, setGroupBy }) => {
  const [open, setOpen] = useState(null);
  const [options, setOptions] = useState([
    { name: "Transaction", value: "trans_no", icon: "receipt" },
    { name: "Account", value: "account_name", icon: "receipt" },
    { name: "Account Type", value: "account_type", icon: "currency_exchange" },
    { name: "Item", value: "item_name" },
    { name: "Vendor", value: "vendor_name" },
    { name: "Project", value: "project_name", icon: "apartment" },
    { name: "User", value: "user_name", icon: "person" },
    { name: "Journal", value: "entry_no" },
    { name: "Voucher", value: "voucher" },
    { name: "Vendor Bill", value: "bill_no" },
    { name: "Purchase Bill", value: "pb_no" },
    { name: "Invoice", value: "invoice_no" },
    { name: "Payroll", value: "payroll_id" },
    { name: "Vendor Payment", value: "payment_no" },
    { name: "Debit Memo", value: "drMemoNo" },
    { name: "AC Transfer", value: "actransfer_no" },
    { name: "Personal Exp", value: "pr_exp_no" },
    { name: "Retention", value: "reten_release_no" },
    { name: "Date", value: "date", icon: "date_range" },
    { name: "Default", value: null },
  ]);
  return (
    <>
      <Stack direction="row" justifyContent="flex-start" alignItems="center">
        <Body1>
          {"Group By " +
            _.get(
              _.find(options, (o) => o.value === groupby),
              "name",
              ""
            ) || ""}
        </Body1>
        <Icon
          color="primary"
          sx={{ cursor: "pointer" }}
          onClick={(e) => setOpen(e.currentTarget)}
        >
          {open ? "arrow_drop_up" : "arrow_drop_down"}
        </Icon>
      </Stack>
      <Menu anchorEl={open} open={Boolean(open)} onClose={() => setOpen(null)}>
        <List dense>
          {options?.map((v, i) => (
            <ListItemButton
              dense
              divider
              selected={v.value === groupby ? true : false}
              onClick={() => setGroupBy(v?.value || "default")}
            >
              <ListItemIcon>
                <Icon color="primary">{v.icon || ""}</Icon>
              </ListItemIcon>
              <ListItemText primary={v.name} />
              {v.value === groupby && <Icon color="success">check_circle</Icon>}
            </ListItemButton>
          ))}
        </List>
      </Menu>
    </>
  );
};

const ContentRow = React.memo(({ item }) => {
  const isMobile = useIsMobile();
  const call = useDispatch();
  if (isMobile) {
    return (
      <Card variant="outlined" raised sx={{ mb: 0.2 }}>
        <CardContent>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {item.created_at && (
              <Text icon={"date_range"}>
                <Body2>{dayjs(item.created_at).format("DD-MM-YYYY")}</Body2>
              </Text>
            )}
            {item.trans_no && (
              <Text icon={"receipt"}>
                <Body2>{item.trans_no}</Body2>
              </Text>
            )}
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {item.user_name && (
              <Text icon="person">
                <Body2>{item.user_name}</Body2>
              </Text>
            )}
            {item.drMemoNo && <Body2>Dr Memo #: {item.drMemoNo}</Body2>}

            {item.actransfer_no && (
              <Body2>AC-Tranfer #: {item.actransfer_no}</Body2>
            )}
            {item.bill_no && (
              <ClickAbleTypo
                onClick={() => call(view({ Bill_no: item?.bill_no }))}
                variant="body1"
              >
                VBill #: {item.bill_no}
              </ClickAbleTypo>
            )}
            {item.entry_no > 0 && <Body2>JR #: {item.entry_no}</Body2>}
            {item.payment_no > 0 && (
              <Text title={<Body2>PM#:</Body2>}>
                <Body2>{item.payment_no}</Body2>
              </Text>
            )}
            {item.payroll_id > 0 && <Body2>Payroll #: {item.payroll_id}</Body2>}
            {item.pb_no > 0 && <Body2>PBill #: {item.pb_no}</Body2>}
            {item.pr_exp_no > 0 && <Body2>Prsnl Exp #: {item.pr_exp_no}</Body2>}
            {item.voucher > 0 && <Body2>VR #: {item.voucher}</Body2>}
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Grid item xs={12}>
            <Stack direction={"column"} spacing={0.5}>
              {item.desp && (
                <Text icon="text_format">
                  <Body2 gutterBottom>{item.desp}</Body2>
                </Text>
              )}
              {item?.project_name && (
                <Text icon="apartment">
                  <Body2>{item.project_name}</Body2>
                </Text>
              )}
              {item.account_type && (
                <Text icon="currency_exchange">
                  <Body2>
                    {item.account_type + ":" + item.account_name &&
                      item.account_name}
                  </Body2>
                </Text>
              )}
            </Stack>
          </Grid>
          <Divider sx={{ my: 0.5 }} />
          {item.debit > 0 && (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Body2>Debit</Body2>
              <Body2>{item.debit}</Body2>
            </Stack>
          )}
          {item.credit > 0 && (
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Body2>Credit</Body2>
              <Body2>{item.credit}</Body2>
            </Stack>
          )}
        </CardContent>
      </Card>
    );
  }
  return (
    <Grid
      container
      justifyContent="space-between"
      alignItems={"center"}
      px={1}
      borderBottom={0.5}
      borderColor={"divider"}
      spacing={1}
    >
      <Grid item xs={2}>
        {/* {console.log("renders")} */}
        <Stack direction={"column"} spacing={0.5}>
          {item.created_at && (
            <Text icon={"date_range"}>
              <Body2>Date: {dayjs(item.created_at).format("DD-MM-YYYY")}</Body2>
            </Text>
          )}
          {item.user_name && (
            <Text icon="person">
              <Body2>{item.user_name}</Body2>
            </Text>
          )}
          {item.drMemoNo && <Body2>Dr Memo #: {item.drMemoNo}</Body2>}
          {item.trans_no && (
            <Text icon={"receipt"}>
              <Body2>{item.trans_no}</Body2>
            </Text>
          )}
          {item.actransfer_no && (
            <Body2>AC-Tranfer #: {item.actransfer_no}</Body2>
          )}
          {item.bill_no && (
            <ClickAbleTypo
              onClick={() => call(view({ Bill_no: item?.bill_no }))}
              variant="body1"
            >
              VBill #: {item.bill_no}
            </ClickAbleTypo>
          )}
          {item.entry_no > 0 && <Body2>JR #: {item.entry_no}</Body2>}
          {item.payment_no > 0 && (
            <Text title={<Body2>PM#:</Body2>}>
              <Body2>{item.payment_no}</Body2>
            </Text>
          )}
          {item.payroll_id > 0 && <Body2>Payroll #: {item.payroll_id}</Body2>}
          {item.pb_no > 0 && <Body2>PBill #: {item.pb_no}</Body2>}
          {item.pr_exp_no > 0 && <Body2>Prsnl Exp #: {item.pr_exp_no}</Body2>}
          {item.voucher > 0 && <Body2>VR #: {item.voucher}</Body2>}
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Stack direction={"column"} spacing={0.5}>
          {item.desp && (
            <Text icon="text_format">
              <Body2 gutterBottom>{item.desp}</Body2>
            </Text>
          )}
          {item?.project_name && (
            <Text icon="apartment">
              <Body2>{item.project_name}</Body2>
            </Text>
          )}
          {item.account_type && (
            <Text icon="currency_exchange">
              <Body2>
                {item.account_type + ":" + item.account_name &&
                  item.account_name}
              </Body2>
            </Text>
          )}
        </Stack>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Body2>{item.debit}</Body2>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Body2>{item.credit}</Body2>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Body2>{item.net}</Body2>
      </Grid>
    </Grid>
  );
});

const ClickAbleTypo = (props) => {
  return <Body2 sx={{ cursor: "pointer" }} {...props}></Body2>;
};

const Text = ({ title, icon, children }) => (
  <Stack direction={"row"} alignItems={"center"}>
    {icon && (
      <Avatar
        sx={{
          bgcolor: orange[200],
          mr: 1,
          width: 20,
          height: 20,
        }}
      >
        <Icon sx={{ fontSize: 14 }} color="primary">
          {icon || "arrow_right"}
        </Icon>
      </Avatar>
    )}
    {title && <Stack sx={{ mr: 1 }}>{title}</Stack>}
    <>{children}</>
  </Stack>
);

import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
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
import { Alert } from "../../../context/AlertBar/AlertBar";
import MyLoader from "../../helpers/MyLoader";
import Filter from "./Filter";
import dayjs from "dayjs";
import API from "../../../api/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { useReportMultyQuery } from "../../../features/reports/reportApi";
import { closeMoreDetails } from "../../../features/reports/reportSlice";
import { view } from "../../../features/creditBill/creditBillSlice";

const MoreDetails = forwardRef(({ reportProps }, ref) => {
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
          <Stack
            mb={1}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="body1">{title || ""}</Typography>
            <SumBy groupby={sumby} setGroupBy={setSumBy} />
          </Stack>
          <Grid
            container
            alignItems={"center"}
            bgcolor={blue[200]}
            p={1}
            borderRadius={1}
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
        </DialogTitle>
        <DialogContent>
          <Box>
            {isLoading || isFetching ? (
              <MyLoader />
            ) : groupData ? (
              Object.entries(groupData).map(([heading, data]) => (
                <Box key={heading}>
                  <Grid item xs={12} bgcolor={blue[200]}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {heading}
                    </Typography>
                  </Grid>
                  <Box>
                    {data.map((item, index) => (
                      <ContentRow item={item} key={index} />
                    ))}
                    <ContentRow
                      rowProps={{
                        bgcolor: orange[100],
                      }}
                      item={{
                        desp: "Total",
                        debit: _.sumBy(data, (v) => v.debit),

                        credit: _.sumBy(data, (v) => v.credit),
                        net: _.sumBy(data, (v) => v.net),
                      }}
                    />
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
          <Grid
            container
            alignItems={"center"}
            bgcolor={blue[200]}
            p={0.5}
            borderRadius={1}
          >
            <Grid item xs={6} component={Typography} variant="body1">
              Total
            </Grid>
            <Grid
              item
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="body1"
            >
              {_.sumBy(state, (v) => v.debit)}
            </Grid>
            <Grid
              item
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="body1"
            >
              {_.sumBy(state, (v) => v.credit)}
            </Grid>
            <Grid
              item
              xs={2}
              textAlign={"right"}
              component={Typography}
              variant="body1"
            >
              {_.sumBy(state, (v) => v.net)}
            </Grid>
          </Grid>
        </DialogTitle>
      </Dialog>
    </>
  );
});
export default React.memo(MoreDetails);

const SumBy = ({ groupby, setGroupBy }) => {
  const [open, setOpen] = useState(null);
  const [options, setOptions] = useState([
    { name: "Transaction", value: "trans_no" },
    { name: "Account", value: "account_name" },
    { name: "Account Type", value: "account_type" },
    { name: "Item", value: "item_name" },
    { name: "vendor", value: "vendor_name" },
    { name: "project", value: "project_name" },
    { name: "user", value: "user_name" },
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
    { name: "date", value: "date" },
    { name: "Default", value: null },
  ]);
  return (
    <>
      <Autocomplete
        sx={{ minWidth: 300 }}
        options={options || []}
        getOptionLabel={(opt) => opt.name || "default"}
        value={_.find(options, { value: groupby }) || "default"}
        renderInput={(params) => (
          <TextField {...params} label="Grouping" size="small" />
        )}
        onChange={(e, v) => {
          setGroupBy(v?.value || "default");
        }}
      />
    </>
  );
};

const ContentRow = React.memo(({ item }) => {
  const call = useDispatch();
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
        <Stack direction={"column"}>
          {item.created_at && (
            <Typography variant="body1">
              Date: {dayjs(item.created_at).format("DD-MM-YYYY")}
            </Typography>
          )}
          {item.user_name && (
            <Typography variant="body1">User: {item.user_name}</Typography>
          )}
          {item.drMemoNo && (
            <Typography variant="body1">Dr Memo #: {item.drMemoNo}</Typography>
          )}
          {item.trans_no && (
            <Typography variant="body1">TR #: {item.trans_no}</Typography>
          )}
          {item.actransfer_no && (
            <Typography variant="body1">
              AC-Tranfer #: {item.actransfer_no}
            </Typography>
          )}
          {item.bill_no && (
            <ClickAbleTypo
              onClick={() => call(view({ Bill_no: item?.bill_no }))}
              variant="body1"
            >
              VBill #: {item.bill_no}
            </ClickAbleTypo>
          )}
          {item.entry_no > 0 && (
            <Typography variant="body1">JR #: {item.entry_no}</Typography>
          )}
          {item.payment_no > 0 && (
            <Typography variant="body1">Pmnt #: {item.payment_no}</Typography>
          )}
          {item.payroll_id > 0 && (
            <Typography variant="body1">
              Payroll #: {item.payroll_id}
            </Typography>
          )}
          {item.pb_no > 0 && (
            <Typography variant="body1">PBill #: {item.pb_no}</Typography>
          )}
          {item.pr_exp_no > 0 && (
            <Typography variant="body1">
              Prsnl Exp #: {item.pr_exp_no}
            </Typography>
          )}
          {item.voucher > 0 && (
            <Typography variant="body1">VR #: {item.voucher}</Typography>
          )}
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Stack direction={"column"}>
          {item.desp && (
            <Typography variant="body1" gutterBottom>
              {item.desp}
            </Typography>
          )}

          <Typography variant="body1" gutterBottom>
            {item.project_name && item.project_name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {item.account_type &&
              item.account_type + ":" + item.account_name &&
              item.account_name}
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Typography variant="body1">{item.debit}</Typography>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Typography variant="body1">{item.credit}</Typography>
      </Grid>
      <Grid item xs={2} textAlign={"right"}>
        <Typography variant="body1">{item.net}</Typography>
      </Grid>
    </Grid>
  );
});

const ClickAbleTypo = (props) => {
  return <Typography sx={{ cursor: "pointer" }} {...props}></Typography>;
};

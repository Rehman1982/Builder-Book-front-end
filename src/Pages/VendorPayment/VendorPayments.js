import React, { useEffect, useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import { useIndexQuery } from "../../features/VendorPayments/vendorPaymentApi";
import Contents from "./Contents";
import {
  Autocomplete,
  Grid,
  Icon,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { IButton } from "../../components/ui/UiComponents";
import { useDispatch } from "react-redux";
import { createPayment } from "../../features/VendorPayments/vendorPaymentSlice";
import { Body1, Body2, Bold } from "../../components/ui/MyTypo";
import { blue } from "@mui/material/colors";
import dayjs from "dayjs";
import Details from "../../components/ui/Details";
import { setDefaults, setPeriod } from "../../features/reports/reportSlice";

const VendorPayments = () => {
  const disp = useDispatch();
  const [period, changePeriod] = useState({
    from: dayjs().subtract(1, "year").startOf("year").format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });
  const [groupby, setGroupby] = useState({
    name: "Payment No",
    value: "payment_no",
  });
  const {
    data = [],
    isLoading,
    isFetching,
  } = useIndexQuery({
    conditions: [
      { key: "t.payment_no", value: "NotNull" },
      { key: "j.credit", value: "0" },
    ],
    groupby: groupby.value,
    period: period,
    type: "index",
  });
  useEffect(() => {
    disp(setPeriod(period));
    disp(
      setDefaults({
        endpoint: "transactions/vendorpayments?page=1",
        title: "Haleema",
        groupedOn: "item_id",
      })
    );
    console.log("Vendor payment Data", data);
  }, [data]);
  return (
    <>
      <Details />
      <Paper sx={{ p: 2 }}>
        <PageLayout
          left={
            <Stack direction={"row"} justifyContent={"flex-start"} spacing={1}>
              <Bold>{"By " + groupby?.name}</Bold>
              <Grouping groupby={groupby} setGroupby={setGroupby} />
            </Stack>
          }
          create={
            <>
              <IButton onClick={() => disp(createPayment())}>
                <Icon>add</Icon>
              </IButton>
            </>
          }
          period={period}
          setPeriod={(v) => changePeriod(v)}
        >
          <Contents data={data} groupby={groupby} />
        </PageLayout>
      </Paper>
    </>
  );
};

export default VendorPayments;

const Grouping = ({ groupby, setGroupby }) => {
  const [open, setOpen] = useState(null);
  const options = [
    { name: "Payment No.", value: "payment_no" },
    { name: "Vendors", value: "vendor_id" },
    { name: "Project", value: "project_id" },
    { name: "User", value: "user_id" },
  ];
  const handleClick = (v) => {
    setGroupby(v);
    setOpen(null);
  };
  return (
    <>
      <Icon
        sx={{ cursor: "pointer" }}
        onClick={(e) => setOpen(e.currentTarget)}
      >
        arrow_drop_down
      </Icon>
      <Menu open={Boolean(open)} anchorEl={open} onClose={() => setOpen(null)}>
        <List disablePadding>
          {options.map((v, i) => (
            <ListItem
              key={i}
              sx={{
                width: 200,
                bgcolor: groupby.value === v.value ? blue[100] : "",
              }}
              divider
              disableGutters
              disablePadding
            >
              <ListItemButton onClick={() => handleClick(v)}>
                <ListItemText primary={v.name} />
                {groupby.value === v.value && (
                  <Icon color="success">check_circle</Icon>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Menu>
    </>
  );
};

import React, { useEffect, useState } from "react";
import PageLayout from "../../components/ui/PageLayout";
import { Contents } from "./Contents";
import {
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  Paper,
  Stack,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createPB } from "../../features/purcasheBill/purchaseBillSlice";
import { CURD } from "./CURD";
import dayjs from "dayjs";
import _ from "lodash";
import { IButton } from "../../components/ui/UiComponents";
import { useIndexPBQuery } from "../../features/purcasheBill/purchaseBillApi";
import { Paginate } from "./Paginate";
import { setDefaults, setPeriod } from "../../features/reports/reportSlice";
import Details from "../../components/ui/Details";
import { blue } from "@mui/material/colors";
import { Bold } from "../../components/ui/MyTypo";

const Index = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const defaltPeriod = {
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().endOf("month").format("YYYY-MM-DD"),
  };
  // gloabl State
  const period = useSelector((S) => S.reportSlice.period);
  // local state
  const [groupby, setGroupby] = useState({
    name: "Purchase Bill No.",
    value: "pb_no",
  });
  // API Call

  const {
    data = [],
    isLoading,
    isFetching,
  } = useIndexPBQuery({
    groupby: groupby.value,
    period: period,
    page: 1,
  });
  useEffect(() => {
    console.log("Purchase Bill Component DAta", data);
  }, [data]);
  // Effects
  useEffect(() => {
    dispatch(setPeriod(defaltPeriod));
    dispatch(
      setDefaults({
        endpoint: "transactions/purchaseBills?page=1",
        // title: "",
        // groupOn: "user_id",
      })
    );
  }, []);
  return (
    <>
      <Details />
      <CURD />
      <Paper sx={{ p: 2 }}>
        <PageLayout
          left={<Grouping groupby={groupby} setGroupby={setGroupby} />}
          create={
            <>
              <IButton onClick={() => dispatch(createPB())}>
                <Icon>add</Icon>
              </IButton>
              <IButton>
                <Icon>filter_list</Icon>
              </IButton>
            </>
          }
          period={period}
          setPeriod={(v) => dispatch(setPeriod(v))}
          // pagination={
          //   <Paginate
          //     pages={data?.last_page}
          //     page={data?.current_page}
          //     setPage={setPage}
          //   />
          // }
        >
          <Contents state={data} groupby={groupby} setGroupby={setGroupby} />
        </PageLayout>
      </Paper>
    </>
  );
};

export default Index;

const Grouping = ({ groupby, setGroupby }) => {
  const [open, setOpen] = useState(null);
  const options = [
    { name: "Purchased Bill No.", value: "pb_no" },
    { name: "Item", value: "item_id" },
    { name: "Project", value: "project_id" },
    { name: "User", value: "user_id" },
  ];
  const handleClick = (v) => {
    setGroupby(v);
    setOpen(null);
  };
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"flex-start"}
        alignItems={"center"}
      >
        <Bold>{groupby?.name}</Bold>
        <Icon
          sx={{ cursor: "pointer" }}
          onClick={(e) => setOpen(e.currentTarget)}
        >
          arrow_drop_down
        </Icon>
      </Stack>
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

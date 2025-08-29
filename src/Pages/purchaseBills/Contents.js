import React, { useState } from "react";
import { useIndexPBQuery } from "../../features/purcasheBill/purchaseBillApi";
import dayjs from "dayjs";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { viewPB } from "../../features/purcasheBill/purchaseBillSlice";
import { Body1, Bold } from "../../components/ui/MyTypo";
import useIsMobile from "../../hooks/useIsMobile";

export const Contents = () => {
  //   const theme = useTheme();
  //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = useIsMobile();
  // local State
  const period = useSelector((S) => S.purchaseBillSlice.period);
  // Api Call\
  const {
    data = [],
    isLoading,
    isFetching,
  } = useIndexPBQuery({ period: period });

  // render
  return (
    <>
      {isMobile ? (
        <MobileVersion data={data} />
      ) : (
        <TableContainer sx={{ maxHeight: "80vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TP children="Date / PB NO" />
                </TableCell>
                <TableCell>
                  <TP children="User" />
                </TableCell>
                <TableCell>
                  <TP children="Bill Amount" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.data?.map((item, i) => (
                <TRow key={i} item={item} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

const TRow = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <TableRow>
      {console.log("renders")}
      <TableCell>
        <Button
          onClick={() => dispatch(viewPB(item?.pb_no))}
          sx={{ m: 0, p: 0 }}
        >
          <TP>{"PB # : " + item?.pb_no}</TP>
        </Button>
        <TP>{dayjs(item?.created_at).format("DD-MM-YYYY")}</TP>
      </TableCell>
      <TableCell>
        <TP>{item?.user_name.toUpperCase()}</TP>
      </TableCell>
      <TableCell>
        <TP>{item?.BillAmount}</TP>
      </TableCell>
    </TableRow>
  );
};

const MobileVersion = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <>
      {data?.data?.map((v, i) => (
        <Card key={i} component={Paper} sx={{ mb: 0.5 }}>
          <CardContent>
            {console.log("renders")}
            <Chip
              sx={{ px: 1, mb: 1, borderRadius: 1, width: "100%" }}
              size="medium"
              color="primary"
              onClick={() => dispatch(viewPB(v?.pb_no))}
              avatar={<Avatar>PB</Avatar>}
              label={<Bold>{v.pb_no}</Bold>}
              clickable
            />
            <Body1>{`Date: ${dayjs(v.created_at).format("DD-MM-YYYY")}`}</Body1>
            <Body1 gutterBottom>{`User: ${v.user_name}`}</Body1>
            <Stack direction={"row"} justifyContent={"flex-end"}>
              <Chip
                sx={{ mx: 1, borderRadius: 1 }}
                variant="outlined"
                label={<Body1>{`Amount: ${v.BillAmount}`}</Body1>}
              />
            </Stack>
          </CardContent>
        </Card>
      ))}
    </>
  );
};
const TP = (props) => <Typography {...props}></Typography>;

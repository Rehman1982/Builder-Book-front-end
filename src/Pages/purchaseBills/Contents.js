import React, { useState } from "react";
import { useIndexPBQuery } from "../../features/purcasheBill/purchaseBillApi";
import dayjs from "dayjs";
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { viewPB } from "../../features/purcasheBill/purchaseBillSlice";

export const Contents = () => {
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
          {data?.map((item, i) => (
            <TRow key={i} item={item} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const TRow = ({ item }) => {
  const dispatch = useDispatch();
  return (
    <TableRow>
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

const TP = (props) => <Typography {...props}></Typography>;

import React, {
  useImperativeHandle,
  forwardRef,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Box,
  useMediaQuery,
  useTheme,
  IconButton,
  Stack,
  TableFooter,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import dayjs from "dayjs";
import Messenger from "../messenger/Messenger";
import _ from "lodash";
import API from "../../api/axiosApi";
import { useShowQuery } from "../../features/creditBill/creditBillApi";
import { useDispatch, useSelector } from "react-redux";
import { clear } from "../../features/creditBill/creditBillSlice";
import { openMessenger } from "../../features/messenger/messengerSlice";
// import {useShowQuery} from "../../features/creditBill/creditBillSlice";

const CURD = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.creditBillSlice?.ui?.viewComponent);
  const billNo = useSelector(
    (state) => state.creditBillSlice.selectedBill.Bill_no
  );
  const { data, isLoading, isError } = useShowQuery({ bill_no: billNo });

  const [billInfo, setBillInfo] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const MessengerRef = useRef(null);
  const [messenger, setMessenger] = useState({
    type: "creditBills",
    id: null,
  });
  // const handleOpenMessenger = useCallback((billId) => {
  //   setMessenger({ type: "creditBills", id: billId });
  //   MessengerRef.current.open();
  // }, []);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // useImperativeHandle(ref, () => ({
  //   open: () => setOpen(true),
  //   close: () => setOpen(false),
  // }));
  // const getData = async () => {
  //   try {
  //     const result = await API.get("transactions/creditBills/1", {
  //       params: { bill_no: billNo },
  //     });
  //     setBillInfo(result?.data?.bill);
  //     setBillItems(result?.data?.details);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  useEffect(() => {
    console.log("Vendor Bill DAta", data);
    setBillInfo(data?.bill || null);
    setBillItems(data?.details || []);
  }, [data]);
  return (
    <Dialog
      open={open}
      onClose={() => dispatch(clear())}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
    >
      <Messenger />
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          Bill No:{billNo || ""}
          <Typography variant="subtitle2" color="text.secondary">
            {billInfo?.bill_desp}
          </Typography>
        </Box>
        <IconButton onClick={() => dispatch(clear(false))} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: { xs: 1, sm: 3 }, py: 2 }}>
        {billInfo && (
          <Stack
            mb={2}
            direction={"row"}
            justifyContent="space-evenly"
            alignItems={"center"}
          >
            <Typography variant="body2">
              <strong>PO ID:</strong> {billInfo?.po_id}
            </Typography>
            <Typography variant="body2">
              <strong>Status:</strong>{" "}
              {billInfo?.status == "approved"
                ? "Approved"
                : billInfo?.status == "pending"
                ? "Pending"
                : "Returned "}
            </Typography>
            <Typography variant="body2">
              <strong>Created At:</strong>{" "}
              {dayjs(billInfo.created_at).format("DD-MM-YYYY")}
            </Typography>
          </Stack>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Item</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Qty</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Rate</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item?.item_name}</TableCell>
                  <TableCell>{item?.desp}</TableCell>
                  <TableCell align="right">
                    {parseFloat(item?.qty).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {parseFloat(item?.rate).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {parseFloat(item.Total).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={4}>Bill Amount</TableCell>
                <TableCell align="right">
                  {_.sumBy(billItems, (bi) => Number(bi.Total))}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() =>
            dispatch(openMessenger({ type: "creditBills", id: billNo }))
          }
          color="primary"
          variant="contained"
          fullWidth={fullScreen}
        >
          Messages
        </Button>
        <Button
          onClick={() => dispatch(clear())}
          color="primary"
          variant="outlined"
          fullWidth={fullScreen}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default CURD;

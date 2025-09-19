import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { Body1, Bold } from "../../components/ui/MyTypo";
import dayjs from "dayjs";
import useIsMobile from "../../hooks/useIsMobile";
import { IButton } from "../../components/ui/UiComponents";
import CURD from "./CURD";
import { useDispatch } from "react-redux";
import { viewPayment } from "../../features/VendorPayments/vendorPaymentSlice";
import { openDetails } from "../../features/reports/reportSlice";

const Contents = ({ data, groupby }) => {
  const isMobile = useIsMobile();
  return (
    <Box>
      <CURD />

      <List dense>
        {data?.map((v, i) => (
          <Brow key={i} item={v} groupby={groupby} />
        ))}
      </List>
    </Box>
  );
};
export default Contents;

const Brow = ({ item, groupby }) => {
  const dispatch = useDispatch();
  return (
    <ListItemButton
      divider
      dense
      onClick={() =>
        dispatch(
          openDetails({
            title: item?.display_name,
            groupOn: "vendor_id",
            condition: [
              { key: groupby.value, value: item.id },
              { key: "t.payment_no", value: "NotNull" },
              { key: "j.credit", value: "0" },
            ],
          })
        )
      }
    >
      <ListItemText
        primary={<Bold variant="subtitle1">{item?.display_name}</Bold>}
        secondary={<Body1>{"Amount: " + item?.debit}</Body1>}
      />
    </ListItemButton>
  );
};

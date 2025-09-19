import React, { useEffect, useState } from "react";
import { useIndexPBQuery } from "../../features/purcasheBill/purchaseBillApi";
import dayjs from "dayjs";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItemButton,
  ListItemText,
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
import { openDetails } from "../../features/reports/reportSlice";

export const Contents = ({ state, groupby }) => {
  const disp = useDispatch();
  const isMobile = useIsMobile();
  // local State
  const period = useSelector((S) => S.purchaseBillSlice.period);
  // render
  return (
    <>
      {
        <List>
          {state?.map((v, i) => (
            <ListItemButton
              key={i}
              divider
              dense
              onClick={() =>
                disp(
                  openDetails({
                    title: v?.display_name,
                    groupOn: "user_id",
                    condition: { key: groupby?.value, value: v?.id },
                  })
                )
              }
            >
              <ListItemText
                primary={<Bold variant="subtitle1">{v?.display_name}</Bold>}
                secondary={
                  <Typography fontWeight={600} variant="subtitle2">
                    {"Amount : " + v?.debit}
                  </Typography>
                }
              />
            </ListItemButton>
          ))}
        </List>

        // <TableContainer sx={{ maxHeight: "80vh" }}>
        //   <Table stickyHeader>
        //     <TableHead>
        //       <TableRow>
        //         <TableCell>
        //           <Bold children="Date / PB NO" />
        //         </TableCell>
        //         <TableCell>
        //           <Bold children="User" />
        //         </TableCell>
        //         <TableCell>
        //           <Bold children="Bill Amount" />
        //         </TableCell>
        //       </TableRow>
        //     </TableHead>
        //     <TableBody>
        //       {state?.map((item, i) => (
        //         <TRow key={i} item={item} />
        //       ))}
        //     </TableBody>
        //   </Table>
        // </TableContainer>
      }
    </>
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

const MobileVersion = ({ state }) => {
  const dispatch = useDispatch();
  return (
    <Box height={"80vh"} overflow={"auto"}>
      {state?.map((v, i) => (
        <Card key={i} component={Paper} sx={{ mb: 0.5 }}>
          <CardContent>
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
    </Box>
  );
};
const TP = (props) => <Typography {...props}></Typography>;

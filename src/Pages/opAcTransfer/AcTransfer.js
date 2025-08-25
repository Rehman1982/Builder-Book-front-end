import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import PageLayout from "../../components/ui/PageLayout";
import { fontSize, Stack } from "@mui/system";
import { useIndexAcTransferQuery } from "../../features/acTransfer/acTransferApi";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Collapse,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { blue, green, grey, red } from "@mui/material/colors";
import ViewTransfer from "./ViewTransfer";
import {
  createAcTranfer,
  viewAcTranfer,
} from "../../features/acTransfer/acTransferSlice";

const AcTransfer = () => {
  const dispatch = useDispatch();
  // globale State

  // local Sate
  const currentDate = dayjs();
  const [period, setPeriod] = useState({
    from: currentDate.startOf("month").format("YYYY-MM-DD"),
    to: currentDate.endOf("month").format("YYYY-MM-DD"),
  });
  const [group, setGroup] = useState(null);
  const [groupData, setGroupData] = useState(null);
  // API Calls
  const {
    data = [],
    isLoading,
    isFetching,
  } = useIndexAcTransferQuery({ period: period });
  // functions
  const state = useMemo(() => {
    if (isLoading || isFetching) return [];
    if (group) {
      const formatData = data.map((v) => ({
        ...v,
        created_at: dayjs(v.created_at).format("YYYY-MM-DD"),
      }));
      setGroupData(_.groupBy(formatData, group));
      console.log(groupData);
    } else {
      setGroupData(null);
    }
    return data;
  }, [data, group]);
  // Render
  return (
    <Paper sx={{ p: 2 }} elevation={3}>
      <ViewTransfer />
      <PageLayout
        create={
          <>
            <Grouping group={group} setGroup={setGroup} />
            <IconButton
              onClick={() => dispatch(createAcTranfer())}
              sx={{ bgcolor: blue[100] }}
            >
              <Icon>add</Icon>
            </IconButton>
          </>
        }
        period={period}
        setPeriod={(v) => setPeriod(v)}
      >
        {isLoading || isFetching ? (
          Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} height={60} />
          ))
        ) : groupData ? (
          <GroupedData groupData={groupData} exludekey={group} />
        ) : (
          <Contents state={state} />
        )}
      </PageLayout>
    </Paper>
  );
};

const Contents = ({ state }) => {
  const dispatch = useDispatch();
  return (
    <TableContainer sx={{ maxHeight: "75vh" }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>TrnfsNO.</TableCell>
            <TableCell>Transfered BY</TableCell>
            <TableCell>Transfered To</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {state?.map((v, i) => (
            <TableRow key={i}>
              <TableCell>
                <Button
                  onClick={() => dispatch(viewAcTranfer(v.actransfer_no))}
                  sx={{ m: 0, p: 0 }}
                >
                  Transfer #: {v.actransfer_no || ""}
                </Button>
                <Typography variant="body2">
                  {dayjs(v.created_at).format("YYYY-MM-DD")}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">{v.transfer_by_user}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">AC: {v.transfer_to_ac}</Typography>
                <Typography variant="body2">
                  User: {v.trasfer_to_user}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {_.toNumber(v.amount).toLocaleString()}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const Grouping = ({ group, setGroup }) => {
  const groupArray = [
    { name: "Date", value: "created_at" },
    { name: "Transfered By", value: "transfer_by_user" },
    { name: "Transfered To AC", value: "transfer_to_ac" },
    { name: "Transfered To User", value: "trasfer_to_user" },
  ];
  return (
    <TextField
      size="small"
      value={group || ""}
      onChange={(e) => setGroup(e.target.value)}
      SelectProps={{ displayEmpty: true }}
      select
    >
      <MenuItem value="">
        <em>Select Group...</em>
      </MenuItem>
      {groupArray.map((v, i) => (
        <MenuItem key={i} value={v.value}>
          {v.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

const GroupedData = ({ groupData, exludekey }) => {
  return (
    <Box>
      {Object.entries(groupData).map(([heading, data]) => (
        <CollapseAble heading={heading} data={data} exludekey={exludekey} />
      ))}
    </Box>
  );
};
const CollapseAble = ({ heading, data, exludekey }) => {
  const dispatch = useDispatch();
  const Headers = [
    { name: "TRF NO.", value: "actransfer_no" },
    { name: "Date", value: "created_at" },
    { name: "Transfered By", value: "transfer_by_user" },
    { name: "Transfered To", value: "transfer_to_ac" },
    { name: "Transfer To (user)", value: "trasfer_to_user" },
    { name: "Amount", value: "amount" },
  ];
  const [open, setOpen] = useState(false);

  return (
    <>
      <Collapse in={open}>
        <Grid
          sx={{ cursor: "pointer" }}
          bgcolor={blue[100]}
          onClick={() => setOpen(false)}
          container
          columns={2}
          justifyContent={"space-between"}
          borderBottom={0.5}
          borderColor={"divider"}
          p={1}
          my={1}
          borderRadius={1}
        >
          <Grid textAlign={"left"} item sm={1}>
            <Stack direction={"row"} alignItems={"center"}>
              <Icon sx={{ fontSize: "0.9rem", mr: 1 }}>remove</Icon>
              <TP>{heading}</TP>
            </Stack>
          </Grid>
        </Grid>

        <Box component={Paper} elevation={3} p={2} mb={1}>
          <Grid
            px={1}
            bgcolor={grey[200]}
            container
            columns={Headers.length - 1}
            justifyContent={"flex-end"}
          >
            {Headers.filter((v) => v.value !== exludekey).map((v, i) => (
              <Grid key={i} p={0.5} textAlign={"justify"} sm={1} item>
                <TP fontWeight={600}>{v.name}</TP>
              </Grid>
            ))}
          </Grid>
          {data.map((v, i) => (
            <Grid
              key={i}
              p={0.5}
              borderBottom={0.5}
              borderColor={grey[300]}
              container
              columns={Headers.length - 1}
              justifyContent={"flex-end"}
              alignItems={"center"}
            >
              {Headers.filter((v) => v.value !== exludekey).map((header, i) => (
                <Grid key={i} textAlign={"justify"} item sm={1}>
                  {header.value === "actransfer_no" ? (
                    <Button
                      sx={{ p: 0, m: 0 }}
                      onClick={() => dispatch(viewAcTranfer(v?.actransfer_no))}
                    >
                      <TP>{v[header.value]}</TP>
                    </Button>
                  ) : (
                    <TP>{v[header.value]}</TP>
                  )}
                </Grid>
              ))}
            </Grid>
          ))}
          <Grid
            p={0.5}
            bgcolor={grey[200]}
            container
            columns={Headers.length - 1}
            justifyContent={"flex-end"}
          >
            {Headers.filter((v) => v.value !== exludekey).map((v, i) => (
              <Grid key={i} textAlign={"justify"} sm={1} item>
                {i === 0 && <TP fontWeight={600}>Total</TP>}
                <TP fontWeight={600}>
                  {i + 1 === Headers.length - 1 &&
                    _.chain(data)
                      .sumBy((i) => i.amount)
                      .value()}
                </TP>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
      {!open && (
        <Grid
          sx={{ cursor: "pointer" }}
          bgcolor={blue[100]}
          onClick={() => setOpen(true)}
          container
          columns={2}
          justifyContent={"space-between"}
          borderBottom={0.5}
          borderColor={"divider"}
          p={1}
          my={0.2}
          borderRadius={1}
        >
          <Grid textAlign={"left"} item sm={1}>
            <Stack direction={"row"} alignItems={"center"}>
              <Icon sx={{ fontSize: "0.9rem", mr: 1 }}>add</Icon>
              <TP>{heading}</TP>
            </Stack>
          </Grid>
          <Grid textAlign={"right"} item sm={1}>
            <TP>
              {_.chain(data)
                .sumBy((i) => i.amount)
                .value()}
            </TP>
          </Grid>
        </Grid>
      )}
    </>
  );
};
export default AcTransfer;

const TP = (props) => {
  return <Typography variant="body2" color={blue[900]} {...props}></Typography>;
};

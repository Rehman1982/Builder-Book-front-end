import {
  Autocomplete,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closePB } from "../../features/purcasheBill/purchaseBillSlice";
import { Body1, Body2, Bold } from "../../components/ui/MyTypo";
import {
  useCreatePBQuery,
  useShowPBQuery,
} from "../../features/purcasheBill/purchaseBillApi";
import { blue, orange } from "@mui/material/colors";
import _ from "lodash";
import dayjs from "dayjs";

export const CURD = () => {
  const dispatch = useDispatch();
  const showComp = useSelector((S) => S.purchaseBillSlice.showComp);
  const variant = useSelector((S) => S.purchaseBillSlice.variant);
  const pbNo = useSelector((S) => S.purchaseBillSlice.pbNo);
  const {
    data = [],
    isLoading,
    isError,
  } = useShowPBQuery(
    {
      pb_no: pbNo,
    },
    { skip: !pbNo || variant !== "view" }
  );
  useCreatePBQuery({}, { skip: variant !== "create" });
  return (
    <Dialog
      open={showComp}
      onClose={() => dispatch(closePB())}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle></DialogTitle>
      <DialogContent>
        <CreateEntry />
        <TransDetails />
        <JRItem />
      </DialogContent>
      <DialogActions sx={{ mx: 2 }}>
        <ButtonGroup>
          {variant !== "create" && (
            <Button color="success" endIcon={<Icon>print</Icon>}>
              Print
            </Button>
          )}
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

const JRItem = () => {
  const dispatch = useDispatch();
  // global state
  const { variant, jrDetails } = useSelector((S) => S.purchaseBillSlice);
  //API Call
  useEffect(() => {
    console.log("JR DATAA", jrDetails);
  }, [jrDetails]);
  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Item / Desp</TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jrDetails?.map((v, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Body1>{v?.item_name}</Body1>
                  <Body1>{v?.desp}</Body1>
                </TableCell>
                <TableCell>
                  <Body1>{v?.qty}</Body1>
                </TableCell>
                <TableCell>
                  <Body1>{v?.rate}</Body1>
                </TableCell>
                <TableCell>
                  <Body1>{v?.debit}</Body1>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {jrDetails?.length > 1 && (
        <Stack
          bgcolor={orange[100]}
          component={Paper}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          mt={1}
          px={5}
          py={1}
        >
          <Bold>Bill Amount</Bold>
          <Bold>{_.round(_.sumBy(jrDetails, "debit"))}</Bold>
        </Stack>
      )}
    </>
  );
};

const TransDetails = () => {
  const transDetails = useSelector((S) => S.purchaseBillSlice.transDetails);
  return (
    <Grid
      component={Paper}
      container
      px={2}
      py={1}
      justifyContent={"center"}
      border={1}
      borderColor={"divider"}
      textAlign={"center"}
      mb={1}
      borderRadius={2}
      rowGap={1}
    >
      <Grid item xs={6} md={3}>
        <Body1>PB #</Body1>
        <Body2>{transDetails?.pb_no}</Body2>
      </Grid>
      <Grid item xs={6} md={3}>
        <Body1>Trans NO.</Body1>
        <Body2>{transDetails?.trans_no}</Body2>
      </Grid>
      <Grid item xs={6} md={3}>
        <Body1>Date</Body1>
        <Body2>{dayjs(transDetails?.created_at).format("DD-MM-YYYY")}</Body2>
      </Grid>
      <Grid item xs={6} md={3}>
        <Body1>User</Body1>
        <Body2>{transDetails?.user_name}</Body2>
      </Grid>
    </Grid>
  );
};

const CreateEntry = () => {
  const { items, projects } = useSelector((S) => S.purchaseBillSlice);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({});
  const handleChange = (name, value) => {
    setState((prv) => ({ ...prv, [name]: value }));
  };
  // {
  //   desp: "",
  //   item_id: "",
  //   item_name: "",
  //   project_id: "",
  //   project_name: "",
  //   qty: 0,
  //   rate: 0,
  //   debit: 0,
  // },
  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        sx={{ border: 1, borderColor: blue[300] }}
      >
        <Icon>add</Icon>
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <MyInpute
            name="desp"
            value={state?.desp || ""}
            onChange={(e) => handleChange("desp", e.target.value)}
            label="Description"
          />
          <Autocomplete
            options={items || []}
            getOptionLabel={(opt) => opt.item}
            value={_.get(
              _.find(items, (o) => o.id === state.item_id),
              "item"
            )}
            renderInput={(params) => <MyInpute {...params} label="Item" />}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const MyInpute = (props) => {
  return <TextField {...props} margin="dense" fullWidth />;
};

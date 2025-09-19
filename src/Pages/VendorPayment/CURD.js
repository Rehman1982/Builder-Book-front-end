import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Icon,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addJR,
  closePayment,
  deleteJR,
  editPayment,
  updateJR,
} from "../../features/VendorPayments/vendorPaymentSlice";
import {
  useCreateQuery,
  useShowQuery,
  useStoreMutation,
} from "../../features/VendorPayments/vendorPaymentApi";
import { Body1, Body2, Bold } from "../../components/ui/MyTypo";
import dayjs from "dayjs";
import { blue, orange } from "@mui/material/colors";
import { IButton } from "../../components/ui/UiComponents";
import _ from "lodash";
import { BorderColor, X } from "@mui/icons-material";

const CURD = () => {
  const JREntryRef = useRef(null);
  const dispatch = useDispatch();
  // gloabal Sate
  const { paymentNo, variant, showComp } = useSelector(
    (S) => S.vendorPaymentSlice
  );
  // Local State

  // API Call
  useShowQuery(
    { payment_no: paymentNo },
    { skip: !showComp || paymentNo == null || variant === "create" }
  );
  useCreateQuery({}, { skip: !showComp || variant !== "create" });
  // Action
  //   useEffect(() => {
  //     console.log("CURD DAta", transDetails, jrDetails);
  //   }, [transDetails, jrDetails]);
  // Render
  return (
    <Dialog
      open={showComp}
      onClose={() => dispatch(closePayment())}
      maxWidth="sm"
      fullWidth
    >
      <DialogContent sx={{ m: 0, p: 0 }}>
        <Card variant="outlined">
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: orange[600] }}></Avatar>}
            title={<TransDetails />}
          />
          <CardContent>
            <JREntry ref={JREntryRef} />
            <Stack direction={"row"} justifyContent={"flex-end"}>
              <IButton
                size="small"
                onClick={() =>
                  JREntryRef.current.open({ index: null, data: {} })
                }
              >
                <Icon>add</Icon>
              </IButton>
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Bold>Vendor / Project</Bold>
                  </TableCell>
                  <TableCell colSpan={variant === "view" ? 1 : 2}>
                    <Bold>Amount</Bold>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <JrDetails JREntryRef={JREntryRef} />
              </TableBody>
            </Table>
          </CardContent>
          <CardActionArea>
            <CardActions sx={{ mx: 1 }}>
              <ActionBts />
            </CardActions>
          </CardActionArea>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
export default CURD;

const TransDetails = () => {
  const { transDetails, jrDetails } = useSelector((S) => S.vendorPaymentSlice);
  return (
    <Grid container spacing={0.5}>
      <Grid item sm={8}>
        {transDetails?.payment_no && (
          <Body1>{`Payment No: ${transDetails?.payment_no || ""}`}</Body1>
        )}
      </Grid>
      <Grid item sm={4}>
        {transDetails?.created_at && (
          <Body1>{`Date: ${dayjs(transDetails?.created_at).format(
            "DD-MMM-YYYY"
          )}`}</Body1>
        )}
      </Grid>
      <Grid item sm={4}>
        {transDetails?.user_name && (
          <Body1>{`Paid by: ${transDetails?.user_name || ""}`}</Body1>
        )}
      </Grid>
    </Grid>
  );
};
const JrDetails = ({ JREntryRef }) => {
  const disp = useDispatch();
  const jrDetails = useSelector((S) => S.vendorPaymentSlice.jrDetails);
  const variant = useSelector((S) => S.vendorPaymentSlice.variant);
  return jrDetails?.map((v, i) => (
    <TableRow key={i}>
      <TableCell>
        <Body2 fontWeight={650}>{v?.vendor_name}</Body2>
        <Body2>{v?.project_name}</Body2>
      </TableCell>
      <TableCell>
        <Body2>{v?.debit}</Body2>
      </TableCell>
      {variant !== "view" && (
        <TableCell padding="checkbox">
          <ButtonGroup size="small" sx={{ m: 0.5 }}>
            <IButton
              size="small"
              onClick={() => JREntryRef.current.open({ index: i, data: v })}
            >
              <Icon>edit</Icon>
            </IButton>
            <IButton size="small" onClick={() => disp(deleteJR(i))}>
              <Icon>delete</Icon>
            </IButton>
          </ButtonGroup>
        </TableCell>
      )}
    </TableRow>
  ));
};

const JREntry = forwardRef((props, ref) => {
  const disp = useDispatch();
  useImperativeHandle(ref, () => ({
    open: (data) => {
      if (data) setState(data);
      setOpen(true);
    },
  }));
  // Global State
  const { projects, vendors, variant } = useSelector(
    (S) => S.vendorPaymentSlice
  );
  // Local State
  const [state, setState] = useState({
    index: null,
    data: {},
  });
  const [open, setOpen] = useState(false);
  const handleChange = (name, value) => {
    setState((prv) => ({
      ...prv,
      data: { ...prv["data"], [name]: value },
    }));
  };
  useCreateQuery(
    {
      project_id: state.data.project_id,
      vendor_id: state.data.vendor_id,
    },
    { skip: variant !== "create" }
  );
  // Functions
  const handleClick = () => {
    if (state.index === null) {
      disp(addJR(state.data));
      setOpen(false);
    } else {
      disp(updateJR(state));
      setOpen(false);
    }
  };
  useEffect(() => {
    console.log(state);
  }, [state]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogContent>
        <Autocomplete
          options={projects || []}
          getOptionLabel={(opt) => opt.name || ""}
          value={
            _.find(projects, (o) => o?.id === state?.data?.project_id) || ""
          }
          onChange={(e, v) => {
            handleChange("vendor_id", null);
            handleChange("TotalAmount", null);
            handleChange("project_id", v?.id || null);
            handleChange("project_name", v?.name || null);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Project" margin="dense" />
          )}
        />
        <Autocomplete
          options={vendors || []}
          getOptionLabel={(opt) => `${opt.vendor_name} - ${opt.amount}` || {}}
          value={
            _.find(vendors, (o) => o?.vendor_id === state?.data?.vendor_id) ||
            null
          }
          onChange={(e, v) => {
            handleChange("TotalAmount", v?.amount || null);
            handleChange("vendor_id", v?.vendor_id || null);
            handleChange("vendor_name", v?.vendor_name || null);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Vendor" margin="dense" />
          )}
        />
        <TextField
          disabled
          value={state?.data?.TotalAmount || ""}
          margin="dense"
          label="Liability in Selected Project"
          fullWidth
        />
        <TextField
          multiline
          rows={3}
          value={state?.data?.desp || ""}
          margin="dense"
          onChange={(e) => handleChange("desp", e.target.value)}
          label="Description"
          fullWidth
        />
        <TextField
          multiline
          value={state?.data?.debit || ""}
          margin="dense"
          onChange={(e) => handleChange("debit", e.target.value)}
          label="Amount"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        {state.index !== null ? (
          <Button variant="outlined" onClick={handleClick}>
            Update
          </Button>
        ) : (
          <Button variant="outlined" onClick={handleClick}>
            Add
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});

const ActionBts = () => {
  const disp = useDispatch();
  const { variant } = useSelector((S) => S.vendorPaymentSlice);
  return (
    <ButtonGroup fullWidth>
      {variant === "create" && <Create />}
      {variant === "view" && (
        <Button onClick={() => disp(editPayment())}>Edit</Button>
      )}
      {variant === "edit" && <Update />}
    </ButtonGroup>
  );
};

const Create = () => {
  // global State
  const { variant, transDetails, jrDetails } = useSelector(
    (S) => S.vendorPaymentSlice
  );
  // Local State
  // API Call
  const [store, { isLoading, isSuccess, isError }] = useStoreMutation();
  const callApi = async () => {
    try {
      const res = await store({
        jrDetails: jrDetails,
      }).unwrap();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  if (jrDetails.length > 0) return <Button onClick={callApi}>Save</Button>;
};
const Update = () => {
  return <Button>Update</Button>;
};

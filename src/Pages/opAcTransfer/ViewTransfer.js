import {
  Autocomplete,
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Icon,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
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
  addEntry,
  closeAcTranfer,
  deleteEntry,
  editAcTranfer,
  selectEntry,
  setEntryErrors,
  setTransferParams,
  updateEntry,
} from "../../features/acTransfer/acTransferSlice";
import { blue, orange } from "@mui/material/colors";
import dayjs from "dayjs";
import {
  useCreateAcTransferQuery,
  useShowAcTransferQuery,
  useStoreAcTransferMutation,
  useUpdateAcTransferMutation,
} from "../../features/acTransfer/acTransferApi";
import { toast } from "../../features/alert/alertSlice";
import _ from "lodash";
import { Error } from "../../components/ui/helpers";

const ViewTransfer = () => {
  const dispatch = useDispatch();
  const { variant, showComp, selectedEntry } = useSelector(
    (S) => S.acTransferSlice
  );
  return (
    <Dialog
      open={showComp}
      onClose={() => {
        dispatch(closeAcTranfer());
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {variant === "create"
          ? variant.toUpperCase()
          : selectedEntry?.transferNo}
      </DialogTitle>
      <DialogContent>
        {variant !== "create" && <TransDetails />}
        <Create />
      </DialogContent>
      <DialogActions sx={{ mx: 2 }}>
        <ButtonGroup>
          {variant === "view" && (
            <Button
              color="success"
              endIcon={<Icon>print</Icon>}
              onClick={() => {
                alert("under development");
              }}
            >
              Print
            </Button>
          )}
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};
const Create = () => {
  const { variant, entries, errors, transferNo } = useSelector(
    (S) => S.acTransferSlice
  );
  const {
    data = [],
    isLoading,
    isFetching,
  } = useShowAcTransferQuery(
    {
      transferNo: transferNo,
    },
    { skip: !transferNo || variant !== "view" }
  );
  const dispatch = useDispatch();
  const entryRef = useRef(null);
  return (
    <>
      {variant !== "view" && (
        <Stack direction={"row"} justifyContent={"flex-end"} mb={1}>
          <Entry ref={entryRef} />
        </Stack>
      )}
      <Stack>
        <Table size="small">
          <TableHead sx={{ bgcolor: blue[100] }}>
            <TableRow>
              <TableCell>Transfer To</TableCell>
              <TableCell>Desp</TableCell>
              <TableCell>Amount</TableCell>
              {variant !== "view" && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {entries?.map((v, i) => {
              return (
                <TableRow key={i}>
                  <TableCell>
                    <TP variant="body2">{v?.user?.name}</TP>
                    <TP variant="body2">{v?.account?.acctname}</TP>
                  </TableCell>
                  <TableCell>{v?.desp}</TableCell>
                  <TableCell>{v?.debit}</TableCell>
                  {variant !== "view" && (
                    <TableCell padding="checkbox">
                      <ButtonGroup size="small" sx={{ my: 0.5 }}>
                        <Button
                          color="warning"
                          onClick={() => {
                            entryRef.current.open({ index: i, data: v });
                          }}
                        >
                          <Icon>edit</Icon>
                        </Button>
                        <Button
                          color="error"
                          onClick={() => dispatch(deleteEntry(i))}
                        >
                          <Icon>delete</Icon>
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
          {entries.length > 1 && (
            <TableFooter sx={{ bgcolor: orange[100] }}>
              <TableRow>
                <TableCell colSpan={2}>
                  <TP>Total</TP>
                </TableCell>
                <TableCell>
                  <TP>{_.sumBy(entries, "debit")}</TP>
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
        {_.has(errors, "entries") && <Error name="entries" errors={errors} />}
        {_.has(errors, "Billamount") && (
          <Error name="Billamount" errors={errors} />
        )}

        <ButtonGroup sx={{ mt: 2, justifyContent: "flex-end" }}>
          {variant === "create" && <CreateButton />}
          {variant === "edit" && <UpdateButton />}
        </ButtonGroup>
      </Stack>
    </>
  );
};
const Entry = forwardRef((props, ref) => {
  const initialState = {
    index: null,
    data: { user: "", desp: "", amount: "" },
  };
  //
  const dispatch = useDispatch();
  //gloabl State

  // local State
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    index: null,
    data: { user: "", desp: "", amount: "" },
  });
  ////
  useImperativeHandle(ref, () => ({
    open: (data) => {
      setState(data || initialState);
      setOpen(true);
    },
  }));

  // API Calls
  const {
    data: users = [],
    isLoading,
    isFetching,
  } = useCreateAcTransferQuery();
  // functions
  const handleChange = (key, value) => {
    setState((prv) => ({ ...prv, data: { ...prv.data, [key]: value } }));
  };
  useEffect(() => {
    console.log(state);
  }, [state]);
  const handleSubmit = () => {
    if (state.index !== null) {
      dispatch(updateEntry(state));
    } else {
      dispatch(addEntry(state?.data));
    }
    setOpen(false);
    setState(initialState);
  };
  return (
    <>
      <IconButton
        sx={{ bgcolor: blue[100] }}
        onClick={() => setOpen(true)}
        size="small"
      >
        <Icon>add</Icon>
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <Autocomplete
            options={users?.users || []}
            getOptionLabel={(opt) => opt?.user || ""}
            onChange={(e, v) => handleChange("user", v)}
            value={state?.data?.user || {}}
            renderInput={(params) => <TextField {...params} label="User" />}
          />
          <TextField
            onChange={(e) => handleChange("desp", e.target.value)}
            value={state?.data?.desp || ""}
            fullWidth
            label="Description"
            margin="dense"
          />
          <TextField
            type="number"
            onChange={(e) => handleChange("debit", e.target.value)}
            value={state?.data?.debit || ""}
            fullWidth
            label="Amount"
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="outlined">
            "action"
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});
const TP = (props) => {
  return <Typography {...props}></Typography>;
};
export default ViewTransfer;

const CreateButton = () => {
  const dispatch = useDispatch();
  const entries = useSelector((S) => S.acTransferSlice.entries);
  const [storeAcTransfer, { isLoading, isError, isSuccess }] =
    useStoreAcTransferMutation();
  const handleAPI = async () => {
    try {
      await storeAcTransfer({ entries: entries }).unwrap();
      dispatch(
        toast({
          message: "Transfer Successfully!",
          severity: "success",
        })
      );
    } catch (error) {
      if (error?.status === 422) {
        dispatch(toast({ message: "Invalid Data provided" }));
        dispatch(setEntryErrors(error?.data?.errors));
      } else {
        dispatch(toast({ message: "Something went wrong" }));
      }
    }
  };
  return (
    <Button
      endIcon={isLoading ? <CircularProgress size={20} /> : <Icon>send</Icon>}
      variant="outlined"
      onClick={handleAPI}
    >
      Submit
    </Button>
  );
};
const UpdateButton = () => {
  const dispatch = useDispatch();
  const { transDetails, entries } = useSelector((S) => S.acTransferSlice);
  const [updateAcTransfer, { isLoading, isError, isSuccess }] =
    useUpdateAcTransferMutation();
  const handleAPI = async () => {
    alert();
    try {
      await updateAcTransfer({ tr: transDetails, entries: entries }).unwrap();
      dispatch(
        toast({
          message: "Transfer Successfully!",
          severity: "success",
        })
      );
    } catch (error) {
      if (error?.status === 422) {
        dispatch(toast({ message: "Invalid Data provided" }));
        dispatch(setEntryErrors(error?.data?.errors));
      } else {
        dispatch(toast({ message: "Something went wrong" }));
      }
    }
  };
  return (
    <Button
      color="warning"
      endIcon={isLoading ? <CircularProgress size={20} /> : <Icon>send</Icon>}
      variant="outlined"
      onClick={handleAPI}
    >
      Update
    </Button>
  );
};

const TransDetails = () => {
  const transDetails = useSelector((S) => S.acTransferSlice.transDetails);
  return (
    <Grid
      container
      columns={12}
      border={1}
      borderColor={"divider"}
      borderRadius={1}
      p={1}
      rowGap={2}
      mb={1}
    >
      <Grid item xs={6} md={3}>
        Transfer By
        <TP variant="body2">{transDetails?.transfer_by}</TP>
      </Grid>
      <Grid item xs={6} md={3}>
        Transfer No.
        <TP variant="body2">{transDetails?.transferNo}</TP>
      </Grid>
      <Grid item xs={6} md={3}>
        Transfer Date
        <TP variant="body2">
          {dayjs(transDetails?.created_at).format("DD-MM-YYYY")}
        </TP>
      </Grid>
      <Grid item xs={6} md={3}>
        Trans NO.
        <TP variant="body2">{transDetails?.trans_no}</TP>
      </Grid>
    </Grid>
  );
};

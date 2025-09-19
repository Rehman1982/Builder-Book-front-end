import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
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
  Typography,
  useMediaQuery,
  useTheme,
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
  closePB,
  deleteJR,
  editPB,
  setErrors,
  updateJR,
} from "../../features/purcasheBill/purchaseBillSlice";
import { Body1, Body2, Bold } from "../../components/ui/MyTypo";
import {
  useCreatePBQuery,
  useShowPBQuery,
  useStorePBMutation,
  useUpdatePBMutation,
} from "../../features/purcasheBill/purchaseBillApi";
import { blue, grey, orange } from "@mui/material/colors";
import _ from "lodash";
import dayjs from "dayjs";
import useIsMobile from "../../hooks/useIsMobile";
import { toast } from "../../features/alert/alertSlice";
import { Error } from "../../components/ui/helpers";
import { IButton } from "../../components/ui/UiComponents";

export const CURD = () => {
  const dispatch = useDispatch();
  const showComp = useSelector((S) => S.purchaseBillSlice.showComp);
  const variant = useSelector((S) => S.purchaseBillSlice.variant);
  const pbNo = useSelector((S) => S.purchaseBillSlice.pbNo);
  const { created_at } = useSelector((S) => S.purchaseBillSlice.transDetails);
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
  return (
    <Dialog
      open={showComp}
      onClose={() => dispatch(closePB())}
      maxWidth="md"
      fullWidth
    >
      <IButton
        onClick={() => dispatch(closePB())}
        sx={{ alignSelf: "flex-end", m: 1 }}
      >
        <Icon>close</Icon>
      </IButton>
      <DialogTitle>
        {pbNo
          ? `PB NO. ${pbNo}`
          : variant === "create" && variant?.toUpperCase()}
      </DialogTitle>
      <DialogContent>
        {variant !== "create" && <TransDetails />}
        <JRItem />
      </DialogContent>
      <DialogActions sx={{ mx: 2 }}>
        <ButtonGroup>
          {variant === "create" && <HandleCreate />}
          {variant === "edit" && <HandleUpdate />}
          {variant === "view" && (
            <>
              {dayjs(created_at).isValid &&
                dayjs(created_at).isSame(dayjs(), "day") && (
                  <Button
                    onClick={() => dispatch(editPB())}
                    color="warning"
                    endIcon={<Icon>edit</Icon>}
                  >
                    Edit
                  </Button>
                )}
              <Button color="success" endIcon={<Icon>print</Icon>}>
                Print
              </Button>
            </>
          )}
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
};

const JRItem = () => {
  const isMobile = useIsMobile();
  const createEntryRef = useRef(null);
  const dispatch = useDispatch();
  // global state
  const { variant, jrDetails, errors } = useSelector(
    (S) => S.purchaseBillSlice
  );
  //API Call
  useCreatePBQuery();
  useEffect(() => {
    console.log("JR DATAA", jrDetails);
  }, [jrDetails]);
  return (
    <>
      <Stack direction={"row"} justifyContent={"flex-end"} mb={1}>
        <CreateEntry ref={createEntryRef} />
      </Stack>

      {isMobile ? (
        <JRItemMobile createEntryRef={createEntryRef} />
      ) : (
        <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Item / Desp</TableCell>
                <TableCell>Qty</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Amount</TableCell>
                {variant !== "view" && (
                  <TableCell padding="checkbox"></TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {jrDetails?.map((v, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Body1>{v?.item_name}</Body1>
                    <Body1>{v?.desp}</Body1>
                    <Error name={`jrs.${i}.item_id`} errors={errors} />
                    <Error name={`jrs.${i}.desp`} errors={errors} />
                  </TableCell>
                  <TableCell>
                    <Body1>{v?.qty}</Body1>
                    <Error name={`jrs.${i}.qty`} errors={errors} />
                  </TableCell>
                  <TableCell>
                    <Body1>{v?.rate}</Body1>
                    <Error name={`jrs.${i}.rate`} errors={errors} />
                  </TableCell>
                  <TableCell>
                    <Body1>{v?.debit}</Body1>
                  </TableCell>
                  {variant !== "view" && (
                    <TableCell padding="checkbox">
                      <ButtonGroup>
                        <IconButton
                          onClick={() => {
                            createEntryRef.current.open({ index: i, data: v });
                          }}
                          sx={{ bgcolor: grey[200], mr: 1 }}
                          color="warning"
                          size="small"
                          children={<Icon>edit</Icon>}
                        />
                        <IconButton
                          onClick={() => {
                            dispatch(deleteJR(i));
                          }}
                          sx={{ bgcolor: grey[200] }}
                          color="error"
                          size="small"
                          children={<Icon>delete</Icon>}
                        />
                      </ButtonGroup>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {_.has(errors, "jrs") && <Error name="jrs" errors={errors} />}
      {_.has(errors, "opr_ac") && <Error name="opr_ac" errors={errors} />}
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
    <Card raised sx={{ mb: 1, bgcolor: blue[50] }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={6} md={3}>
            <Body1>{`PB#: ${transDetails?.pb_no}`}</Body1>
          </Grid>
          <Grid item xs={6} md={3}>
            <Body1>{`Trans#: ${transDetails?.trans_no}`}</Body1>
          </Grid>
          <Grid item xs={6} md={3}>
            <Body1>
              Date:
              {` ` + dayjs(transDetails?.created_at).format("DD-MM-YYYY")}
            </Body1>
          </Grid>
          <Grid item xs={6} md={3}>
            <Body1>{`User: ${transDetails?.user_name}`}</Body1>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const CreateEntry = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({ index: null, data: {} });
  useImperativeHandle(ref, () => ({
    open: (data) => {
      setOpen(true);
      if (data) setState(data);
    },
  }));
  const dispatch = useDispatch();
  const { items, projects } = useSelector((S) => S.purchaseBillSlice);
  const handleChange = (name, value) => {
    setState((prv) => ({ ...prv, data: { ...prv["data"], [name]: value } }));
  };
  const handleAdd = () => {
    if (state?.index !== null) {
      dispatch(updateJR(state));
      setState({ index: null, data: {} });
      setOpen(false);
    } else {
      dispatch(addJR(state?.data));
      setState({ index: null, data: {} });
    }
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
      <IButton
        onClick={() => {
          setState({ index: null, data: {} });
          setOpen(true);
        }}
      >
        <Icon>add</Icon>
      </IButton>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <MyInpute
            multiline
            rows={3}
            name="desp"
            value={state?.data?.desp || ""}
            onChange={(e) => handleChange("desp", e.target.value)}
            label="Description"
          />
          <Autocomplete
            options={items || []}
            getOptionLabel={(opt) => opt.item || ""}
            value={_.find(items, (o) => o?.id === state?.data?.item_id) || ""}
            onChange={(e, v) => {
              handleChange("item_id", v?.id);
              handleChange("item_name", v?.item);
            }}
            renderInput={(params) => <MyInpute {...params} label="Item" />}
          />
          <Autocomplete
            options={projects || []}
            getOptionLabel={(opt) => opt.name || ""}
            value={
              _.find(projects, (o) => o?.id === state?.data?.project_id) || ""
            }
            onChange={(e, v) => {
              handleChange("project_id", v?.id);
              handleChange("project_name", v?.name);
            }}
            renderInput={(params) => <MyInpute {...params} label="Project" />}
          />
          <Stack direction={"row"} justifyContent={"space-between"}>
            <MyInpute
              name="qty"
              value={state?.data?.qty || ""}
              onChange={(e) => {
                handleChange("qty", e.target.value);
                handleChange("debit", state?.data?.rate * e.target.value);
              }}
              label="Qty"
            />
            <MyInpute
              name="rate"
              value={state?.data?.rate || ""}
              onChange={(e) => {
                handleChange("rate", e.target.value);
                handleChange("debit", state?.data?.qty * e.target.value);
              }}
              label="Rate"
            />
          </Stack>
          <MyInpute
            name="Total"
            value={state?.data?.debit || ""}
            label="Total"
          />
        </DialogContent>
        <DialogActions sx={{ mx: 2 }}>
          <Button onClick={handleAdd} variant="outlined">
            {state.index !== null ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

const MyInpute = (props) => {
  return <TextField {...props} margin="dense" fullWidth />;
};

const JRItemMobile = ({ createEntryRef }) => {
  const dispatch = useDispatch();
  const { jrDetails, variant, errors } = useSelector(
    (S) => S.purchaseBillSlice
  );
  return (
    <Box>
      {jrDetails?.map((v, i) => (
        <Card
          key={i}
          sx={{ mb: 2, p: 1, bgcolor: blue[50] }}
          component={Paper}
          elevation={3}
        >
          <CardContent>
            <Stack>
              <Error name={`jrs.${i}.item_id`} errors={errors} />
              <Error name={`jrs.${i}.desp`} errors={errors} />
              <Error name={`jrs.${i}.qty`} errors={errors} />
              <Error name={`jrs.${i}.rate`} errors={errors} />
            </Stack>

            <Body1 variant="subtitle1" fontWeight="bold">
              {v?.item_name}
            </Body1>
            <Body2 color="text.secondary" gutterBottom>
              {v?.desp}
            </Body2>
            <Stack direction={"row"} justifyContent={"space-between"} mb={0.5}>
              <Bold>
                {v?.qty} @ {v?.rate}
              </Bold>
              <Bold>{v?.debit}</Bold>
            </Stack>

            {variant !== "view" && (
              <ButtonGroup sx={{ mt: 1 }}>
                <IconButton
                  onClick={() =>
                    createEntryRef.current.open({ index: i, data: v })
                  }
                  sx={{ bgcolor: grey[200], mr: 1 }}
                  color="warning"
                  size="small"
                >
                  <Icon>edit</Icon>
                </IconButton>
                <IconButton
                  onClick={() => dispatch(deleteJR(i))}
                  sx={{ bgcolor: grey[200] }}
                  color="error"
                  size="small"
                >
                  <Icon>delete</Icon>
                </IconButton>
              </ButtonGroup>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

const HandleCreate = () => {
  const dispatch = useDispatch();
  // Global State
  const { transDetails, jrDetails } = useSelector((S) => S.purchaseBillSlice);
  // API Call
  const [storePB, { isLoading, isError, isSuccess, error }] =
    useStorePBMutation();
  // Function
  const handleApi = async () => {
    try {
      await storePB({ jrs: jrDetails }).unwrap();
      dispatch(toast({ message: "Bill Generated!", severity: "success" }));
    } catch (error) {
      dispatch(setErrors(error?.data?.errors));
      console.log("Errors in Backend", error);
    }
  };

  return (
    <Button onClick={handleApi} color="primary" endIcon={<Icon>send</Icon>}>
      Save
    </Button>
  );
};
const HandleUpdate = () => {
  const dispatch = useDispatch();
  // Global State
  const { transDetails, jrDetails } = useSelector((S) => S.purchaseBillSlice);
  // API Call
  const [updatePB, { isLoading, isError, isSuccess, error }] =
    useUpdatePBMutation();
  // Function
  const handleApi = async () => {
    try {
      const res = await updatePB({
        transDetails: transDetails,
        jrs: jrDetails,
      }).unwrap();
      dispatch(toast({ message: "Bill Updated!", severity: "success" }));
      console.log("Reseult for Backend", res);
    } catch (error) {
      dispatch(setErrors(error?.data?.errors));
      console.log("Errors in Backend", error);
    }
  };

  return (
    <Button onClick={handleApi} color="warning" endIcon={<Icon>send</Icon>}>
      Update
    </Button>
  );
};

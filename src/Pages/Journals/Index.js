import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Icon,
  IconButton,
  Pagination,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { blue, orange } from "@mui/material/colors";
import dayjs from "dayjs";
import _ from "lodash";
import { NavLink, useNavigate } from "react-router-dom";
import PageLayout from "../../components/ui/PageLayout";
import {
  useLazyIndexJournalQuery,
  useIndexJournalQuery,
  useDestroyJournalMutation,
} from "../../features/journals/journalApi";
import { useDispatch, useSelector } from "react-redux";
import { create, edit, view } from "../../features/journals/journalSlice";
import { toast } from "../../features/alert/alertSlice";

const Index = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filters, setFilters] = React.useState([
    { label: "JR No.", name: "jrno", value: "" },
    { label: "TR#", name: "trans_no", value: "" },
    { label: "Project", name: "project", value: "" },
    { label: "Vendor", name: "vendor", value: "" },
    { label: "user", name: "user", value: "" },
    { label: "item", name: "Item", value: "" },
    { label: "text", name: "Text", value: "" },
  ]);
  const [period, setPeriod] = React.useState({
    from: dayjs().startOf("month").format("YYYY-MM-DD"),
    to: dayjs().endOf("month").format("YYYY-MM-DD"),
  });
  const [state, setState] = React.useState();
  const [totalPages, setTotalPages] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useIndexJournalQuery({
    page: currentPage,
    filters: filters,
    from: period.from,
    to: period.to,
  });
  useEffect(() => {
    setState(data?.data);
    setTotalPages(data?.last_page);
    console.log("API DATA", data);
    if (isError) {
      console.log(error);
    }
  }, [data, isError]);
  return (
    <PageLayout
      period={period}
      setPeriod={setPeriod}
      filters={filters}
      setFilters={setFilters}
      create={
        <IconButton
          onClick={() => {
            dispatch(create());
            navigate("/transactions/journals/create");
          }}
          sx={{ border: 1, borderColor: blue[400] }}
        >
          <Icon sx={{ color: blue[400] }}>add</Icon>
        </IconButton>
      }
      pagination={
        <Pagination
          count={totalPages}
          page={currentPage}
          defaultPage={1}
          size="small"
          onChange={(e, v) => setCurrentPage(v)}
        />
      }
    >
      {isLoading
        ? "loading..."
        : isError
        ? "Error in API"
        : state?.length > 0 && <Content data={state} />}
    </PageLayout>
  );
};

export default Index;

const Content = React.memo(({ data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return data?.map((trans) => (
    <Accordion key={trans.id} disableGutters>
      <AccordionSummary
        expandIcon={<Icon>arrow_drop_down</Icon>}
        sx={{ my: 1 }}
      >
        <Grid container alignItems={"center"} spacing={2}>
          {trans?.notation && (
            <Grid item xs={12}>
              <Typography variant="subtitle2">Notation</Typography>
              <Typography variant="body2">{trans.notation}</Typography>
            </Grid>
          )}
          <Grid item xs={3}>
            <Typography variant="subtitle2">JR No.</Typography>
            <Typography variant="body2">{trans.entry_no}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2">Trans No.</Typography>
            <Typography variant="body2">{trans.id}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2">User</Typography>
            <Typography variant="body2">{trans.user_name}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="subtitle2">Created On</Typography>
            <Typography variant="body2">
              {dayjs(trans.created_at).format("DD-MMM-YYYY hh:mm a")}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography variant="subtitle2">Amount (Rs)</Typography>
            <Typography variant="body2">
              {_.sumBy(trans.jrs, "debit")}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Table size="small">
          <TableBody>
            {trans?.jrs?.map((jr, index) => (
              <TableRow key={index}>
                <TableCell>
                  {jr.account_name && (
                    <Grid container alignItems={"center"} spacing={1}>
                      <Grid item xs={1}>
                        AC
                      </Grid>
                      <Grid item xs={11}>
                        <Typography variant="body2">
                          {jr.account_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {jr.vendor_name && (
                    <Grid container spacing={1} alignItems={"center"}>
                      <Grid item xs={1}>
                        Vendor
                      </Grid>
                      <Grid item xs={11}>
                        <Typography variant="body2">
                          {jr.vendor_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {jr.project_name && (
                    <Grid container spacing={1} alignItems={"center"}>
                      <Grid item xs={1}>
                        Project
                      </Grid>
                      <Grid item xs={11}>
                        <Typography variant="body2">
                          {jr.project_name}
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {jr.item_name && (
                    <Grid container spacing={1} alignItems={"center"}>
                      <Grid item xs={1}>
                        Item
                      </Grid>
                      <Grid item xs={11}>
                        <Typography variant="body2">{jr.item_name}</Typography>
                      </Grid>
                    </Grid>
                  )}
                  {jr.desp && (
                    <Grid container spacing={1} alignItems={"center"}>
                      <Grid item xs={1}>
                        Desp
                      </Grid>
                      <Grid item xs={11}>
                        <Typography variant="body2">{jr.desp}</Typography>
                      </Grid>
                    </Grid>
                  )}
                </TableCell>
                <TableCell>{jr.credit > 0 && jr.credit + " CR"}</TableCell>
                <TableCell>{jr.debit > 0 && jr.debit + " DR"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionDetails>
      <AccordionSummary>
        <ButtonGroup variant="outlined">
          <Button
            onClick={() => {
              dispatch(view(trans));
              navigate("/transactions/journals/create");
            }}
            children="View"
          />
          <Button
            onClick={() => {
              dispatch(edit(trans));
              navigate("/transactions/journals/create");
            }}
            children="Edit"
          />
          <DeleteButton trans={trans} />
        </ButtonGroup>
      </AccordionSummary>
    </Accordion>
  ));
});

const DeleteButton = ({ trans }) => {
  const dispatch = useDispatch();
  const [destroyJournal, { isLoading, isSuccess, isError, error }] =
    useDestroyJournalMutation();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <TextField
            name="code"
            onChange={(e) => setCode(e.target.value)}
            value={code}
            label="Signagory Code"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              destroyJournal({ code: code, trans_no: trans.id })
                .then((res) => {
                  console.log(res);
                  let message = "";
                  let severity = "error";
                  if (res?.error?.status === 422) {
                    message = Object.keys(res?.error?.data?.errors)
                      .map((key) => res?.error?.data?.errors[key])
                      .toString();
                  } else {
                    console.log(res);
                    message = "Operation Successful";
                    severity = "success";
                  }
                  dispatch(toast({ message: message, severity: severity }));
                })
                .catch((error) => {
                  console.log("errors", error);
                })
                .finally(() => setOpen(false));
            }}
          >
            Confirm
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

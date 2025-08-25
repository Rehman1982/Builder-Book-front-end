import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Grow,
  Icon,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { blue } from "@mui/material/colors";
import _, { debounce } from "lodash";
import { useCreateJournalQuery } from "../../features/journals/journalApi";
import { toast } from "../../features/alert/alertSlice";
import { useDispatch } from "react-redux";

const Add = forwardRef(
  ({ currentEntry, updateState, parentState, setParentState }, ref) => {
    const dispatch = useDispatch();
    const refs = {
      debit: useRef(null),
      credit: useRef(null),
      desp: useRef(null),
      project: useRef(null),
      vendor: useRef(null),
      item: useRef(null),
      account: useRef(null),
      addnew: useRef(null),
      debitBtn: useRef(null),
      creditBtn: useRef(null),
    };
    const { data: partials, isLoading, isError } = useCreateJournalQuery();
    const [mode, setMode] = useState("create");
    const delayOpen = useCallback(
      debounce(() => {
        setOpen(true);
      }, 600),
      []
    );
    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      edit: () => setMode("edit"),
      create: () => setMode("create"),
    }));
    const [entryType, setEntryType] = useState(null);
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({});
    const handleEnter = (e, next) => {
      if (e.key === "Enter") {
        refs[next]?.current.focus();
      }
    };
    const handleSaveNew = () => {
      if ((state.debit > 0 || state.credit > 0) && state.account) {
        setParentState([...parentState, state]);
        setState({});
        dispatch(
          toast({
            message: "JR Created Successfully!",
            severity: "success",
          })
        );
        setOpen(false);
        delayOpen();
      } else {
        dispatch(
          toast({
            message: "Check Debit, Credit and Account",
            severity: "error",
          })
        );
      }
    };
    const handleUpdate = () => {
      if (mode === "edit") {
        updateState((prv) => {
          let update = [...prv];
          console.log("beforUpdate", update[currentEntry.index]);
          update[currentEntry.index] = state;
          return update;
          // return update;
        });
        setOpen(false);
      }
    };
    useEffect(() => {
      if (currentEntry !== null) {
        setState(currentEntry.data);
      }
    }, [currentEntry]);
    useEffect(() => {
      console.log(state);
      if (state.credit > 0 && state.debit == 0) {
        setEntryType("credit");
      } else {
        setEntryType("debit");
      }
    }, [state.credit, state.debit]);
    useEffect(() => {
      if (parentState.length > 0) {
        const CR = _.sumBy(parentState, (c) => Number(c.credit));
        const DR = _.sumBy(parentState, (d) => Number(d.debit));
        if (DR > CR) {
          const amount = DR - CR;
          setState({ ...state, credit: amount, debit: 0 });
          setEntryType("credit");
        } else {
          const amount = CR - DR;
          setState({ ...state, debit: amount, credit: 0 });
          setEntryType("debit");
        }
      }
    }, [parentState]);

    return (
      <Box>
        <IconButton
          onClick={() => {
            setOpen(true);
            setMode("create");
          }}
          sx={{ border: 1, borderColor: blue[400] }}
        >
          <Icon>add</Icon>
        </IconButton>
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogContent>
            <Grid container columns={2}>
              <Grid item xs={2} sm={1}>
                <Typography variant="body1" textAlign={"left"} gutterBottom>
                  {entryType == "debit" && "DEBIT"}
                </Typography>
              </Grid>
              <Grid item xs={2} sm={1}>
                <Typography variant="body1" textAlign={"right"} gutterBottom>
                  {entryType == "credit" && "CREDIT"}
                </Typography>
              </Grid>
            </Grid>
            <Grid container columns={2}>
              <Grid item xs={2} sm={1}>
                <TextField
                  type="number"
                  autoFocus={true}
                  inputRef={refs.debit}
                  value={state.debit || ""}
                  onChange={(e) => {
                    setState({
                      ...state,
                      debit: e.target.value,
                      credit: 0,
                    });
                  }}
                  onKeyDown={(e) => handleEnter(e, "credit")}
                  fullWidth
                  label="Debit"
                  margin="dense"
                />
              </Grid>
              <Grid item xs={2} sm={1}>
                <TextField
                  type="number"
                  inputRef={refs.credit}
                  value={state.credit || ""}
                  onChange={(e) =>
                    setState({
                      ...state,
                      credit: e.target.value,
                      debit: 0,
                    })
                  }
                  fullWidth
                  label="Credit"
                  margin="dense"
                  onKeyDown={(e) => handleEnter(e, "desp")}
                />
              </Grid>
            </Grid>

            <Collapse in={state?.credit > 0 || state?.debit > 0 ? true : false}>
              <TextField
                inputRef={refs.desp}
                value={state?.desp}
                onChange={(e) => setState({ ...state, desp: e.target.value })}
                fullWidth
                label="Description"
                multiline
                rows={4}
                margin="dense"
                onKeyDown={(e) => handleEnter(e, "project")}
              />
            </Collapse>
            <Collapse in={state?.desp ? true : false}>
              <Autocomplete
                value={state?.project || ""}
                onChange={(e, v) => setState({ ...state, project: v })}
                options={partials?.projects || []}
                getOptionLabel={(option) => option.name || ""}
                renderInput={(params) => (
                  <TextField
                    inputRef={refs.project}
                    {...params}
                    label="Select Project"
                    fullWidth
                    margin="dense"
                    onKeyDown={(e) => handleEnter(e, "vendor")}
                  />
                )}
              />

              <Autocomplete
                value={state?.vendor || null}
                onChange={(e, v) =>
                  setState({
                    ...state,
                    vendor: v,
                    account: partials?.accounts.find(
                      (a) => a?.id == v?.account_id
                    ),
                  })
                }
                options={partials?.vendors || []}
                getOptionLabel={(option) => option.name || ""}
                getOptionKey={(options) => options.id}
                renderInput={(params) => (
                  <TextField
                    inputRef={refs.vendor}
                    {...params}
                    label="Select Vendor"
                    fullWidth
                    margin="dense"
                    onKeyDown={(e) => handleEnter(e, "item")}
                  />
                )}
              />

              <Autocomplete
                value={state.item || null}
                onChange={(e, v) => setState({ ...state, item: v })}
                options={partials?.items || []}
                getOptionLabel={(option) => option.item || ""}
                getOptionKey={(options) => options.id}
                renderInput={(params) => (
                  <TextField
                    inputRef={refs.item}
                    {...params}
                    label="Select Item"
                    fullWidth
                    margin="dense"
                    onKeyDown={(e) => handleEnter(e, "account")}
                  />
                )}
              />
              <Autocomplete
                value={state.account || ""}
                onChange={(e, v) => setState({ ...state, account: v })}
                options={partials?.accounts || []}
                getOptionLabel={(option) =>
                  option ? `${option?.type}:${option?.name}` : ""
                }
                renderInput={(params) => (
                  <TextField
                    inputRef={refs.account}
                    {...params}
                    label="Select Account"
                    margin="dense"
                    onKeyDown={(e) => handleEnter(e, "addnew")}
                  />
                )}
              />
            </Collapse>
          </DialogContent>
          <DialogActions>
            <ButtonGroup fullWidth sx={{ p: 1.5 }}>
              <Button onClick={() => setOpen(false)}>Close</Button>
              {mode == "create" && (
                <>
                  <Button
                    ref={refs.addnew}
                    onClick={handleSaveNew}
                    onKeyDown={(e) => {
                      handleEnter(e, "debit");
                    }}
                  >
                    Add & New
                  </Button>
                  <Button
                    onClick={() => {
                      handleSaveNew();
                      setOpen(false);
                    }}
                  >
                    Add & Close
                  </Button>
                </>
              )}
              {mode == "edit" && (
                <Button onClick={handleUpdate} variant="contained">
                  Update
                </Button>
              )}
            </ButtonGroup>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
);

export default Add;

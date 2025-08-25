import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  List,
  ListItem,
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
} from "@mui/material";
import { blue, grey, orange, red } from "@mui/material/colors";
import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Add from "./Add";
import _ from "lodash";
import API from "../../api/axiosApi";
import { Alert } from "../../context/AlertBar/AlertBar";
import { Error } from "../../components/ui/helpers";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useCreateJournalQuery,
  useLazyShowJournalQuery,
  useStoreJournalMutation,
} from "../../features/journals/journalApi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../features/alert/alertSlice";

const Create = forwardRef(({ props }, ref) => {
  const { transNo, jrNo, variant } = useSelector((state) => ({
    transNo: state.journalSlice?.data?.selectedJR?.id,
    jrNo: state.journalSlice?.data?.selectedJR?.entry_no,
    variant: state.journalSlice?.ui.variant,
  }));
  const AddRef = useRef(null);
  const [state, setState] = useState([]);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [entryMode, setEntryMode] = useState("create");
  const [errors, setErrors] = useState({});
  const [notation, setNotation] = useState("");
  const [trans, setTrans] = useState(null);
  const handleEdit = useCallback((data, index) => {
    setCurrentEntry({ index: index, data: data });
    AddRef.current.edit();
    AddRef.current.open();
  }, []);
  const handleDelete = (index) => {
    const update = _.filter(state, (v, i) => i !== index);
    setState(update);
  };
  const [trigger, { data = [], isLoading, isSuccess }] =
    useLazyShowJournalQuery();

  const handleApiCall = async () => {
    try {
      const res = await trigger({ transNo: transNo }).unwrap();
      setState(res?.jrs);
      setNotation(res?.trans?.notation);
      console.log("fetched DAta", res);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (variant !== "create" && transNo) handleApiCall();
  }, [transNo]);
  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={0.5}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Typography variant="body1" fontWeight={700}>{`Trans No: ${
            transNo || ""
          } Journal No: ${jrNo || ""}`}</Typography>
        </Stack>
        {variant !== "view" && (
          <Add
            variant={entryMode}
            currentEntry={currentEntry}
            updateState={setState}
            ref={AddRef}
            parentState={state}
            setParentState={setState}
          />
        )}
      </Stack>
      <Error errors={errors} name="dr_cr" />
      <TableContainer
        sx={{ maxHeight: "60vh" }}
        component={Paper}
        elevation={6}
      >
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>AC/Desp</TableCell>
              <TableCell>Vendor/Item</TableCell>
              <TableCell>
                DR
                <Typography variant="body2">
                  {_.sumBy(state, (d) => Number(d.debit))}
                </Typography>
              </TableCell>
              <TableCell>
                CR
                <Typography variant="body2">
                  {_.sumBy(state, (d) => Number(d.credit))}
                </Typography>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {state?.map((item, index) => (
              <TableRow key={index}>
                <TableCell padding="checkbox">
                  <Box
                    sx={{
                      border: 1,
                      borderRadius: 50,
                      borderColor: blue[400],
                      bgcolor: blue[100],
                      color: grey[700],
                      width: 25,
                      height: 25,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {index + 1}
                  </Box>
                </TableCell>
                <TableCell>
                  {item?.account?.name && (
                    <Typography
                      variant="body2"
                      children={`AC: ${item.account.name}`}
                    />
                  )}
                  <Error errors={errors} name={`jrs.${index}.account.id`} />
                  {item?.desp && (
                    <Typography
                      variant="body2"
                      children={`Desp: ${item.desp}`}
                    />
                  )}
                  <Error errors={errors} name={`jrs.${index}.desp`} />
                </TableCell>
                <TableCell>
                  {item?.vendor?.name && (
                    <Typography
                      variant="body2"
                      children={`Vendor: ${item.vendor.name}`}
                    />
                  )}
                  <Error errors={errors} name={`jrs.${index}.vendor.id`} />
                  {item?.item?.item && (
                    <Typography
                      variant="body2"
                      children={`Item: ${item.item.item}`}
                    />
                  )}
                  <Error errors={errors} name={`jrs.${index}.item.id`} />
                  {item?.project?.name && (
                    <Typography
                      variant="body2"
                      children={`Project: ${item.project.name}`}
                    />
                  )}
                  <Error errors={errors} name={`jrs.${index}.project.id`} />
                </TableCell>
                <TableCell>
                  {item?.debit}
                  <Error errors={errors} name={`jrs.${index}.debit`} />
                </TableCell>
                <TableCell>
                  {item?.credit}
                  <Error errors={errors} name={`jrs.${index}.credit`} />
                </TableCell>
                <TableCell padding="checkbox">
                  {variant !== "view" && (
                    <ButtonGroup size="small">
                      <Button onClick={() => handleDelete(index)}>
                        <Icon sx={{ color: red[600] }}>delete</Icon>
                      </Button>
                      <Button onClick={() => handleEdit(item, index)}>
                        <Icon sx={{ color: orange[600] }}>edit</Icon>
                      </Button>
                    </ButtonGroup>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {state.length > 0 && (
        <Stack
          direction={"column"}
          p={1}
          mt={1}
          component={Paper}
          elevation={3}
        >
          <TextField
            multiline
            rows={3}
            fullWidth
            margin="dense"
            label="Notation"
            value={notation || ""}
            onChange={(e) => setNotation(e.target.value)}
          />
          <Stack direction={"row"} justifyContent={"flex-end"}>
            <SaveButton
              state={state}
              notation={notation}
              transNo={transNo}
              setErrors={setErrors}
              variant={variant}
            />
          </Stack>
        </Stack>
      )}
    </Box>
  );
});
export default Create;

const SaveButton = ({ state, notation, transNo, setErrors, variant }) => {
  const dispatch = useDispatch();
  const [storeJournal, { isLoading }] = useStoreJournalMutation();
  const handleAPI = async () => {
    console.log({
      notation: notation,
      trans: transNo,
      jrs: state,
    });
    try {
      await storeJournal({
        notation: notation,
        trans: transNo,
        jrs: state,
      }).unwrap();
      dispatch(
        toast({ message: "Operation Successful!", severity: "success" })
      );
    } catch (error) {
      if (error.status === 422) {
        setErrors(error?.data?.errors);
      }
      dispatch(toast({ message: "Error occured!", severity: "error" }));
      console.log(error);
    }
  };
  return (
    <>
      {variant == "create" && (
        <Button onClick={handleAPI} variant="contained">
          Save
        </Button>
      )}
      {variant == "edit" && (
        <Button onClick={handleAPI} variant="contained">
          Update
        </Button>
      )}
    </>
  );
};

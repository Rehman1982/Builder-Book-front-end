import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import axios from "axios";
import _ from "lodash";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
  useCallback,
} from "react";
// import DeepDeatils from "./MoreDetails";
import MoreDetails from "./MoreDetails";
import API from "../../../../api/axiosApi";

const GroupedData = forwardRef((props, ref) => {
  const MoreDetailsRef = useRef();
  const [details, setDetails] = useState({
    title: "",
    project_id: "",
    whereClauses: [],
  });
  const [groupby, setGroupby] = React.useState("vendor_id");
  const showDetails = useCallback((data) => {
    console.log("Passed Data", data);
    setDetails(data);
    MoreDetailsRef.current.open();
  }, []);
  const [state, setState] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [hideZero, setHideZero] = React.useState(true);
  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }));
  const fetchData = async () => {
    try {
      const res = await API.get("reports/liability/byproject/show", {
        params: {
          byproject: 1,
          project_id: props?.project_id,
          groupby: groupby,
          hideZero: hideZero,
        },
      });
      setState(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
    // setConditions([{ key: "project_id", value: props.project_id }]);
  }, [props, groupby, hideZero]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>{props?.project_name}</DialogTitle>
      <DialogContent>
        <MoreDetails ref={MoreDetailsRef} {...details} />
        <ButtonGroup fullWidth sx={{ mb: 1 }}>
          <Button onClick={() => setGroupby("vendor_id")}>By Vendor</Button>
          <Button onClick={() => setGroupby("user_id")}>By User</Button>
          <Button onClick={() => setGroupby("item_id")}>By Item</Button>
          <Button onClick={() => setGroupby("account_id")}>By Account</Button>
          <Button
            onClick={() => setHideZero(!hideZero)}
            variant={hideZero ? "contained" : "outlined"}
          >
            {hideZero ? "Show Zero ACs" : "Hide Zero ACs"}
          </Button>
        </ButtonGroup>
        <Grid container borderBottom={1} bgcolor={orange[100]} p={1}>
          <Grid item xs={6}>
            {groupby && groupby.toUpperCase() + " Name"}
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            Liability
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            Paid
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            Net
          </Grid>
        </Grid>
        <Box maxHeight={400} overflow={"auto"}>
          {state.map((item) => (
            <Grid
              container
              borderBottom={1}
              borderColor={"divider"}
              p={1}
              key={Math.random()}
            >
              <Grid item xs={6}>
                <Button
                  onClick={() => {
                    showDetails({
                      title: item.display_name,
                      whereClauses: [
                        {
                          key: groupby,
                          value: item.id || "no-name",
                        },
                      ],
                      project_id: item.project_id,
                    });
                  }}
                >
                  {item.display_name || "No Name"}
                </Button>
              </Grid>
              <Grid item xs={2} textAlign={"right"}>
                {item.credit}
              </Grid>
              <Grid item xs={2} textAlign={"right"}>
                {item.debit}
              </Grid>
              <Grid item xs={2} textAlign={"right"}>
                {item.net}
              </Grid>
            </Grid>
          ))}
        </Box>
        <Grid container bgcolor={orange[100]} p={1}>
          <Grid item xs={6}>
            Total
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            {_.sumBy(state, (item) => Number(item.credit))}
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            {_.sumBy(state, (item) => Number(item.debit))}
          </Grid>
          <Grid item xs={2} textAlign={"right"}>
            {_.sumBy(state, (item) => Number(item.net))}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});
export default React.memo(GroupedData);

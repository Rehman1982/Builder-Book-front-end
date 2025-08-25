import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  ButtonGroup,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { blue, grey, orange } from "@mui/material/colors";
import axios from "axios";
import _, { isError } from "lodash";
import { Error } from "../../helpers/helpers";
import CreateorEditShare from "./SharesCreate";
import API from "../../../api/axiosApi";
import { useAllSharesQuery } from "../../../features/shares/sharesApi";
import { closeComponent_shares as close } from "../../../features/shares/sharesSlice";
import { useDispatch, useSelector } from "react-redux";
import MyLoader from "../../helpers/MyLoader";

const Shares = forwardRef(({ project_id }, ref) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.sharesSlice.ui_shares.component);
  const currentProject = useSelector(
    (state) => state.sharesSlice.project_shares
  );

  const {
    data = [],
    isLoading,
    isSuccess,
  } = useAllSharesQuery({
    project_id: currentProject?.id,
  });
  useEffect(() => {
    if (isSuccess) {
      console.log(data);
    }
  }, [data, project_id, open]);
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <Box
        sx={{
          bgcolor: blue[500],
          color: "white",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Shares
        </Typography>
        <IconButton onClick={() => dispatch(close())} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        {isLoading ? <MyLoader /> : <ListProjects state={data} />}
      </DialogContent>
      <DialogActions>
        <ButtonGroup>
          <CreateorEditShare data={data} />
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
});

export default Shares;

const ListProjects = React.memo(({ state }) => {
  return (
    <List>
      {state.map((v, i) => (
        <Paper elevation={3} sx={{ mb: 0.5, width: "100%" }} key={i}>
          <ListItem>
            <ListItemText primary={v.user_name} />
            <Typography>{v.share + "%"}</Typography>
          </ListItem>
        </Paper>
      ))}
      <Paper elevation={3} sx={{ bgcolor: orange[200] }}>
        <ListItem>
          <ListItemText primary="Total" />
          <Typography variant="body1">
            {_.sumBy(state, "share") + "%"}
          </Typography>
        </ListItem>
      </Paper>
    </List>
  );
});

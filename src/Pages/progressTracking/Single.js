import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  memo,
  useMemo,
} from "react";
import ProgTrackingContext from "./context";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Divider,
  Dialog,
  Box,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Menu,
  Stack,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import MenuIcon from "@mui/icons-material/Menu";
import {
  grey,
  lightGreen,
  red,
  blueGrey,
  amber,
  green,
} from "@mui/material/colors";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useSelector } from "react-redux";
import { useShowProgressQuery } from "../../features/progressTracking/progressApi";
import { makeTree } from "./tree";
import { useParams, useSearchParams } from "react-router-dom";
import { CreateMileStone, EditMileStone } from "./MileStone";
import axios from "axios";
import { CreateActivity, EditActivity } from "./Activity";
import API from "../../api/axiosApi";
import dayjs from "dayjs";
import minMax from "dayjs/plugin/minMax";
import duration from "dayjs/plugin/duration";
dayjs.extend(minMax);
dayjs.extend(duration);

const Cell = (props) => (
  <TableCell sx={{ border: 1, borderColor: blueGrey[200] }}>
    <Typography variant="body2">{props.val}</Typography>
  </TableCell>
);
const SideMenu = (props) => {
  const { toggles, setToggles, setEditState, closeBtn } =
    useContext(ProgTrackingContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const Edit = () => {
    if (props.data.type == "milestone") {
      setToggles({ ...toggles, editMilestone: true });
      setEditState(props.data);
    }
    if (props.data.type == "activity") {
      setToggles({ ...toggles, editActivity: true });
      setEditState(props.data);
    }
  };
  const Delete = () => {
    setToggles({ ...toggles, deleteForm: true });
    setEditState(props.data);
  };
  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem
          onClick={() => {
            Edit();
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            Delete();
            handleClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};
const SingleContents = () => {
  //   const { index, toggles, setToggles, Partials, CURD } =
  //     useContext(ProgTrackingContext);

  const project = useSelector(
    (state) => state.progressSlice.selectedProject_progress
  );
  const {
    data = [],
    isLoading,
    isError,
  } = useShowProgressQuery({
    project_id: project.id,
    data_type: "sch",
  });

  const hierarchy = useMemo(() => makeTree(data), [data]);
  useEffect(() => {
    console.log(data);
    console.log(hierarchy);
  }, [data]);
  console.log(project);
  const headings = [
    "s",
    "ID",
    "Name",
    "Start / Finish",
    "Planned Budget",
    "Start / Finish",
    "Ach:%",
    "Ach:Value",
    "Lag",
    "act",
  ];
  return (
    <>
      <Stack
        mb={2}
        direction={"row"}
        sx={{ justifyContent: "end", alignItems: "center" }}
        spacing={2}
      >
        {/* <CreateActivity parents={def} />
        <CreateMileStone parents={def} /> */}
      </Stack>
      {/* <EditMileStone parents={def} />
      <EditActivity parents={def} /> */}
      {isLoading && <LinearProgress />}
      <Paper elevation={6}>
        <TableContainer sx={{ maxHeight: "85vh" }} size="small">
          <Table size="small" stickyHeader>
            <TableHead size="small">
              <TableRow>
                <TableCell
                  sx={{
                    border: 1,
                    borderColor: grey[500],
                    backgroundColor: amber[200],
                    textAlign: "center",
                  }}
                  colSpan={3}
                >
                  <Typography variant="body1">Activity/MileStone</Typography>
                </TableCell>
                <TableCell
                  sx={{
                    border: 1,
                    borderColor: grey[500],
                    backgroundColor: amber[200],
                    textAlign: "center",
                  }}
                  colSpan={2}
                >
                  <Typography variant="body1">Planned</Typography>
                </TableCell>
                <TableCell
                  sx={{
                    border: 1,
                    borderColor: grey[500],
                    backgroundColor: amber[200],
                    textAlign: "center",
                  }}
                  colSpan={3}
                >
                  <Typography variant="body1">Achieved</Typography>
                </TableCell>
                <TableCell
                  sx={{
                    border: 1,
                    borderColor: grey[500],
                    backgroundColor: amber[200],
                    textAlign: "center",
                  }}
                  colSpan={3}
                >
                  <Typography variant="body1">Lag/Lead</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                {headings.map((v, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      border: 1,
                      borderColor: grey[500],
                      backgroundColor: amber[200],
                    }}
                  >
                    <Typography variant="body2">{v}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <Row mrgn={0} data={hierarchy} />
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
};
const Row = memo((props) => {
  return props.data.map((v, i) => {
    return (
      <React.Fragment key={v.id}>
        <TableRow
          sx={{
            backgroundColor:
              v.parent_id == null
                ? green[200]
                : v.childs.length > 0
                ? red[100]
                : "white",
          }}
        >
          <TableCell
            sx={{ border: 1, borderColor: grey[500], paddingLeft: "0px" }}
          >
            <NavigateNextIcon
              fontSize="small"
              sx={{ marginLeft: props.mrgn }}
            />
          </TableCell>
          <Cell val={v.activity_id} />
          <Cell val={`${v.id} - ${v.activity_name}`}></Cell>
          <TableCell sx={{ border: 1, borderColor: grey[500] }}>
            <Typography
              noWrap
              variant="body2"
            >{`Start: ${v.start}`}</Typography>
            <Divider />
            <Typography noWrap variant="body2">{`End: ${v.finish}`}</Typography>
            <Divider />
            <Typography
              noWrap
              variant="body2"
            >{`Diff: ${v.total_days_req} days`}</Typography>
          </TableCell>
          <TableCell sx={{ border: 1, borderColor: grey[500] }}>
            <Typography noWrap variant="body2">
              {v.budget > 1000000
                ? `${(v.budget / 1000000).toFixed(2)}(M)`
                : v.budget}
            </Typography>
          </TableCell>
          <TableCell sx={{ border: 1, borderColor: grey[500] }}>
            {v.AchStart && (
              <Typography
                noWrap
                variant="body2"
              >{`Start: ${v.AchStart}`}</Typography>
            )}
            <Divider />
            {v.AchFinish && (
              <Typography
                noWrap
                variant="body2"
              >{`End: ${v.AchFinish}`}</Typography>
            )}
            <Divider />
            {v.AchDiff > 0 && (
              <Typography noWrap variant="body2">{`Diff: ${
                v.AchDiff > 0 ? v.AchDiff : 0
              } days`}</Typography>
            )}
          </TableCell>
          {/* <Cell val={v.planedBudget} /> */}
          {/* <TableCell sx={{ border: 1, borderColor: grey[500] }}>{v.AchDiff > 0 ? v.AchDiff : 0}</TableCell> */}
          <Cell val={v.totalWrokDone} />
          <Cell
            val={
              v.wdAmount > 1000000
                ? `${(v.wdAmount / 1000000).toFixed(2)}(M)`
                : v.wdAmount
            }
          />
          <TableCell
            sx={{
              border: 1,
              borderColor: grey[500],
              backgroundColor: v.lag > 0 && red[300],
            }}
          >
            {v.lag}%
          </TableCell>
          <TableCell sx={{ border: 1, borderColor: grey[500] }}>
            <SideMenu data={v} />
          </TableCell>
        </TableRow>
        {v.childs.length > 0 && <Row mrgn={props.mrgn + 1} data={v.childs} />}
      </React.Fragment>
    );
  });
});

export { Row };

export default SingleContents;

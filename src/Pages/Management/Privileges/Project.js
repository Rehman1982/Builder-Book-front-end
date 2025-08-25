import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
  IconButton,
  Typography,
  Slide,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Button,
  Paper,
  TextField,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { blue, green, grey } from "@mui/material/colors";
import axios from "axios";
import _ from "lodash";
import GrantPermissions from "./General";
import API from "../../../api/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import {
  openGeneral_Privilege,
  closeProject_Privilege,
  setProject_Privilege,
} from "../../../features/privileges/privilegeSlice";
import { useShowPrivilegeQuery } from "../../../features/privileges/privilegeApi";

const Project = forwardRef((props, ref) => {
  const [searchStr, setSearchStr] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.privilegeSlice.user);
  const open = useSelector(
    (state) => state.privilegeSlice.showProject_Privilege
  );
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useShowPrivilegeQuery({ user_id: user?.id });

  const filteredProjects = useMemo(() => {
    if (!searchStr) return data;
    return data.filter((d) =>
      d.name.toLowerCase().includes(searchStr.toLowerCase())
    );
  }, [searchStr, data]);
  return (
    <>
      <GrantPermissions />
      <Dialog
        open={open}
        onClose={() => dispatch(closeProject_Privilege())}
        fullWidth
      >
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
            Assign Project(s)
          </Typography>
          <IconButton
            onClick={() => dispatch(closeProject_Privilege())}
            sx={{ color: "white" }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            bgcolor: grey[100],
            py: 3,
          }}
        >
          <TextField
            size="small"
            value={searchStr}
            placeholder="search..."
            onChange={(e) => setSearchStr(e.target.value)}
            fullWidth
          />
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress color="primary" />
            </Box>
          ) : (
            <Box px={1} sx={{ height: "70vh", overflow: "auto" }}>
              <RenderProjects projects={filteredProjects} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});

export default Project;

const RenderProjects = React.memo(({ projects }) => {
  const dispatch = useDispatch();
  return (
    <List>
      {projects?.map((v, i) => (
        <Paper
          key={v.id}
          sx={{ mb: 0.5, bgcolor: v.privileges_count ? green[200] : "" }}
        >
          <ListItem>
            {console.log(v)}
            <ListItemText
              primary={v.name}
              secondary={v.link || "Business? "}
            ></ListItemText>
            <Badge badgeContent={v.privileges_count} color="error">
              <Button
                onClick={() => {
                  dispatch(setProject_Privilege(v));
                  dispatch(openGeneral_Privilege());
                }}
              >
                Permissions
              </Button>
            </Badge>
          </ListItem>
        </Paper>
      ))}
    </List>
  );
});

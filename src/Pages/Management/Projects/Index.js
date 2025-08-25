import {
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Box,
  Button,
  ListItem,
  Stack,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { grey } from "@mui/material/colors";
import CreateProject from "./Create";
import { useRef } from "react";
import { useCallback } from "react";
import DeleteProject from "./DeleteProject";
import API from "../../../api/axiosApi";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useAllProjectsQuery } from "../../../features/projects/projectsApi";
import {
  create,
  edit,
  generateTree,
  selectProject,
  setAllProjects,
  setDeleteIds,
  view,
} from "../../../features/projects/projectsSlice";

const SideMenu = () => {
  const dispatch = useDispatch();
  const { allprojects, deleteIds } = useSelector(
    (state) => state.projectsSlice
  );
  const { data = [], isLoading } = useAllProjectsQuery();

  const tree = useMemo(() => {
    const map = {};
    const tree = [];
    // Create a map with default children array
    data.forEach((item) => {
      map[item.id] = { ...item, children: [] };
    });
    // Build the tree
    data.forEach((item) => {
      if (item.parent_id && map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      } else {
        tree.push(map[item.id]);
      }
    });

    return tree;
  }, [data]);
  return (
    <>
      <CreateProject />
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
          {deleteIds?.length > 0 && <DeleteProject deleteIds={deleteIds} />}
          <Button
            variant="contained"
            onClick={() => {
              dispatch(create());
            }}
          >
            <Add sx={{ mr: 1 }} />
            ADD
          </Button>
        </Stack>
      </Stack>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ maxHeight: "80vh", overflow: "auto", pb: 10 }}>
        <Contents tree={tree} />
      </Box>
    </>
  );
};

export default SideMenu;

const Contents = React.memo(({ tree }) => {
  return (
    <List component="nav">
      {tree?.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </List>
  );
});

const Item = React.memo(({ item }) => {
  const deleteIds = useSelector((s) => s.projectsSlice.deleteIds);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) setOpen(!open);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", py: 1 }}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          "&:hover": { bgcolor: grey[300] },
          "&:active": { bgcolor: grey[300] },
        }}
      >
        <Stack
          direction={"row"}
          justifyContent={"flex-start"}
          alignItems={"center"}
        >
          <FormControlLabel
            sx={{ p: 0, m: 0 }}
            control={
              <Checkbox
                disabled={hasChildren ? true : false}
                checked={_.includes(deleteIds, item.id) ? true : false}
                onChange={(e, check) =>
                  dispatch(setDeleteIds({ check: check, id: item.id }))
                }
              />
            }
          />
          <Typography
            variant="body1"
            sx={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {item.name}
          </Typography>
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Button onClick={() => dispatch(create({ parent_id: item.id }))}>
            Append Child
          </Button>
          <Button onClick={() => dispatch(edit(item))}>Edit</Button>
          <Button onClick={() => dispatch(view(item))}>View</Button>
          <Button>
            {hasChildren ? open ? <ExpandLess /> : <ExpandMore /> : null}
          </Button>
        </Stack>
      </Stack>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {item.children.map((child) => (
              <Item key={child.id} item={child} />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
});

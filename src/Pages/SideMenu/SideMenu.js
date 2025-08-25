import {
  List,
  Collapse,
  Box,
  Button,
  Stack,
  Typography,
  Divider,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import React, { useEffect, useMemo, useState } from "react";
import { grey } from "@mui/material/colors";
import CreateMenu from "./Create";
import { useRef } from "react";
import { useCallback } from "react";
import { Delete } from "./Delete";
import API from "../../api/axiosApi";
import _ from "lodash";
import { useIndexMenuQuery } from "../../features/sidemenu/projectsApi";
import { makeTree } from "../../utils/makeTree";
import {
  edit_menu,
  view_menu,
  setDeleteIds_menu,
  create_menu,
} from "../../features/sidemenu/sidemenuSlice";
import { useDispatch, useSelector } from "react-redux";

const SideMenu = () => {
  const { data = [], isLoading, isError } = useIndexMenuQuery();
  const hirerecy = useMemo(() => {
    if (isError) return [];
    return makeTree(data);
  }, [data]);
  useEffect(() => {
    console.log(hirerecy);
  }, [data]);
  const createMenuRef = useRef();
  const [currentItem, setCurrentItem] = useState(null);
  const [deleteIds, setDeleteIds] = useState([]);
  const [edit, setEdit] = useState(false);
  const handelEdit = useCallback((data) => {
    setCurrentItem(data);
    setEdit(true);
  }, []);
  const handleCheck = useCallback((id) => {
    setDeleteIds((prv) => {
      let newArray = [...prv];
      if (newArray.includes(id)) {
        return newArray.filter((v) => v !== id);
      } else {
        newArray.push(id);
        return newArray;
      }
    });
  }, []);
  return (
    <>
      <CreateMenu allMenuItems={data} />
      {deleteIds.length > 0 && <Delete deleteIds={deleteIds} refresh={null} />}
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h6">Side Menu</Typography>
        <Button onClick={() => createMenuRef.current.open()}>
          ADD New Menu
        </Button>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ maxHeight: "80vh", overflow: "auto", pb: 10 }}>
        <List component="nav">
          {hirerecy?.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              handelEdit={handelEdit}
              handleCheck={handleCheck}
              deleteIds={deleteIds}
            />
          ))}
        </List>
      </Box>
    </>
  );
};

export default SideMenu;

// function generateNestedSidebar(menuArray) {
//   const map = {};
//   const tree = [];

//   // Create a map with default children array
//   menuArray.forEach((item) => {
//     map[item.id] = { ...item, children: [] };
//   });

//   // Build the tree
//   menuArray.forEach((item) => {
//     if (item.parent_id && map[item.parent_id]) {
//       map[item.parent_id].children.push(map[item.id]);
//     } else {
//       tree.push(map[item.id]);
//     }
//   });

//   return tree;
// }

const SidebarItem = React.memo(({ item }) => {
  const dispatch = useDispatch();
  const deleteIds = useSelector(
    (state) => state.sidemenuSlice?.data_menu?.deleteIds
  );
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
                  dispatch(setDeleteIds_menu({ id: item.id, check: check }))
                }
              />
            }
          />
          <Typography
            variant="body1"
            sx={{ cursor: "pointer" }}
            onClick={handleClick}
          >
            {item.title}
          </Typography>
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Button onClick={() => dispatch(create_menu({ parent_id: item.id }))}>
            Append
          </Button>
          <Button onClick={() => dispatch(view_menu(item))}>Edit</Button>
          <Button>
            {hasChildren ? open ? <ExpandLess /> : <ExpandMore /> : null}
          </Button>
        </Stack>
      </Stack>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {item.children.map((child) => (
              <SidebarItem key={child.id} item={child} />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
});

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
import { Add, ExpandLess, ExpandMore } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { grey } from "@mui/material/colors";
import CreateProject from "./Create";
import DeleteAccount from "./Delete";
import DefaultAccounts from "./DefaultAccounts";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllAccountsQuery } from "../../../features/coa/coaApi";
import {
  setAllAccounts,
  generateTree,
  create,
  view,
  edit,
  setDeleteIds,
} from "../../../features/coa/coaSlice";
import _ from "lodash";

const Index = () => {
  const dispatch = useDispatch();
  const { deleteIds, tree } = useSelector((state) => state.coaSlice);
  const { data, isLoading, isError, error, isSuccess } =
    useGetAllAccountsQuery();
  useEffect(() => {
    console.log(data);
    dispatch(setAllAccounts(data));
    dispatch(generateTree(data));
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
          {deleteIds.length > 0 && <DeleteAccount deleteIds={deleteIds} />}
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
        <List component="nav">
          {tree?.map((item) => (
            <TreeItem key={item.id} item={item} />
          ))}
        </List>
      </Box>
    </>
  );
};

export default Index;

const TreeItem = React.memo(({ item }) => {
  const dispatch = useDispatch();
  const deleteIds = useSelector((state) => state.coaSlice.deleteIds);
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
            {item.acctname}
          </Typography>
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Button
            onClick={() =>
              dispatch(create({ parent_id: item.id, type: item.type }))
            }
          >
            Append
          </Button>
          <Button onClick={() => dispatch(edit(item))}>Edit</Button>
          <Button>
            {hasChildren ? open ? <ExpandLess /> : <ExpandMore /> : null}
          </Button>
        </Stack>
      </Stack>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 3 }}>
            {item.children.map((child) => (
              <TreeItem key={child.id} item={child} />
            ))}
          </List>
        </Collapse>
      )}
    </Box>
  );
});

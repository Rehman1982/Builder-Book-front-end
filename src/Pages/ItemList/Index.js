import React, { useMemo, useState } from "react";
import { useAllItemsQuery } from "../../features/itemlist/itemlistApi";
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Collapse,
  FormControlLabel,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { makeTree } from "../../utils/makeTree";
import MyLoader from "../helpers/MyLoader";
import _ from "lodash";
import { blue, grey, orange } from "@mui/material/colors";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  createItem,
  editItem,
  setDeleteIds,
  viewItem,
} from "../../features/itemlist/itemlistSlice";
import PageLayout from "../../components/ui/PageLayout";
import Create from "./Create";
import Delete from "./Delete";
import { Error } from "../../components/ui/helpers";
import ChangeParent from "./ChangeParent";
const Index = () => {
  const dispatch = useDispatch();
  // local state
  const [filters, setFilters] = useState([
    { label: "Item", name: "item", value: "", col: "IL.item" },
    { label: "Account Name", name: "account", value: "", col: "coa.acctname" },
    { label: "Entry", name: "Entry", value: "", col: "IL.entry" },
  ]);
  // apis
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useAllItemsQuery({ wheres: filters });
  // global States
  const deleteIds = useSelector((state) => state.itemlistSlice.deleteIds);
  // functions
  console.log("errors", error);
  const items = useMemo(() => {
    if (isError) return [];
    return makeTree(data);
  }, [data]);
  // render
  return (
    <>
      <Create />
      <PageLayout
        filters={filters}
        setFilters={setFilters}
        create={
          <>
            {deleteIds.length > 0 && (
              <Badge badgeContent={_.size(deleteIds)} color="error">
                <ButtonGroup variant="outlined">
                  <Delete />
                  <ChangeParent />
                </ButtonGroup>
              </Badge>
            )}
            <IconButton
              sx={{ border: 1, borderColor: blue[400] }}
              onClick={() => dispatch(createItem())}
              children={<Icon>add</Icon>}
            />
          </>
        }
        children={<Contents items={items} />}
      />
    </>
  );
};

export default Index;

const Contents = ({ items }) => {
  return (
    <Box sx={{ overflow: "auto" }}>
      <List component="nav">
        {items?.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </List>
    </Box>
  );
};

const Item = React.memo(({ item }) => {
  //   console.log(item);
  const dispatch = useDispatch();
  const deleteIds = useSelector((state) => state.itemlistSlice.deleteIds);
  const errors = useSelector((state) => state.itemlistSlice.errors);
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
            {item.item}
          </Typography>
          <MyBadge contents={_.size(item.children)} />
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Button
            onClick={() =>
              dispatch(createItem({ parent_id: item.id, type: item.type }))
            }
          >
            Append
          </Button>
          <Button onClick={() => dispatch(editItem(item))}>Edit</Button>
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
      <Error errors={errors} name={item?.id} />
    </Box>
  );
});

const MyBadge = ({ contents }) => {
  if (contents > 0) {
    return (
      <Stack
        component={Paper}
        bgcolor={blue[100]}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        // p={3}
        minWidth={50}
        ml={1}
        padding={"auto"}
        borderRadius={2}
      >
        <Typography variant="body2" children={contents} />
      </Stack>
    );
  }
};

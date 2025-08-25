import { Add } from "@mui/icons-material";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { blue, green, purple, red } from "@mui/material/colors";
import React, { useState } from "react";
import { useEffect } from "react";
import MyLoader from "../../helpers/MyLoader";
import CURD from "./CURD";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useGetVendorsQuery } from "../../../features/vendorlist/vendorlistApi";
import {
  applyFilter,
  setOpen,
  setSelectedVendor,
  setVariant,
  setVendors,
} from "../../../features/vendorlist/vendorlistSlice";

const Index = () => {
  const dispatch = useDispatch();
  const { vendors, filteredData, variant, selectedVendor } = useSelector(
    (state) => state.vendorlistSlice
  );
  // actions
  const { data, isLoading, isSuccess, isError, error } = useGetVendorsQuery({
    type: "data",
  });
  useEffect(() => {
    if (isSuccess) {
      dispatch(setVendors(data));
      dispatch(applyFilter(""));
    }
  }, [data]);
  return (
    <Box>
      <CURD />
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={3}
      >
        <IconButton
          onClick={() => {
            dispatch(setVariant("create"));
            dispatch(setOpen(true));
          }}
          sx={{ border: 1, borderColor: blue[400] }}
        >
          <Add />
        </IconButton>
        <TextField
          onChange={(e) => dispatch(applyFilter(e.target.value))}
          sx={{ width: "50%" }}
          size="small"
          placeholder="Search..."
        />
      </Stack>
      <List sx={{ px: 0 }}>
        {isLoading ? <MyLoader /> : <Contents vendors={filteredData} />}
      </List>
    </Box>
  );
};
export default Index;

const Contents = React.memo(({ vendors }) => {
  const dispatch = useDispatch();
  return vendors?.map((vendor, index) => (
    <Paper elevation={3} sx={{ mb: 0.5, overflow: "hidden" }} key={index}>
      <ListItem sx={{ py: 0 }}>
        <Box
          bgcolor={vendor?.status == "deactive" ? red[500] : green[500]}
          sx={{
            position: "absolute",
            left: "0",
            top: "0",
            height: "100%",
            width: 30,
          }}
        />
        <ListItemAvatar sx={{ ml: 2 }}>
          {console.log("redner")}
          {/* <Avatar
            src={
              vendor.url &&
              route("files", {
                file: "6N0mrxcyqAs4aUgam3P3lplaxnCOY7qjAVHpkvrG.jpg",
              })
            }
          /> */}
        </ListItemAvatar>
        <ListItemButton
          onClick={() => {
            dispatch(setSelectedVendor(vendor));
            dispatch(setOpen(true));
            dispatch(setVariant("view"));
          }}
        >
          <ListItemText primary={vendor.name} secondary={vendor.acctname} />
        </ListItemButton>
      </ListItem>
    </Paper>
  ));
});

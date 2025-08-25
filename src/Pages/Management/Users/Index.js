import { Add } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
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
import { blue, green, grey, orange, purple, red } from "@mui/material/colors";
import React, { useState } from "react";
import { useEffect } from "react";
import MyLoader from "../../helpers/MyLoader";
import CURD from "./CURD";
import _ from "lodash";
import AddUser from "./AddUser";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllUsersQuery } from "../../../features/user/userApi";
import {
  filterUsers,
  setAllUsers,
  view,
  edit,
  create,
  setPartials,
} from "../../../features/user/userSlice";

const Index = () => {
  const dispatch = useDispatch();
  const filteredUsers = useSelector((state) => state.userSlice.filteredUsers);
  const { data, isLoading, isSuccess } = useGetAllUsersQuery();
  useEffect(() => {
    dispatch(setAllUsers(data?.users));
    dispatch(filterUsers(""));
    dispatch(setPartials({ accounts: data?.accounts }));
    console.log(data);
  }, [data]);
  return (
    <Box>
      <CURD />
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <AddUser />
        <TextField
          onChange={(e) => dispatch(filterUsers(e.target.value))}
          sx={{ width: "50%" }}
          size="small"
          placeholder="Search..."
        />
      </Stack>
      <List sx={{ px: 0 }}>{isLoading ? <MyLoader /> : <Contents />}</List>
    </Box>
  );
};
export default Index;

const Contents = React.memo(() => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userSlice.filteredUsers);
  return users?.map((user, index) => (
    <Paper elevation={3} sx={{ mb: 0.5, overflow: "hidden" }} key={index}>
      <ListItem sx={{ py: 0 }}>
        <Box
          sx={{
            bgcolor:
              user?.user_response == "accepted"
                ? green[500]
                : user.status == "rejected"
                ? red[500]
                : orange[400],
            position: "absolute",
            left: "0",
            top: "0",
            height: "100%",
            width: 90,
          }}
        />
        <ListItemAvatar sx={{ ml: 2 }}>
          <Avatar
            component={Paper}
            elevation={2}
            src="http://localhost/api/attachment/6N0mrxcyqAs4aUgam3P3lplaxnCOY7qjAVHpkvrG.jpg"
          />
        </ListItemAvatar>
        <ListItemButton onClick={() => dispatch(view(user))}>
          <ListItemText primary={user.name} secondary={user.email} />
        </ListItemButton>
        {["pending", "rejected"].includes(user.user_response) && (
          <Typography variant="body2" fontWeight={700}>
            {user.user_response.toUpperCase()}
          </Typography>
        )}
      </ListItem>
    </Paper>
  ));
});

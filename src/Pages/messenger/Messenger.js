import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Dialog, DialogContent, Box, Typography } from "@mui/material";

import API from "../../api/axiosApi";
import Messages from "./Message";
import CreateMessage from "./Create";
import { useGetMessagesQuery } from "../../features/messenger/messengerApi";
import { useDispatch, useSelector } from "react-redux";
import {
  openMessenger,
  closeMessenger,
} from "../../features/messenger/messengerSlice";

const Messenger = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.messengerSlice.open);
  const { type, id } = useSelector((state) => state.messengerSlice.props);
  const user = useSelector((state) => state.authSlice.currentUser);
  const {
    data = [],
    isLoading,
    isError,
  } = useGetMessagesQuery({
    type: type,
    id: id,
  });
  const handleClose = () => {
    dispatch(closeMessenger());
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogContent>
        {data.length > 0 ? (
          <Messages messages={data} currentUserId={user?.id} />
        ) : (
          <Typography variant="body1">No Messages Found</Typography>
        )}
      </DialogContent>
      <Box sx={{ p: 1 }}>
        <CreateMessage type={type} id={id} />
      </Box>
    </Dialog>
  );
});

export default Messenger;

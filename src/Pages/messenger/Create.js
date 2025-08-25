import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Icon,
  IconButton,
  InputBase,
  Paper,
  TextField,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import API from "../../api/axiosApi";
import { useLoaderData } from "react-router-dom";
import { useStoreMessageMutation } from "../../features/messenger/messengerApi";

const Create = ({ type, id, refresh }) => {
  const [storeMessage, { isLoading, isError }] = useStoreMessageMutation();
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async () => {
    try {
      const res = await storeMessage({
        object_type: type,
        object_id: id,
        text: message,
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    } finally {
      //   setLoading(false);
    }
  };
  return (
    <Paper
      elevation={3}
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <InputBase
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{ ml: 1, flex: 1 }}
        placeholder="Message"
        inputProps={{ "aria-label": "write your message" }}
      />
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        onClick={handleSubmit}
        color="primary"
        sx={{ p: "10px" }}
        aria-label="directions"
      >
        {isLoading ? (
          <CircularProgress color="success" size={15} />
        ) : (
          <Icon>send</Icon>
        )}
      </IconButton>
    </Paper>
  );
};

export default Create;

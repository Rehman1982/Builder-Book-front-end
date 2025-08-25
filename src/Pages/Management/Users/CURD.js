import { Delete, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import _ from "lodash";
import React from "react";
import { useImperativeHandle } from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { Error } from "../../helpers/helpers";
import { useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import GeneralPrivileges from "../Privileges/General";
import ProjectBasePrivileges from "../Privileges/Project";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser as setState,
  close,
  setVariant,
} from "../../../features/user/userSlice";
import { useUpdateUserMutation } from "../../../features/user/userApi";
import {
  openGeneral_Privilege,
  openProject_Privilege,
  setUser_Privilege,
} from "../../../features/privileges/privilegeSlice";
const CURD = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.userSlice.selectedUser);
  const variant = useSelector((state) => state.userSlice.variant);
  const showDialog = useSelector((state) => state.userSlice.showDialog);

  return (
    <>
      <GeneralPrivileges />
      <ProjectBasePrivileges />
      <Dialog open={showDialog} onClose={() => dispatch(close())} fullWidth>
        <Stack
          mt={2}
          px={3}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h6">{state?.name}</Typography>
          <ImageContainer url={state?.url && state.url} />
        </Stack>
        <DialogContent>
          <Stack direction={"row"} spacing={1}>
            <SideButtonsContainer />
            <FormComponents />
          </Stack>
        </DialogContent>
        <DialogActions>{variant !== "view" && <UpdateButton />}</DialogActions>
      </Dialog>
    </>
  );
});
export default React.memo(CURD);

const MyTextField = (props) => {
  const variant = useSelector((state) => state.userSlice.variant);
  return <TextField {...props} disabled margin="dense" />;
};
const ImageContainer = ({ url, size = 80 }) => {
  return (
    <Avatar
      src={`http://localhost/api/attachment/6N0mrxcyqAs4aUgam3P3lplaxnCOY7qjAVHpkvrG.jpg`}
      alt="User"
      sx={{
        width: size,
        height: size,
        border: "2px solid #ccc",
        boxShadow: 3,
      }}
    />
  );
};
const SideButtonsContainer = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.userSlice.selectedUser);
  const variant = useSelector((state) => state.userSlice.variant);
  useEffect(() => {
    console.log("selected user Data", selectedUser);
  }, [selectedUser]);
  return (
    <Stack direction={"column"} spacing={0.5}>
      {/* {selectedUser.status === "accepted" && ( */}
      <>
        <SideButton
          text="Grand Permissions"
          icon="building"
          action={() => {
            dispatch(openGeneral_Privilege());
            dispatch(setUser_Privilege(selectedUser));
          }}
          // action={() => generalPrivilegesRef.current.open()}
        />
        <SideButton
          text="Assign Project"
          icon="building"
          action={() => {
            dispatch(openProject_Privilege());
            dispatch(setUser_Privilege(selectedUser));
          }}
        />
        <SideButton
          text="Suspend / Fire"
          icon="delete"
          // action={() => setAction("edit")}
        />
      </>
      {/* )} */}
      {variant === "view" && (
        <SideButton
          text="Edit"
          icon="edit"
          action={() => dispatch(setVariant("edit"))}
        />
      )}
    </Stack>
  );
};
const SideButton = ({ icon = "add_circle", text, action }) => {
  return (
    <Box
      component={Paper}
      elevation={3}
      textAlign={"center"}
      border={1}
      p={1}
      borderColor={"divider"}
      width={"100%"}
      onClick={action}
      sx={{
        cursor: "pointer",
        ":hover": {
          bgcolor: grey[200],
        },
        ":active": { bgcolor: grey[300] },
      }}
    >
      <IconButton sx={{ border: 2, borderColor: blue[100] }}>
        <Icon fontSize="medium" sx={{ color: blue[400] }}>
          {icon}
        </Icon>
      </IconButton>
      {text && (
        <Typography
          variant="body1"
          fontSize={"0.8rem"}
          noWrap
          sx={{ color: blue[500] }}
        >
          {text}
        </Typography>
      )}
    </Box>
  );
};
const FormComponents = () => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.userSlice.selectedUser);
  const errors = useSelector((state) => state.userSlice.errors);
  const accounts = useSelector((state) => state.userSlice.partials?.accounts);
  const variant = useSelector((state) => state.userSlice.variant);
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setState({ ...state, [name]: value }));
  };
  return (
    <Stack flexGrow={1} direction={"column"} spacing={2}>
      <MyTextField
        name="user"
        label="User Name"
        value={state?.name || ""}
        // onChange={handleChange}
        errors={errors}
      />
      <MyTextField
        name="mbn"
        label="Mobile Number"
        value={state?.mbn || ""}
        // onChange={handleChange}
        errors={errors}
      />
      <MyTextField
        name="email"
        label="Email Address"
        value={state?.email || ""}
        // onChange={handleChange}
        errors={errors}
      />
      <MyTextField
        name="status"
        label="Current Status"
        value={state?.status || ""}
        // onChange={handleChange}
        errors={errors}
      />
      <Autocomplete
        disabled={variant === "view" ? true : false}
        options={accounts?.filter((a) => a.type === "assets") || []}
        getOptionLabel={(opt) => opt.name}
        value={accounts.find((a) => a.id === state?.opr_account) || null}
        onChange={(e, v) => dispatch(setState({ ...state, opr_account: v.id }))}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Operational Account"
            error={_.has(errors, "opr_account")}
            helperText={<Error errors={errors} name="opr_account" />}
          />
        )}
      />
      <Autocomplete
        disabled={variant === "view" ? true : false}
        options={accounts?.filter((a) => a.type === "equity") || []}
        getOptionLabel={(opt) => opt.name}
        value={accounts.find((a) => a.id === state?.equity_account) || null}
        onChange={(e, v) =>
          dispatch(setState({ ...state, equity_account: v.id }))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Equity Account"
            error={_.has(errors, "equity_account")}
            helperText={<Error errors={errors} name="equity_account" />}
          />
        )}
      />
      <TextField
        disabled={variant === "view" ? true : false}
        name="status"
        value={state?.status || ""}
        onChange={(e) =>
          dispatch(setState({ ...state, status: e.target.value }))
        }
        select
        margin="dense"
      >
        <MenuItem key={"active"} value={"active"}>
          Active
        </MenuItem>
        <MenuItem key={"deactive"} value={"deactive"}>
          De-Active
        </MenuItem>
      </TextField>
    </Stack>
  );
};

const UpdateButton = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.userSlice.selectedUser);
  const [updateUser, { isLoading, isSuccess }] = useUpdateUserMutation();
  const handleSubmit = async () => {
    try {
      const res = await updateUser(selectedUser).unwrap();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ButtonGroup>
      <Button
        onClick={() => {
          dispatch(setVariant("view"));
        }}
      >
        Cancel
      </Button>
      <Button onClick={handleSubmit} variant="outlined">
        Update {isLoading && <CircularProgress sx={{ ml: 3 }} />}
      </Button>
    </ButtonGroup>
  );
};

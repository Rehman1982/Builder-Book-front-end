import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Icon,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import React, { useRef } from "react";
import { useState } from "react";
import { Error } from "../../helpers/helpers";
import { forwardRef } from "react";
import { useImperativeHandle } from "react";
import axios from "axios";
import { useEffect } from "react";
import SideButton from "../SideButton";
import { blue, grey, orange } from "@mui/material/colors";
import Shares from "./Shares";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccount,
  setVariant,
  setErrors,
  close,
} from "../../../features/coa/coaSlice";
import {
  useStoreAcMutation,
  useUpdateAcMutation,
} from "../../../features/coa/coaApi";
import { toast } from "../../../features/alert/alertSlice";

const Create = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { acTypes, allAccounts, selectedAccount, showDialog, errors, variant } =
    useSelector((s) => s.coaSlice);
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setAccount({ ...selectedAccount, [name]: value }));
  };
  return (
    <>
      <Dialog open={showDialog} onClose={() => dispatch(close())} fullWidth>
        <Box bgcolor={blue[500]} p={2}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h5" sx={{ color: grey[100] }}>
              {selectedAccount?.acctname}
            </Typography>
            <IconButton onClick={() => dispatch(close(false))}>
              <Icon sx={{ color: grey[100] }} children={"close"} />
            </IconButton>
          </Stack>
        </Box>
        <DialogContent>
          <Stack flexGrow={1} direction={"column"}>
            <MyTextField
              fullWidth
              name="type"
              label="Account Type"
              placeholder="Account Type"
              value={selectedAccount?.type || ""}
              onChange={handleChange}
              error={_.has(errors, "type")}
              helperText={<Error errors={errors} name="type" />}
              margin="dense"
              select
            >
              {acTypes?.map((type) => (
                <MenuItem key={type.slug} value={type.slug}>
                  {type?.name}
                </MenuItem>
              ))}
              {/* <MenuItem key="assets" value="assets">
                Assets
              </MenuItem>
              <MenuItem key="Liability" value="Liability">
                Liability
              </MenuItem>
              <MenuItem key="equity" value="equity">
                Equity
              </MenuItem>
              <MenuItem key="COGS" value="COGS">
                Cost of Goods
              </MenuItem>
              <MenuItem key="income" value="income">
                Income
              </MenuItem> */}
            </MyTextField>
            <MyTextField
              fullWidth
              name="acctname"
              label="Account Name"
              placeholder="Account Name"
              value={selectedAccount?.acctname || ""}
              onChange={handleChange}
              error={_.has(errors, "acctname")}
              helperText={<Error errors={errors} name="acctname" />}
              margin="dense"
            />
            <MyTextField
              fullWidth
              name="status"
              label="Status"
              placeholder="Status"
              value={selectedAccount?.status || ""}
              onChange={handleChange}
              error={_.has(errors, "status")}
              helperText={<Error errors={errors} name="status" />}
              margin="dense"
              select
            >
              <MenuItem key="active" value="active">
                Active
              </MenuItem>
              <MenuItem key="inactive" value="inactive">
                In-Active
              </MenuItem>
            </MyTextField>
            <MyTextField
              fullWidth
              name="entry"
              label="Entry Allowed"
              placeholder="Entry Allowed"
              value={selectedAccount?.entry || ""}
              onChange={handleChange}
              error={_.has(errors, "entry")}
              helperText={<Error errors={errors} name="entry" />}
              margin="dense"
              select
            >
              <MenuItem key={1} value={1}>
                Allowed
              </MenuItem>
              <MenuItem key={0} value={0}>
                Not-Allowed
              </MenuItem>
            </MyTextField>

            <Autocomplete
              options={allAccounts || []}
              getOptionLabel={(option) => option?.acctname}
              value={
                allAccounts?.find(
                  (aa) => aa?.id == selectedAccount?.parent_id
                ) || null
              }
              renderInput={(params) => (
                <TextField {...params} label="Parent Account" margin="dense" />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          {variant === "create" && <CreateButton />}
          {variant === "edit" && <UpdateButton />}
        </DialogActions>
      </Dialog>
    </>
  );
});
export default Create;

const MyTextField = (props) => {
  const variant = useSelector((st) => st.coaSlice.variant);
  return (
    <TextField
      {...props}
      fullWidth
      disabled={variant == "view" ? true : false}
    />
  );
};

const CreateButton = () => {
  const dispatch = useDispatch();
  const selectedAccount = useSelector((st) => st.coaSlice.selectedAccount);
  const [store, { isLoading, isError, error, isSuccess }] =
    useStoreAcMutation();
  const handleCreate = async () => {
    try {
      const res = await store(selectedAccount).unwrap();
      dispatch(
        toast({
          message: "Create Successfully!",
          severity: "success",
        })
      );
    } catch (error) {
      console.log(error);
      if (error) {
        dispatch(
          toast({
            message: "Error!",
            severity: "error",
          })
        );
        dispatch(setErrors(error?.data?.errors));
      }
    }
  };
  return (
    <Button variant="contained" onClick={handleCreate}>
      Create
    </Button>
  );
};
const UpdateButton = () => {
  const dispatch = useDispatch();
  const selectedAccount = useSelector((st) => st.coaSlice.selectedAccount);
  const [updateAc, { isLoading, isError, error, isSuccess }] =
    useUpdateAcMutation();
  const handleUpdate = async () => {
    try {
      const res = await updateAc(selectedAccount).unwrap();
      dispatch(
        toast({
          message: "Update Successfully!",
          severity: "success",
        })
      );
    } catch (error) {
      console.log(error);
      if (error) {
        dispatch(
          toast({
            message: "Error!",
            severity: "error",
          })
        );
        dispatch(setErrors(error?.data?.errors));
      }
    }
  };
  return (
    <Button variant="contained" onClick={handleUpdate}>
      Update
    </Button>
  );
};

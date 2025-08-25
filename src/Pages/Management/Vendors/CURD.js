import { Delete, Edit } from "@mui/icons-material";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import _ from "lodash";
import React from "react";
import { forwardRef } from "react";
import { useState } from "react";
import { Error } from "../../helpers/helpers";
import { useEffect } from "react";
import {
  useGetAccountsQuery,
  useStoreVendorMutation,
  useUpdateVendorMutation,
} from "../../../features/vendorlist/vendorlistApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setOpen,
  setVariant,
} from "../../../features/vendorlist/vendorlistSlice";
import {
  setAlertShow,
  setMessage,
  setSeverity,
  toast,
} from "../../../features/alert/alertSlice";
const defaultState = {
  id: "",
  name: "",
  account_id: "",
  cnic: "",
  mob_no: "",
  address: "",
  job: "",
  status: "",
  email: "",
};
const CURD = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { open, variant, selectedVendor } = useSelector(
    (state) => state.vendorlistSlice
  );
  const {
    data: accounts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAccountsQuery();
  const [updateVendor, { isLoading: uLoading, isSuccess: uSuccess }] =
    useUpdateVendorMutation();
  const [
    storeVendor,
    {
      data: sResponse,
      isLoading: sLoading,
      isSuccess: sSuccess,
      isError: sError,
      error: serror,
    },
  ] = useStoreVendorMutation();
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});
  const [disbaled, setDisabled] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const handleSubmit = async () => {
    try {
      if (variant === "edit") {
        const res = await updateVendor(state).unwrap();
        console.log(res);
      }
      if (variant === "create") {
        await storeVendor(state).unwrap();
      }
      dispatch(
        toast({ show: true, message: "Vendor Created!", severity: "success" })
      );
      dispatch(setOpen(false));
    } catch (error) {
      console.log(error);
      if (error?.status === 422) {
        dispatch(
          toast({
            show: true,
            message: "Provided Data is not Valid",
            severity: "error",
          })
        );
        setErrors(error?.data?.errors);
      }
    }
  };
  useEffect(() => {
    if (variant === "view") {
      setState(selectedVendor);
      setDisabled(true);
    }
    if (variant === "edit") {
      setState(selectedVendor);
      setDisabled(false);
    }
    if (variant === "create") {
      setState(defaultState);
      setDisabled(false);
    }
  }, [variant, selectedVendor]);

  return (
    <Dialog open={open} onClose={() => dispatch(setOpen(false))} fullWidth>
      <DialogTitle fontWeight={"700"}>{variant.toUpperCase()}</DialogTitle>
      <DialogContent>
        <ImageContainer url={state?.url && state.url} />
        <Stack direction={"row"} spacing={2} m={1}>
          {variant !== "create" && (
            <Stack>
              <Box
                component={Paper}
                elevation={3}
                bgcolor={blue[400]}
                flex={1}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={2}
                sx={{ cursor: "pointer" }}
                onClick={() => dispatch(setVariant("edit"))}
                px={1}
              >
                <IconButton
                  size="large"
                  sx={{ border: 2, borderColor: grey[100] }}
                >
                  <Edit fontSize="large" sx={{ color: grey[50] }} />
                </IconButton>
              </Box>
              <Box
                component={Paper}
                elevation={3}
                bgcolor={blue[400]}
                flex={1}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                mb={2}
                px={1}
                sx={{ cursor: "pointer" }}
                //   onClick={() => dispatch(setVariant("edit"))}
              >
                <IconButton
                  size="large"
                  sx={{ border: 2, borderColor: grey[100] }}
                >
                  <Delete fontSize="large" sx={{ color: grey[50] }} />
                </IconButton>
              </Box>
            </Stack>
          )}
          <Stack sx={{ flexGrow: 1 }}>
            <MyTextField
              name="name"
              label="Vendor Name"
              value={state.name}
              handleChange={handleChange}
              errors={errors}
              disbaled={disbaled}
            />
            <Autocomplete
              disabled={disbaled}
              options={accounts || []}
              getOptionLabel={(option) => option.acctname}
              value={accounts?.find((v) => v.id == state.account_id) || null}
              onChange={(e, v) => {
                setState({ ...state, account_id: v.id });
              }}
              isOptionEqualToValue={(o, v) => o.id === v.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Account"
                  margin="dense"
                  error={_.has(errors, "account_id")}
                  helperText={<Error errors={errors} name={"account_id"} />}
                />
              )}
            />
            <MyTextField
              name="cnic"
              label="CNIC#"
              value={state.cnic}
              handleChange={handleChange}
              errors={errors}
              disbaled={disbaled}
            />
            <MyTextField
              name="mob_no"
              label="Mobile Number"
              value={state.mob_no}
              handleChange={handleChange}
              errors={errors}
              disbaled={disbaled}
            />
            <MyTextField
              name="email"
              label="Email Address"
              value={state.email}
              handleChange={handleChange}
              errors={errors}
              disbaled={disbaled}
            />
            <MyTextField
              name="address"
              label="Address"
              value={state.address}
              handleChange={handleChange}
              errors={errors}
              disbaled={disbaled}
            />
            <MyTextField
              name="job"
              label="JOB"
              value={state.job}
              handleChange={handleChange}
              errors={errors}
              disbaled={disbaled}
            />
            <MyTextField
              name="status"
              label="Current Status"
              value={state.status}
              handleChange={handleChange}
              errors={errors}
              disbaled={disbaled}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        {variant !== "view" && (
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
});
export default React.memo(CURD);

const MyTextField = ({
  name,
  label,
  value,
  handleChange,
  errors,
  disbaled,
}) => (
  <TextField
    disabled={disbaled}
    name={name}
    label={label}
    value={value || ""}
    onChange={handleChange}
    fullWidth
    margin="dense"
    error={_.has(errors, name)}
    helperText={<Error errors={errors} name={name} />}
  />
);

const ImageContainer = ({ url, size = 100 }) => {
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="flex-start"
      width="100%"
      p={2}
    >
      {/* <Avatar
        src={
          url &&
          route("files", {
            file: "6N0mrxcyqAs4aUgam3P3lplaxnCOY7qjAVHpkvrG.jpg",
          })
        }
        alt="User"
        sx={{
          width: size,
          height: size,
          border: "2px solid #ccc",
          boxShadow: 3,
        }}
      /> */}
    </Box>
  );
};

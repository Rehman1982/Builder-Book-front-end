import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import react, { useState } from "react";
import { Error } from "../../helpers/helpers";
import { useStoreUserMutation } from "../../../features/user/userApi";
import { useDispatch, useSelector } from "react-redux";
import { setErrors } from "../../../features/user/userSlice";
import _ from "lodash";
import { toast } from "../../../features/alert/alertSlice";

const AddUser = ({ refresh }) => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.userSlice.errors);

  const [open, setOpen] = useState(false);
  const [emailAddres, setEmailAddress] = useState("");
  const [storeUser, { isLoading, isSuccess }] = useStoreUserMutation();
  const handleAdd = async () => {
    try {
      const res = await storeUser({ email: emailAddres }).unwrap();
      console.log(res);
      dispatch(
        toast({ message: "User Added Successfully", severity: "success" })
      );
      setOpen(false);
    } catch (error) {
      dispatch(
        toast({ message: "Operation Un-successful", severity: "error" })
      );
      if (error.status === 422) {
        dispatch(setErrors(error?.data?.errors));
      }
      console.log(error);
    }
  };
  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setOpen(true);
          dispatch(setErrors({}));
        }}
      >
        Add User
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add user to company</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={emailAddres}
            onChange={(e) => setEmailAddress(e.target.value)}
            margin="dense"
            error={_.has(errors, "email")}
            helperText={<Error errors={errors} name="email" />}
          />
          <Button fullWidth variant="contained" onClick={handleAdd}>
            Add User in Company
          </Button>
          <Typography variant="body1" paragraph mt={1}>
            The user must be registed in Builder's Book.
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default AddUser;

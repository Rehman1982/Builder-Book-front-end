import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDestroyItemMutation } from "../../features/itemlist/itemlistApi";
import _ from "lodash";
import { Error } from "../../components/ui/helpers";
import { toast } from "../../features/alert/alertSlice";
import { setErrors } from "../../features/itemlist/itemlistSlice";

const Delete = () => {
  const dispatch = useDispatch();
  // local states
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState();
  // Global States
  const errors = useSelector((state) => state.itemlistSlice.errors);
  const selectedIds = useSelector((state) => state.itemlistSlice.deleteIds);
  const [destroyItem, { isLoading }] = useDestroyItemMutation();
  const handleDelete = async () => {
    try {
      const res = await destroyItem({ code: code, ids: selectedIds }).unwrap();
      dispatch(
        toast({ message: "Operation Successfull!", severity: "success" })
      );
      console.log(res);
    } catch (error) {
      console.log(error);
      if (error.status === 422) {
        dispatch(setErrors(error?.data?.errors));
        dispatch(
          toast({ message: "Operation Un-Successfull!", severity: "error" })
        );
      }
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Delete</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <TextField
            name="code"
            value={code || ""}
            onChange={(e) => setCode(e.target.value)}
            label="Signatory Code"
            error={_.has(errors, "code")}
            helperText={<Error errors={errors} name="code" />}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button>Cancel</Button>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Delete;

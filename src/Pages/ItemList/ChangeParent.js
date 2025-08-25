import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useChangeParentItemMutation,
  useGetPartialsQuery,
} from "../../features/itemlist/itemlistApi";
import _ from "lodash";
import { Error } from "../../components/ui/helpers";
import { toast } from "../../features/alert/alertSlice";
import { clearItem, setErrors } from "../../features/itemlist/itemlistSlice";

const ChangeParent = () => {
  const dispatch = useDispatch();
  // local states
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState();
  const [newParentId, setNewParentId] = useState(null);
  // Global States
  const errors = useSelector((state) => state.itemlistSlice.errors);
  const { data: partials = [], isLoading } = useGetPartialsQuery();
  const { parents } = partials;
  return (
    <>
      <Button onClick={() => setOpen(true)}>Change Parent(s)</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle></DialogTitle>
        <DialogContent>
          <Autocomplete
            options={parents || []}
            getOptionLabel={(opt) => opt.item || ""}
            value={parents.find((pi) => pi?.id === newParentId) || null}
            onChange={(e, v) => {
              setNewParentId(v?.id);
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Parent" margin="dense" />
            )}
          />
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
          <SaveButton code={code} newParent_id={newParentId} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangeParent;
const SaveButton = ({ code, newParent_id }) => {
  const dispatch = useDispatch();
  const selectedIds = useSelector((state) => state.itemlistSlice.deleteIds);
  const [changeParentItem, { isLoading }] = useChangeParentItemMutation();
  const handleApi = async () => {
    try {
      const res = await changeParentItem({
        code: code,
        ids: selectedIds,
        newParent_id: newParent_id,
      }).unwrap();
      dispatch(
        toast({ message: "Operation Successfull!", severity: "success" })
      );
      dispatch(clearItem());
      dispatch(clearItem());
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

  return <Button onClick={handleApi}>Delete</Button>;
};

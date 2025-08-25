import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import _ from "lodash";
import React, { useState } from "react";
import { Error } from "../../helpers/helpers";
import { blue, grey, red } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { useDestroyMutation } from "../../../features/projects/projectsApi";
import {
  clearDeleteIds,
  setErrors,
} from "../../../features/projects/projectsSlice";
import { toast } from "../../../features/alert/alertSlice";

const DeleteProjects = () => {
  const dispatch = useDispatch();
  const deleteIds = useSelector((state) => state.projectsSlice.deleteIds);
  const errors = useSelector((state) => state.projectsSlice.errors);
  const [destroy, { isLoading, isError, error, isSuccess }] =
    useDestroyMutation();
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await destroy({ code: code, ids: deleteIds }).unwrap();
      setOpen(false);
      dispatch(clearDeleteIds([]));
      dispatch(
        toast({ message: "Delete Success", severity: "success", show: true })
      );
    } catch (error) {
      console.log(error);
      if (error) {
        dispatch(setErrors(error?.data?.errors));
        dispatch(
          toast({
            message: error?.data?.message,
            severity: "error",
            show: true,
          })
        );
      }
    }
  };
  return (
    <Box>
      <Badge color="error" badgeContent={deleteIds?.length}>
        <IconButton
          onClick={() => setOpen(true)}
          sx={{ border: 2, borderColor: red[600] }}
        >
          <Icon color="error">delete</Icon>
        </IconButton>
      </Badge>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <Stack
          px={2}
          py={1}
          bgcolor={blue[600]}
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h6" color={grey[50]}>
            {"Delete Projects"}
          </Typography>
          <IconButton
            onClick={() => setOpen(false)}
            children={<Icon sx={{ color: grey[100] }}>close</Icon>}
          />
        </Stack>
        <DialogContent>
          <Typography
            variant="body1"
            color={"error"}
            fontWeight={700}
            gutterBottom
          >
            This action can't be undone. Are you sure you want to delete the
            selected project(s)?
          </Typography>
          <TextField
            fullWidth
            label="Signatory Code"
            name="code"
            value={code || ""}
            onChange={(e) => setCode(e.target.value)}
            margin="dense"
            error={_.has(errors, "code") ? true : false}
            helperText={<Error errors={errors} name="code" />}
          />
        </DialogContent>
        <DialogActions>
          <ButtonGroup>
            <Button onClick={handleDelete}>I'm sure Proceed</Button>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default DeleteProjects;

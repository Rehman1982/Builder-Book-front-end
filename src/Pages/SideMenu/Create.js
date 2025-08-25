import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import _ from "lodash";
// import React from "react";
// import { useState } from "react";
import { Error } from "../helpers/helpers";
import { forwardRef } from "react";
// import { useImperativeHandle } from "react";
// import axios from "axios";
// import { useEffect } from "react";
// import API from "../../api/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import {
  selectItem_menu,
  close_menu,
  setErrors_menu,
} from "../../features/sidemenu/sidemenuSlice";
import {
  useGetControllersMenuQuery,
  useStoreMenuMutation,
} from "../../features/sidemenu/projectsApi";
const Create = forwardRef(({ allMenuItems }, ref) => {
  const dispatch = useDispatch();
  const { selectedItem: state, errors } = useSelector(
    (state) => state.sidemenuSlice.data_menu
  );
  const { variant, showDialog: open } = useSelector(
    (state) => state.sidemenuSlice.ui_menu
  );
  const { data: controllers = [], isLoading } = useGetControllersMenuQuery();
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(selectItem_menu({ ...state, [name]: value }));
  };
  const handleClose = () => {
    dispatch(close_menu());
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          name="sno"
          label="Serial No"
          placeholder="Serial NO."
          value={state?.sno || ""}
          onChange={handleChange}
          error={_.has(errors, "sno")}
          helperText={<Error errors={errors} name="sno" />}
          margin="dense"
          size="small"
        />
        <TextField
          fullWidth
          name="title"
          label="Screen Name"
          placeholder="Screen Naem"
          value={state?.title || ""}
          onChange={handleChange}
          error={_.has(errors, "title")}
          helperText={<Error errors={errors} name="title" />}
          margin="dense"
          size="small"
        />
        <TextField
          fullWidth
          name="href"
          label="Link"
          placeholder="Link"
          value={state?.href || ""}
          onChange={handleChange}
          error={_.has(errors, "href")}
          helperText={<Error errors={errors} name="href" />}
          margin="dense"
          size="small"
        />
        <TextField
          fullWidth
          name="icon"
          label="Icon"
          placeholder="Icon"
          value={state?.icon || ""}
          onChange={handleChange}
          error={_.has(errors, "icon")}
          helperText={<Error errors={errors} name="icon" />}
          margin="dense"
          size="small"
        />
        <Autocomplete
          options={allMenuItems || null}
          getOptionLabel={(options) => options.title}
          getOptionKey={(option) => option.id}
          value={allMenuItems.find((m) => m.id == state?.parent_id) || null}
          onChange={(e, v) =>
            dispatch(selectItem_menu({ ...state, parent_id: v.id }))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Parent Menu"
              margin="dense"
              size="small"
            />
          )}
        />
        <Autocomplete
          options={controllers || []}
          getOptionLabel={(option) => option.name || ""}
          value={controllers.find((v) => v.id === state?.controller_id) || null}
          onChange={(e, value) =>
            dispatch(selectItem_menu({ ...state, controller_id: value?.id }))
          }
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              error={_.has(errors, "controller")}
              helperText={<Error errors={errors} name="controller" />}
              margin="dense"
              size="small"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <SaveButton />
      </DialogActions>
    </Dialog>
  );
});
export default Create;

const SaveButton = () => {
  const dispatch = useDispatch();
  const state = useSelector(
    (state) => state.sidemenuSlice.data_menu.selectedItem
  );
  const [storeMenu, { isLoading, isError }] = useStoreMenuMutation();
  const handleApi = async () => {
    try {
      const res = await storeMenu(state).unwrap();
      console.log(res);
      dispatch(close_menu());
    } catch (error) {
      if (error.status === 422) {
        dispatch(setErrors_menu(error?.data?.errors));
      }
    }
  };
  return <Button onClick={handleApi}>Update</Button>;
};

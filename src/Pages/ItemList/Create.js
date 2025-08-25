import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Box,
  IconButton,
  Typography,
  Slide,
  Stack,
  TextField,
  Autocomplete,
  Button,
  DialogActions,
  Grid,
  Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { blue, grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  clearItem,
  setErrors,
  setItem,
} from "../../features/itemlist/itemlistSlice";
import {
  useGetPartialsQuery,
  useStoreItemMutation,
  useUpdateItemMutation,
} from "../../features/itemlist/itemlistApi";
import { Error } from "../../components/ui/helpers";
import _ from "lodash";
import { setSeverity, toast } from "../../features/alert/alertSlice";

const Create = (props, ref) => {
  const dispatch = useDispatch();
  //
  const selectedItem = useSelector((state) => state.itemlistSlice.selectedItem);
  const { variant, show: open } = useSelector(
    (state) => state.itemlistSlice.ui
  );
  // local State
  //   const [state, setState] = useState({});
  //   const [accounts, setAccoutns] = useState([]);
  //   const [units, setUnits] = useState([]);

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(clearItem())}
      keepMounted
      maxWidth="sm"
      fullWidth
    >
      <Box
        sx={{
          bgcolor: blue[500],
          color: "white",
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {selectedItem.item || ""}
        </Typography>
        <IconButton
          onClick={() => dispatch(clearItem())}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent
        sx={{
          bgcolor: grey[100],
          minHeight: 150,
          py: 3,
        }}
      >
        <Contents />
      </DialogContent>
      <DialogActions>
        <UpdateButton />
      </DialogActions>
    </Dialog>
  );
};

export default Create;

const Contents = () => {
  const TypeArray = [
    { name: "Inventory", value: 3 },
    { name: "Non-Inventory", value: 4 },
    { name: "Assembly", value: 5 },
  ];
  const StatusArray = [
    { name: "active", value: "1" },
    { name: "in-Active", value: "0" },
  ];
  const EntryArray = [
    { name: "Allowed", value: "1" },
    { name: "Not-Allowed", value: "0" },
  ];
  const dispatch = useDispatch();
  // API calls
  const { data: partials = [], isLoading, isError } = useGetPartialsQuery();
  // global State
  const { parent_id, account_id, item, unit, status, type, entry } =
    useSelector((state) => state.itemlistSlice.selectedItem);
  const errors = useSelector((state) => state.itemlistSlice.errors);
  return (
    <Stack>
      <MyTextField
        name="item"
        value={item || ""}
        onChange={(e) => dispatch(setItem({ item: e.target.value }))}
        label="Item Name"
      />
      <Autocomplete
        options={partials?.Cogs_Acs || []}
        getOptionLabel={(opt) => opt.name || ""}
        value={partials?.Cogs_Acs?.find((c) => c?.id === account_id) || null}
        onChange={(e, v) => {
          dispatch(setItem({ account_id: v?.id }));
        }}
        renderInput={(params) => (
          <MyTextField {...params} label="Account" name="account_id" />
        )}
      />
      <Autocomplete
        options={partials?.parents || []}
        getOptionLabel={(opt) => opt.item || ""}
        value={partials?.parents?.find((c) => c?.id === parent_id) || ""}
        onChange={(e, v) => {
          dispatch(setItem({ parent_id: v?.id }));
        }}
        renderInput={(params) => (
          <MyTextField {...params} label="Parent Name" name="parent_id" />
        )}
      />
      <Stack direction={"row"}>
        <Autocomplete
          fullWidth
          options={partials?.units || []}
          getOptionLabel={(opt) => opt.unit || ""}
          value={partials?.units?.find((c) => c?.id === unit) || ""}
          onChange={(e, v) => {
            dispatch(setItem({ unit: v?.id }));
          }}
          renderInput={(params) => (
            <MyTextField {...params} label="Unit" name="unit" />
          )}
        />
        <Autocomplete
          fullWidth
          options={TypeArray || []}
          getOptionLabel={(opt) => opt.name || ""}
          value={TypeArray?.find((c) => c?.value === type) || ""}
          onChange={(e, v) => {
            dispatch(setItem({ type: v?.value }));
          }}
          renderInput={(params) => (
            <MyTextField {...params} label="Item Type" name="type" />
          )}
        />
      </Stack>
      <Stack direction={"row"}>
        <Autocomplete
          fullWidth
          options={StatusArray || []}
          getOptionLabel={(opt) => opt.name || ""}
          value={StatusArray?.find((s) => s.value === status) || ""}
          onChange={(e, v) => {
            dispatch(setItem({ status: v?.value }));
          }}
          renderInput={(params) => (
            <MyTextField {...params} label="Status" name="status" />
          )}
        />
        <Autocomplete
          fullWidth
          options={EntryArray || []}
          getOptionLabel={(opt) => opt.name || ""}
          value={EntryArray?.find((s) => s.value === entry) || ""}
          onChange={(e, v) => {
            dispatch(setItem({ entry: v?.value }));
          }}
          renderInput={(params) => (
            <MyTextField {...params} label="Entry" name="entry" />
          )}
        />
      </Stack>
      <InventorDetails partials={partials} />
    </Stack>
  );
};

const MyTextField = (props) => {
  const errors = useSelector((state) => state.itemlistSlice.errors);
  const { variant } = useSelector((state) => state.itemlistSlice.ui);
  return (
    <TextField
      {...props}
      margin="dense"
      disabled={variant === "view" ? true : false}
      error={_.has(errors, props?.name)}
      helperText={<Error errors={errors} name={props?.name} />}
    />
  );
};

const InventorDetails = ({ partials }) => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.itemlistSlice.errors);
  const { type, inventory_ac, income_ac, cost_rate, sale_rate } = useSelector(
    (state) => state.itemlistSlice.selectedItem
  );
  const { assets: assetsAcs, income: incomeAcs } = partials;
  return (
    <Collapse in={type === 3 ? true : false}>
      <Stack component={"fieldset"} borderRadius={1}>
        <Typography variant="body1" fontWeight={700} component={"legend"}>
          Inventory Details
        </Typography>
        <Stack direction="row">
          <Autocomplete
            fullWidth
            options={assetsAcs || []}
            getOptionLabel={(opt) => opt.name || ""}
            value={assetsAcs?.find((c) => c?.id === inventory_ac) || null}
            onChange={(e, v) => {
              dispatch(setItem({ inventory_ac: v?.id }));
            }}
            renderInput={(params) => (
              <MyTextField
                {...params}
                label="Inventory Account"
                name="inventory_ac"
              />
            )}
          />
          <Autocomplete
            fullWidth
            options={incomeAcs || []}
            getOptionLabel={(opt) => opt.name || ""}
            value={incomeAcs?.find((c) => c?.id === income_ac) || null}
            onChange={(e, v) => {
              dispatch(setItem({ income_ac: v?.id }));
            }}
            renderInput={(params) => (
              <MyTextField
                {...params}
                label="Income Account"
                name="income_ac"
              />
            )}
          />
        </Stack>
        <Stack direction="row">
          <MyTextField
            name="cost_rate"
            type="number"
            value={cost_rate || ""}
            onChange={(e) => dispatch(setItem({ cost_rate: e.target.value }))}
            label="Cost Prize"
            fullWidth
          />
          <MyTextField
            name="sale_rate"
            type="number"
            value={sale_rate || ""}
            onChange={(e) => dispatch(setItem({ sale_rate: e.target.value }))}
            label="Sale Prize"
            fullWidth
          />
        </Stack>
      </Stack>
    </Collapse>
  );
};

const UpdateButton = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.itemlistSlice.ui.variant);
  const selectedItem = useSelector((state) => state.itemlistSlice.selectedItem);
  const [updateItem, { isLoading: uLoading }] = useUpdateItemMutation();
  const [storeItem, { isLoading: sLoading }] = useStoreItemMutation();
  const handleUpdate = async () => {
    try {
      if (mode === "edit") await updateItem(selectedItem).unwrap();
      if (mode === "create") await storeItem(selectedItem).unwrap();
      dispatch(
        toast({ message: "Operation Successfull!", severity: "success" })
      );
      dispatch(clearItem());
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
    <Button onClick={handleUpdate}>
      Save {(uLoading || sLoading) && "Saving...."}
    </Button>
  );
};

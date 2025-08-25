import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
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
import { Error } from "../../helpers/helpers";
import { forwardRef } from "react";
import SideButton from "../SideButton";
import { blue, grey, orange } from "@mui/material/colors";
import Shares from "./Shares";
import { useDispatch, useSelector } from "react-redux";
import {
  close,
  selectProject,
  setErrors,
  setVariant,
} from "../../../features/projects/projectsSlice";
import {
  openComponent_shares as openShares,
  setProject_shares,
} from "../../../features/shares/sharesSlice";
import {
  useCreateQuery,
  useStoreMutation,
  useUpdateMutation,
} from "../../../features/projects/projectsApi";

const Create = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { errors, allprojects, showDialog, selectedProject, variant } =
    useSelector((state) => state.projectsSlice);
  const { data: accounts } = useCreateQuery();
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(selectProject({ ...selectedProject, [name]: value }));
  };
  return (
    <>
      <Dialog
        open={showDialog}
        onClose={() => dispatch(close())}
        fullWidth
        maxWidth="md"
      >
        <Box bgcolor={blue[500]} p={2}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h5" sx={{ color: grey[100] }}>
              {selectedProject?.name}
            </Typography>
            <IconButton onClick={() => dispatch(close(false))}>
              <Icon sx={{ color: grey[100] }} children={"close"} />
            </IconButton>
          </Stack>
        </Box>
        <DialogContent>
          <Stack direction={"row"} spacing={1}>
            <Stack direction={"column"}>
              {variant !== "create" && <SideButtons />}
            </Stack>
            <Stack flexGrow={1} direction={"column"}>
              <MyTextField
                fullWidth
                name="name"
                label="Project Name"
                placeholder="Project Name"
                value={selectedProject?.name || ""}
                onChange={handleChange}
                error={_.has(errors, "name")}
                helperText={<Error errors={errors} name="name" />}
              />
              <Autocomplete
                disabled={variant == "view" ? true : false}
                options={
                  allprojects
                    ? [
                        ...allprojects.map((p) => ({
                          id: p.id,
                          name: p.name,
                        })),
                      ]
                    : []
                }
                getOptionLabel={(option) => option.name || ""}
                value={
                  allprojects?.find(
                    (ap) => ap.id == selectedProject?.parent_id
                  ) || null
                }
                onChange={(e, v) =>
                  dispatch(
                    selectProject({ ...selectedProject, parent_id: v.id })
                  )
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Parent Project"
                    size="small"
                    margin="dense"
                  />
                )}
              />
              <MyTextField
                fullWidth
                name="sdate"
                label="Starting Date"
                placeholder="Starting Date"
                value={selectedProject?.sdate || ""}
                onChange={handleChange}
                error={_.has(errors, "sdate")}
                helperText={<Error errors={errors} name="sdate" />}
                margin="dense"
                size="small"
                type="date"
              />
              <MyTextField
                fullWidth
                name="depname"
                label="Department / Custormer Name"
                placeholder="Department /  Customer Name"
                value={selectedProject?.depname || ""}
                onChange={handleChange}
                error={_.has(errors, "depname")}
                helperText={<Error errors={errors} name="depname" />}
                margin="dense"
                size="small"
              />
              <MyTextField
                fullWidth
                name="tcost"
                label="Total Cost"
                placeholder="Total Cost"
                value={selectedProject?.tcost || ""}
                onChange={handleChange}
                error={_.has(errors, "tcost")}
                helperText={<Error errors={errors} name="tcost" />}
                margin="dense"
                size="small"
              />
              <MyTextField
                fullWidth
                name="ecost"
                label="Earnest Money"
                placeholder="Earnest Money"
                value={selectedProject?.ecost || ""}
                onChange={handleChange}
                error={_.has(errors, "ecost")}
                helperText={<Error errors={errors} name="ecost" />}
                margin="dense"
                size="small"
              />
              <MyTextField
                fullWidth
                name="edate"
                label="Completion Date"
                placeholder="Completion Date"
                value={selectedProject?.edate || " "}
                onChange={handleChange}
                error={_.has(errors, "edate")}
                helperText={<Error errors={errors} name="edate" />}
                margin="dense"
                size="small"
                type="date"
              />
              <MyTextField
                fullWidth
                multiline
                rows={3}
                name="remarks"
                label="Remarks"
                placeholder="Remarks"
                value={selectedProject?.remarks || ""}
                onChange={handleChange}
                error={_.has(errors, "remarks")}
                helperText={<Error errors={errors} name="remarks" />}
                margin="dense"
                size="small"
              />
              <MyTextField
                fullWidth
                name="status"
                label="Status"
                placeholder="Status"
                value={selectedProject?.status || ""}
                onChange={handleChange}
                error={_.has(errors, "status")}
                helperText={<Error errors={errors} name="status" />}
                margin="dense"
                size="small"
              />
              <MyTextField
                fullWidth
                name="link"
                label="Business Type"
                placeholder="Business Type"
                value={selectedProject?.link || ""}
                onChange={handleChange}
                error={_.has(errors, "link")}
                helperText={<Error errors={errors} name="link" />}
                margin="dense"
                size="small"
              />
              <MyTextField
                fullWidth
                name="entry"
                label="Entry Allowed"
                placeholder="Entry Allowed"
                value={selectedProject?.entry || ""}
                onChange={handleChange}
                error={_.has(errors, "entry")}
                helperText={<Error errors={errors} name="entry" />}
                margin="dense"
                size="small"
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
                disabled={variant == "view" ? true : false}
                options={accounts || []}
                getOptionLabel={(option) => option.name || ""}
                value={
                  accounts?.find((v) => v.id === selectedProject?.assetAc) ||
                  null
                }
                onChange={(e, value) =>
                  dispatch(
                    selectProject({
                      ...selectedProject,
                      assetAc: value?.id,
                    })
                  )
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    error={_.has(errors, "assetAc")}
                    helperText={<Error errors={errors} name="account" />}
                    margin="dense"
                    size="small"
                  />
                )}
              />
            </Stack>
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
  const { variant } = useSelector(
    (selectedProject) => selectedProject.projectsSlice
  );

  return (
    <TextField
      {...props}
      margin="dense"
      size="small"
      disabled={variant == "view" ? true : false}
    />
  );
};

const SideButtons = () => {
  const sharesRef = useRef();
  const dispatch = useDispatch();
  const { selectedProject: selectedProject, variant } = useSelector(
    (selectedProject) => selectedProject.projectsSlice
  );
  return (
    <Stack direction={"column"} alignItems={"center"} spacing={1}>
      <Shares ref={sharesRef} currentProject={selectedProject} />
      {selectedProject?.entry == 1 && (
        <>
          <SideButton
            text="Shares"
            icon="percent"
            action={() => {
              dispatch(openShares());
              dispatch(setProject_shares(selectedProject));
            }}
          />
        </>
      )}

      <SideButton
        text="Edit"
        icon="edit"
        action={() => dispatch(setVariant("edit"))}
      />
    </Stack>
  );
};

const CreateButton = () => {
  const dispatch = useDispatch();
  const { selectedProject } = useSelector((state) => state.projectsSlice);
  const [store, { isLoading, isError, error, isSuccess }] = useStoreMutation();
  const handeStore = async () => {
    try {
      const res = await store(selectedProject).unwrap();
      dispatch(close(false));
      dispatch(selectProject(null));
    } catch (error) {
      console.log(error);
      if (error.status === 422) {
        dispatch(setErrors(error?.data?.errors));
      }
    }
  };
  return (
    <Button variant="contained" onClick={() => handeStore()}>
      Create
    </Button>
  );
};
const UpdateButton = () => {
  const dispatch = useDispatch();
  const selectedProject = useSelector(
    (state) => state.projectsSlice.selectedProject
  );
  const [update, { isLoading, isError, error, isSuccess }] =
    useUpdateMutation();
  const handeUpdate = async () => {
    try {
      const res = await update(selectedProject).unwrap();
      dispatch(close(false));
      dispatch(selectProject(null));
    } catch (error) {
      console.log(error);
      if (error.status === 422) {
        dispatch(setErrors(error?.data?.errors));
      }
    }
  };
  return (
    <Button variant="contained" onClick={() => handeUpdate()}>
      Update
    </Button>
  );
};

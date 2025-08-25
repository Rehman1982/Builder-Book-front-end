import {
  Dialog,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Typography,
  TextField,
  CircularProgress,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import React, { forwardRef, useEffect, useMemo, useState } from "react";
import MyLoader from "../../helpers/MyLoader";
import { blue, red } from "@mui/material/colors";
import _ from "lodash";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { closeGeneral_Privilege } from "../../../features/privileges/privilegeSlice";
import {
  useGetAllPrivilegesQuery,
  useStorePrivilegeMutation,
} from "../../../features/privileges/privilegeApi";

const Index = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const [searchStr, setSearchStr] = useState("");
  const { user, project } = useSelector((state) => state.privilegeSlice);
  const open = useSelector(
    (state) => state.privilegeSlice.showGeneral_Privilege
  );
  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useGetAllPrivilegesQuery({
    user_id: user?.id,
    project_id: project?.id,
  });

  const filteredPrivileges = useMemo(() => {
    if (isError) return [];
    if (!searchStr) return data;
    return data.filter((item) =>
      item.name?.toLowerCase().includes(searchStr.toLowerCase())
    );
  }, [data, searchStr, isError]);
  return (
    <Dialog
      open={open}
      onClose={() => dispatch(closeGeneral_Privilege())}
      maxWidth="md"
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
        <Typography variant="body1" fontWeight={600}>
          {"Grant Permission(s)"} {project ? `for ${project?.name}` : ""}
        </Typography>
        <IconButton
          onClick={() => dispatch(closeGeneral_Privilege())}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        {isError && error.status == 422 ? (
          <List>
            {Object.entries(error?.data?.errors).map(([field, messages]) => (
              <ListItem key={field}>
                <ListItemText sx={{ color: red[600] }} primary={messages} />
              </ListItem>
            ))}
          </List>
        ) : (
          <TableContainer sx={{ maxHeight: "80vh", minHeight: "80vh" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <TextField
                      value={searchStr || ""}
                      size="small"
                      placeholder="search..."
                      onChange={(e) => setSearchStr(e.target.value)}
                    />
                  </TableCell>
                  <TableCell>List</TableCell>
                  <TableCell>Create</TableCell>
                  <TableCell>Update</TableCell>
                  <TableCell>Delete</TableCell>
                </TableRow>
              </TableHead>
              <Contents data={filteredPrivileges} />
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
});
export default Index;
const Contents = React.memo(({ data }) => {
  return (
    <TableBody size="small">
      {data?.map((v, i) => (
        <TableRow key={i}>
          <TableCell>
            <Typography variant="body1">{v.name}</Typography>
          </TableCell>
          <TableCell>
            <MyCheckbox name="index" value={v.index} data={v} />
          </TableCell>
          <TableCell>
            <MyCheckbox name="create" value={v.create} data={v} />
          </TableCell>
          <TableCell>
            <MyCheckbox name="update" value={v.update} data={v} />
          </TableCell>
          <TableCell>
            <MyCheckbox name="destroy" value={v.destroy} data={v} />
          </TableCell>
        </TableRow>
      ))}
      ;
    </TableBody>
  );
});
const MyCheckbox = ({ name, value, data }) => {
  const { user, project } = useSelector((state) => state.privilegeSlice);
  const [storePrivilege, { isLoading, isSuccess }] =
    useStorePrivilegeMutation();
  const handleChange = async (event) => {
    const { name, checked } = event.target;
    try {
      const res = await storePrivilege({
        user_id: user?.id,
        project_id: project?.id,
        controller_id: data.controller_id,
        id: data.privilege_id,
        method: name,
        checked: checked,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Checkbox
          onChange={(e) => handleChange(e)}
          name={name}
          size="medium"
          checked={value == "1" ? true : false}
        />
      )}
    </>
  );
};

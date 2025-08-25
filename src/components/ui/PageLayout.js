import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import API from "../../api/axiosApi";
import {
  Box,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { blue, orange } from "@mui/material/colors";
import dayjs from "dayjs";
import _ from "lodash";
import FilterForm from "./FilterForm";
import PeriodSelector from "./PeriodSelector";

const PageLayout = ({
  children,
  filters,
  setFilters,
  period,
  setPeriod,
  create,
  edit,
  pagination,
  left,
}) => {
  return (
    <Box width={"100%"}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        mb={1}
      >
        <Stack>
          {left && left}
          <Typography variant="body2">
            <span>
              {period?.from && dayjs(period.from).format("DD-MMM-YYYY")}{" "}
            </span>
            <span>
              {period?.to && " To " + dayjs(period.to).format("DD-MMM-YYYY")}{" "}
            </span>
          </Typography>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          {create || ""}
          <FilterForm filters={filters || []} setFilters={setFilters || ""} />
          {period && (
            <PeriodSelector
              periodFrom={period?.from}
              periodTo={period?.to}
              onSubmit={(v) => setPeriod(v)}
            />
          )}
        </Stack>
      </Stack>
      <Divider sx={{ my: 1 }} />
      {pagination && (
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"flex-end"}
          mb={1}
        >
          {pagination}
        </Stack>
      )}
      <Box>{children || "Nothing to Display"}</Box>
    </Box>
  );
};

export default PageLayout;

// const EditDialog = forwardRef(({ children }, ref) => {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   useImperativeHandle(ref, () => ({
//     open: handleOpen,
//     close: handleClose,
//   }));
//   return (
//     <Dialog open={open} onClose={handleClose}>
//       <DialogContent>{children}</DialogContent>
//     </Dialog>
//   );
// });
// const CreateDialog = forwardRef(({ children }, ref) => {
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   useImperativeHandle(ref, () => ({
//     open: handleOpen,
//     close: handleClose,
//   }));
//   return (
//     <Dialog open={open} onClose={handleClose}>
//       <DialogContent>{children}</DialogContent>
//     </Dialog>
//   );
// });

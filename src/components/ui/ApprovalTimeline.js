import React, { forwardRef } from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import {
  Box,
  Dialog,
  DialogContent,
  Icon,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { blue, green, grey, orange } from "@mui/material/colors";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { closeSignatures } from "../../features/signatures/signatureSlice";
import { useShowSignatureQuery } from "../../features/signatures/signatureApi";

const ApprovalTimeline = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMD = useMediaQuery(theme.breakpoints.up("xs"));

  const { object_type = "", object_id = "" } = useSelector(
    (s) => s.signatureSlice.props
  );
  const { variant, showComponent: open } = useSelector(
    (s) => s.signatureSlice.ui
  );

  const { data = [] } = useShowSignatureQuery(
    {
      type: object_type,
      id: object_id,
    },
    { skip: !object_id || !object_type }
  );
  const handleClose = () => {
    dispatch(closeSignatures());
  };
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <Box sx={{ p: 2, bgcolor: blue[400], color: grey[100] }}>
        <Typography variant="h5" sx={{ color: grey[50] }}>
          Approvals
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 1, right: 1 }}
        >
          <Icon sx={{ color: grey[50] }}>close</Icon>
        </IconButton>
      </Box>
      <DialogContent>
        {data?.length > 0 && (
          <Timeline position="alternate">
            {data?.map((item) => (
              <TimelineItem key={item.id}>
                <TimelineOppositeContent
                  sx={{ m: "auto 0" }}
                  align="right"
                  variant="body2"
                  color="text.secondary"
                >
                  {item.marked_on && (
                    <>
                      <Typography variant="body2">
                        {dayjs(item.marked_on).format("DD-MMM-YYYY (hh:m a)")}
                      </Typography>
                    </>
                  )}
                  {item.signed_on && (
                    <>
                      <Typography variant="body2">
                        {dayjs(item.signed_on).format("DD-MMM-YYYY (hh:m a)")}
                      </Typography>
                    </>
                  )}
                  {/* {item.signed_on && (
                                    <Typography variant="subtitle">
                                        {dayjs(item.signed_on).format(
                                            "DD-MMM-YYYY"
                                        )}
                                    </Typography>
                                )} */}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot
                    sx={{
                      bgcolor: item.signature == 1 ? green[500] : orange[300],
                    }}
                  >
                    <Icon
                      children={
                        item.signature == 1 ? "check" : "hourglass_empty"
                      }
                    />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent sx={{ py: "12px", px: 2 }}>
                  <Typography variant="body2" fontWeight={700} component="span">
                    {item?.user_name}
                  </Typography>
                  {/* <Typography variant="body2">
                                    {item?.signed_on &&
                                        dayjs(item.signed_on).format(
                                            "DD-MMM-YYYY (h:m a)"
                                        )}
                                </Typography> */}
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        )}
      </DialogContent>
    </Dialog>
  );
});
export default ApprovalTimeline;

import { IconButton } from "@mui/material";
import { blue } from "@mui/material/colors";
import { Typography } from "@mui/material";

export const IButton = (props) => {
  return (
    <IconButton
      sx={{ border: 1, borderColor: blue[600], color: blue[600] }}
      {...props}
    ></IconButton>
  );
};
export const Body1 = (props) => (
  <Typography variant="body1" {...props}></Typography>
);
export const Body2 = (props) => (
  <Typography variant="body2" {...props}></Typography>
);
export const Heading = (props) => (
  <Typography variant="h6" {...props}></Typography>
);
export const Bold = (props) => (
  <Typography fontWeight={600} variant="body1" {...props}></Typography>
);

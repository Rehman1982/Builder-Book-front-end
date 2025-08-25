import { Typography } from "@mui/material";

const Body1 = (props) => <Typography variant="body1" {...props}></Typography>;
const Body2 = (props) => <Typography variant="body2" {...props}></Typography>;
const Heading = (props) => <Typography variant="h6" {...props}></Typography>;
const Bold = (props) => (
  <Typography fontWeight={600} variant="body1" {...props}></Typography>
);

export { Body1, Body2, Heading, Bold };

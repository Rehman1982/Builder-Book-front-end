import { Box, Button, Container, Typography } from "@mui/material";
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  console.log("Error Page Errors", isRouteErrorResponse(error));

  if (isRouteErrorResponse(error)) {
    if (error.status === 422) {
      return (
        <MessageComponent
          heading="Forbidden"
          body="Sorry! You are not authorized for this Operation. Contact Admin"
        />
      );
    }
    if (error.status === 403) {
      return (
        <MessageComponent
          heading="Forbidden"
          body="Sorry! You are not authorized for this Operation. Contact Admin"
        />
      );
    }
    if (error.status === 500) {
      return (
        <MessageComponent heading="Server Error" body="Something wentWrong" />
      );
    }
    return <MessageComponent heading="Error" body="Page Not Found" />;
  }
};
export default ErrorPage;

const MessageComponent = ({ heading, body }) => {
  const navigate = useNavigate();
  return (
    <Container>
      <Box mt={3}>
        <Button onClick={() => navigate(-1)}>Back</Button>
        <Typography variant="h5">{heading}</Typography>
        <Typography variant="body1" paragraph>
          {body}
        </Typography>
      </Box>
    </Container>
  );
};

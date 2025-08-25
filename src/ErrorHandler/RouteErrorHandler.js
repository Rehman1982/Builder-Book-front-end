import { useContext } from "react";
import { useRouteError, Navigate, useNavigate } from "react-router-dom";
import { Alert } from "../context/AlertBar/AlertBar";
import { Box, Typography } from "@mui/material";
import { blue } from "@mui/material/colors";

export default function RouteErrorHandler() {
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const navigate = useNavigate();
    const error = useRouteError();
    if (error.status === 401) {
        // you are not login frist try to refresh the token
        return <Navigate to={"/public/login"} />;
    }
    if (error.status === 403) {
        return <Navigate to={"/public/email/verify"} />;
    }
    // return (
    //     <Box>
    //         <Typography variant="body1">Error Thrown</Typography>
    //         <Typography variant="body2">
    //             Status: {error.status || "unkonw"}
    //         </Typography>
    //         <Typography variant="body2">
    //             Status: {error.statusText || "unkonw"}
    //         </Typography>
    //         <Typography variant="body2">
    //             Status: {error.message || "no details"}
    //         </Typography>
    //     </Box>
    // );
}

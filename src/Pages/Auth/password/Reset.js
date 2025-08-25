import {
    Box,
    TextField,
    Button,
    Stack,
    Typography,
    Divider,
    Container,
    Paper,
} from "@mui/material";
import axios from "axios";
import _ from "lodash";
import React from "react";
import { useState } from "react";
import { Error } from "../../helpers/helpers";
import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useContext } from "react";
import { Alert } from "../../../context/AlertBar/AlertBar";

const ResetPassword = () => {
    // const { token, email } = useParams();
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const query = new URLSearchParams(location.search);
    const [state, setState] = useState({
        token: query?.get("token"),
        email: query?.get("email"),
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({});
    const handleSubmit = async () => {
        try {
            const result = await axios.post(route("password.reset"), state);
            if (result.status === 203) {
                setErrors(result.data);
            }
            if (result.status === 200) {
                setMessage("Password Chaged Successfully!");
                showAlert(true);
            }
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box
            sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%,-50%)",
                bgcolor: "transparent",
            }}
        >
            <Box
                sx={{ mb: 1, py: 1, textAlign: "center", borderRadius: 1 }}
                component={Paper}
                elevation={3}
            >
                <Typography variant="h5"> Builder's Book</Typography>
            </Box>
            <Box
                width={{ xs: "100%", md: 300 }}
                component={Paper}
                elevation={3}
                p={2}
                borderRadius={1}
            >
                {/* <TextField
                    label="Email"
                    name="email"
                    value={state.email}
                    margin="dense"
                    fullWidth
                    disabled
                    error={_.has(errors, "email")}
                    helperText={<Error errors={errors} name="email" />}
                /> */}
                <TextField
                    label="New Password"
                    name="password"
                    margin="dense"
                    value={state.password}
                    onChange={(e) =>
                        setState({ ...state, password: e.target.value })
                    }
                    error={_.has(errors, "password")}
                    helperText={<Error errors={errors} name="password" />}
                    fullWidth
                />
                <TextField
                    label="Confirm Password"
                    name="password_confirmation"
                    margin="dense"
                    value={state.password_confirmation}
                    onChange={(e) =>
                        setState({
                            ...state,
                            password_confirmation: e.target.value,
                        })
                    }
                    error={_.has(errors, "password_confirmation")}
                    helperText={
                        <Error errors={errors} name="password_confirmation" />
                    }
                    fullWidth
                />
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button
                        component={Link}
                        to={"/public/login"}
                        variant="text"
                        sx={{ mt: 1 }}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        sx={{ mt: 1 }}
                    >
                        Change Password
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default ResetPassword;

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
import { Link } from "react-router-dom";

const Email = () => {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const handleSubmit = async () => {
        try {
            const result = await axios.post(route("password.email"), {
                email: email,
            });
            if (result.status === 203) {
                setErrors(result.data);
            }
            if (result.status === 200) {
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
                p: 2,
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
                <Typography variant="body1" gutterBottom>
                    Reset Password
                </Typography>
                <Divider
                    sx={{ my: 1, bgcolor: "divider" }}
                    variant="fullWidth"
                />
                <TextField
                    label="email"
                    name="email"
                    margin="dense"
                    onChange={(e) => setEmail(e.target.value)}
                    error={_.has(errors, "email")}
                    helperText={<Error errors={errors} name="email" />}
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
                        Send Reset Link
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};

export default Email;

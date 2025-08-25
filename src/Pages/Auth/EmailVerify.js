import { Box, Icon, TextField, Typography, Button, Stack } from "@mui/material";
import { blue, grey } from "@mui/material/colors";
import React from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EmailVerify = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const resndLink = async () => {
        try {
            const result = await axios.post(route("verification.send"));
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Box
            sx={{
                position: "absolute",
                width: "50%",
                height: "50%",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
            }}
        >
            <Stack justifyContent={"space-between"} alignItems={"center"}>
                <Box
                    display="flex"
                    flexDirection={"column"}
                    justifyContent={"center"}
                    bgcolor={blue[600]}
                    textAlign={"center"}
                    p={1}
                    boxShadow={3}
                    borderRadius={3}
                    mb={1}
                >
                    <Icon sx={{ fontSize: "2rem", color: grey[100] }}>
                        emergency
                    </Icon>
                </Box>
                <Typography
                    variant="h6"
                    fontWeight={700}
                    textAlign={"center"}
                    gutterBottom
                >
                    Verify your Email Address
                </Typography>
                <Typography
                    variant="subtitle1"
                    textAlign={"center"}
                    gutterBottom
                >
                    An Email has been sent to your email address, kindly check
                    your inbox and follow the instructions to verify your email.
                </Typography>
                <Button onClick={resndLink} variant="contained">
                    Re-send
                </Button>
            </Stack>
        </Box>
    );
};

export default EmailVerify;

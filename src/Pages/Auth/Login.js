import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { blue, green, grey } from "@mui/material/colors";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// import MyImage from "../../../../../htdocs/bgpic.jpg";
// import { useContext } from "react";
// import AuthContext from "../../context/AuthContext";
import { useEffect } from "react";
import { useState } from "react";
import { useLoginMutation } from "../../features/auth/authApi";
import { Error } from "../../components/ui/helpers";

const Login = () => {
    const navigate = useNavigate();
    const [login,{data, isLoading, isSuccess, isError, error}] = useLoginMutation();
    const [errors, setErrors] = useState({});
    const [state, setState] = useState({ email: "", password: "" });
    const handleLogin =async () =>{
        try {
            const res = await login(state);
            console.log(res);
            if(res?.error?.status===422){
                setErrors(res?.error?.data?.errors);
            }
        } catch (bb) {
            
        }   
    }
    useEffect(()=>{
        if(isSuccess){
                navigate("/main");
            }
    },[isSuccess]);
    return (
        <Box
            sx={{
                width: "50vw",
                height: "50vh",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                bgcolor: grey[50],
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
            }}
        >
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                divider={<Divider orientation="vertical" flexItem />}
                height={"100%"}
            >
                <Box
                    sx={{
                        backgroundImage: 'url("/public/bgpic.jpg")',
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        width: "50%",
                        height: "100%",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Typography
                        variant="h4"
                        sx={{
                            color: grey[100],
                            fontWeight: 800,
                            textShadow: `2px 2px 4px ${grey[600]}`,
                        }}
                    >
                        Builder's Book
                    </Typography>
                    <Typography
                        variant="body2"
                        textAlign={"center"}
                        sx={{
                            color: grey[100],
                            textShadow: `1px 1px 2px ${grey[600]}`,
                            mx: 2,
                        }}
                    >
                        Effortlessly manage your construction projects and
                        resources.
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "50%",
                        height: "100%",
                        px: 3,
                        bgcolor: grey[300],
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: grey[600],
                            textShadow: `2px 2px 3px ${blue[50]}`,
                        }}
                        gutterBottom
                    >
                        Please enter your account details
                    </Typography>
                    <TextField
                        value={state.email || ""}
                        onChange={(e) =>
                            setState({ ...state, email: e.target.value })
                        }
                        size="small"
                        fullWidth
                        label="Email"
                        margin="dense"
                        helperText={<Error name="email" errors={errors}/>}
                    />
                    <TextField
                        value={state.password}
                        onChange={(e) =>
                            setState({ ...state, password: e.target.value })
                        }
                        size="small"
                        fullWidth
                        label="Password"
                        margin="dense"
                        type="password"
                        helperText={<Error name="password" errors={errors}/>}
                    />
                    <Stack
                        direction={"column"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        spacing={2}
                        mt={2}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ bgcolor: blue[800] }}
                            onClick={() => handleLogin()}
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="text"
                            component={Link}
                            to={"/register"}
                        >
                            Don't have an account? Register
                        </Button>
                        <Typography
                            component={Link}
                            to="/password/email"
                            variant="subtitle2"
                        >
                            {"Fogot passward?"}
                        </Typography>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
};
export default Login;

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
// import MyImage from "../../../../public/bgpic.jpg";
import { useEffect } from "react";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useState } from "react";
import _ from "lodash";
import { Error } from "../helpers/helpers";
import axios from "axios";
import { useDispatch } from "react-redux";
import API from "../../api/axiosApi";
import { useRegisterMutation } from "../../features/auth/authApi";
import { toast } from "../../features/alert/alertSlice";
import Alert from "../../components/ui/Alert";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading, isError, error, isSuccess }] =
    useRegisterMutation();
  const [state, setState] = useState({
    screenname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const handleRegister = async () => {
    try {
      await register(state).unwrap();
      dispatch(
        toast({
          message: "User Registered!",
          severity: "success",
          show: true,
        })
      );
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error.status === 422) {
        setErrors(error?.data?.errors);
      }
    }
  };
  return (
    <>
      <Alert />
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
              Effortlessly manage your construction projects and resources.
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
              variant="h6"
              component={"h1"}
              sx={{ color: grey[600] }}
              gutterBottom
            >
              Sign Up
            </Typography>
            <TextField
              value={state.screenname}
              onChange={(e) =>
                setState({ ...state, screenname: e.target.value })
              }
              size="small"
              fullWidth
              label="Screen Name"
              margin="dense"
              error={_.has(errors, "screenname")}
              helperText={<Error name="screenname" errors={errors} />}
            />
            <TextField
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              size="small"
              fullWidth
              label="Email"
              margin="dense"
              error={_.has(errors, "email")}
              helperText={<Error name="email" errors={errors} />}
            />
            <TextField
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
              size="small"
              fullWidth
              label="password"
              margin="dense"
              type="password"
              error={_.has(errors, "password")}
              helperText={<Error name="password" errors={errors} />}
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
                onClick={handleRegister}
              >
                Sign up
              </Button>
              <Button variant="text" component={Link} to={"/public/login"}>
                Have an account? Login
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
};
export default Register;

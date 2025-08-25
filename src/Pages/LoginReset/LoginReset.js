import {
    Autocomplete,
    Box,
    Button,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { getFullName } from "../helpers/helpers";
import { Alert } from "../../context/AlertBar/AlertBar";

const LoginReset = () => {
    const [employees, setEmployees] = React.useState([]);
    const { showAlert, setMessage, setSeverity } = React.useContext(Alert);
    const [state, setState] = React.useState({
        employee: { id: "", firstName: "", middleName: "", lastName: "" },
        sig_code: "",
    });
    const [errors, setErrors] = React.useState({});
    const handleSubmit = async () => {
        setErrors({});
        const response = await axios.post(
            route("payroll.resetlogin.store"),
            state
        );
        if (response.status === 203) {
            console.log(response.data.errors);
            setErrors(response.data.errors);
        }
        if (response.status === 200) {
            showAlert(true);
            setMessage("Reset Successful!");
            setSeverity("success");
        }
    };
    const getEmplyee = async () => {
        const response = await axios.get(route("payroll.resetlogin.index"), {
            params: { type: "data" },
        });
        if (response.status === 200) {
            setEmployees(response.data);
        }
    };
    React.useEffect(() => {
        getEmplyee();
    }, []);
    React.useEffect(() => {
        console.log(state);
    }, [state]);
    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Mobile Login Reset
            </Typography>
            <Autocomplete
                options={employees}
                getOptionLabel={(option) =>
                    getFullName(
                        option.firstName,
                        option.middleName,
                        option.lastName
                    )
                }
                value={state.employee}
                onChange={(e, v) => setState({ ...state, employee: v })}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select Employee"
                        margin="dense"
                        error={"employee.id" in errors}
                        helperText={
                            "employee.id" in errors &&
                            errors["employee.id"].map((v) => v)
                        }
                    />
                )}
            />
            <TextField
                label="Enter Your Signatory Code"
                fullWidth
                name="sig_code"
                value={state.sig_code}
                error={"sig_code" in errors}
                helperText={
                    "sig_code" in errors && errors["sig_code"].map((v) => v)
                }
                onChange={(e) =>
                    setState({ ...state, sig_code: e.target.value })
                }
                margin="dense"
            />
            <Typography variant="body1" gutterBottom marginTop={2} color="info">
                By default if an employee login to Time Track app for the first
                time their mobile id or mac-address saves in database, hence the
                Time Track App does not allow the employee to use different
                mobile for login. If an employee lost, reset or Change mobile he
                has to request the Admin for reseting login to be able to login
                using new mobile.
            </Typography>
            <Stack
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
            >
                <Button variant="contained" onClick={handleSubmit}>
                    Submit
                </Button>
            </Stack>
        </Box>
    );
};
export default LoginReset;

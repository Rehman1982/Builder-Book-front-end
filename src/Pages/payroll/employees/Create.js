import {
  Box,
  Divider,
  Stack,
  TextField,
  Typography,
  Button,
  ButtonGroup,
  Autocomplete,
  Avatar,
  IconButton,
  Dialog,
  Tooltip,
  Grid,
} from "@mui/material";
import { amber, grey, lightGreen, pink, red } from "@mui/material/colors";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useContext } from "react";
import { Alert } from "../../../context/AlertBar/AlertBar";
import { useLocation } from "react-router-dom";
import API from "../../../api/axiosApi";
const DefaultState = {
  id: "",
  firstName: "",
  middleName: "",
  lastName: "",
  positionId: { id: "", title: "" },
  scheduleId: { id: "", title: "" },
  mobileNo: "",
  email: "",
  address: "",
  nationality: "",
  cnicNo: "",
  passportNo: "",
  accountNo: "",
  branchCode: "",
  bankName: "",
  ibanNo: "",
  vendorId: { id: "", name: "" },
  user_id: { id: "", user: "" },
  basicPay: "",
  perdayAmount: "",
  leaveDay: "",
  project: { id: "", name: "" },
  officeId: { id: "", name: "" },
};
const steps = ["personal", "bank", "erp", "salary", "project", "office"];
export default function Create() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {
      id: "",
      firstName: "",
      middleName: "",
      lastName: "",
      position: { id: "", title: "" },
      schedule: { id: "", title: "" },
      mobileNo: "",
      email: "",
      address: "",
      nationality: "",
      cnicNo: "",
      passportNo: "",
    },
    bank: { accountNo: "", branchCode: "", bankName: "", ibanNo: "" },
    erp: {
      vendor: { id: "", name: "" },
      user: { id: "", user: "" },
    },
    salary: {
      basicPay: "",
      perdayAmount: "",
      leaveDay: "",
    },
    project: { id: "", name: "" },
    officeId: { id: "", name: "" },
  });
  const location = useLocation();
  const { showAlert, setMessage, setSeverity } = useContext(Alert);
  const [formType, setFormType] = useState("create");
  const [positions, setPositions] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [state, setState] = useState({
    id: "",
    firstName: "",
    middleName: "",
    lastName: "",
    positionId: { id: "", title: "" },
    scheduleId: { id: "", title: "" },
    email: "",
    mobileNo: "",
    address: "",
    nationality: "",
    cnicNo: "",
    passportNo: "",
    accountNo: "",
    branchCode: "",
    bankName: "",
    ibanNo: "",
    vendorId: { id: "", name: "" },
    user_id: { id: "", user: "" },
    basicPay: "",
    perdayAmount: "",
    leaveDay: "",
    project: { id: "", name: "" },
    officeId: { id: "", name: "" },
    status: "",
  });
  const [employeeAllowances, setEmployeeAllowances] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [offices, setOffices] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [liabilityAc, setLiabilityAcs] = useState([]);
  const [allowances, setAllowances] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      let data = { ...state };
      if (employeeAllowances.length > 0)
        data["allowances"] = employeeAllowances;
      if (deductions.length > 0) data["deductions"] = deductions;
      const response = await API.post("payroll.employee.store", data);
      console.log(response);
      if (response.status == 200) {
        setState(DefaultState);
        setErrors({});
        setDeductions([]);
        setEmployeeAllowances([]);
        setMessage("Employee Profile Created!");
        showAlert(true);
      } else if (response.status == 203) {
        console.log(response.data.errors);
        setErrors(response.data.errors);
      }
    } catch (error) {
      setSeverity("error");
      setMessage("Error in API Call");
      showAlert(true);
    }
  };
  const getEmployeeData = async () => {
    const response = await API.get("payroll.employee.edit", {
      params: { employee: location.state.id },
    });
    console.log(response);
    if (response.status == 200) {
      const { data } = response.data;
      const {
        designation,
        schedule,
        vendor_details,
        office_location,
        deductions,
        employee_allowances,
        project,
        user,
      } = data;
      console.log(data);
      setEmployeeAllowances(employee_allowances);
      setDeductions(deductions);
      setState({
        id: data.id,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.LastName,
        positionId: designation,
        scheduleId: schedule,
        email: data.email,
        mobileNo: data.mobileNo,
        address: data.address,
        nationality: data.nationality,
        cnicNo: data.cnicNo,
        passportNo: data.passportNo,
        accountNo: data.accountNo,
        branchCode: data.branchCode,
        bankName: data.bankName,
        ibanNo: data.ibanNo,
        vendorId: vendor_details,
        user_id: user,
        basicPay: data.basicPay,
        perdayAmount: data.perdayAmount,
        leaveDay: data.leaveDay,
        project: project,
        officeId: office_location,
        status: data.status,
      });
    }
  };
  useEffect(() => {
    (async () => {
      try {
        if (location.state && location.state.id) {
          setFormType("update");
          await getEmployeeData();
        }
        const employeeDetails = await API.get("payroll.employee.create", {
          params: { type: "data" },
        });
        if (employeeDetails.status == 200) {
          console.log(employeeDetails.data);
          setProjects(employeeDetails.data.projects);
          setOffices(employeeDetails.data.offices);
          setVendors(employeeDetails.data.vendors);
          setUsers(employeeDetails.data.users);
          setLiabilityAcs(employeeDetails.data.accounts);
          setSchedules(employeeDetails.data.schedules);
          setPositions(employeeDetails.data.positions);
          setAllowances(employeeDetails.data.allowances);
        } else if (employeeDetails.status == 203) {
          setSeverity("error");
          setMessage("Api Error");
          showAlert(true);
        }
      } catch (error) {
        const {
          status,
          data: { message },
        } = error.response;
        if (status == 403) {
          console.log("API Error", error);
          setSeverity("error");
          setMessage(message);
          showAlert(true);
        }
      }
    })();
  }, []);
  return (
    <>
      <Divider>
        <Typography variant="h4">Create Employee Form</Typography>
      </Divider>
      <Box component="form" spacing={3}>
        <Typography variant="h6" gutterBottom>
          Personal Info
        </Typography>
        <TextField
          sx={{
            width: { xs: "100%", md: "40%" },
            borderBlockColor: amber[300],
          }}
          required
          name="firstName"
          value={state.firstName}
          onChange={(e) => setState({ ...state, firstName: e.target.value })}
          label="First Name"
          margin="dense"
          size="small"
          error={"firstName" in errors}
          helperText={"firstName" in errors && errors.firstName.map((v) => v)}
        />
        <TextField
          sx={{ width: { xs: "100%", md: "20%" } }}
          required
          name="middleName"
          value={state.middleName}
          onChange={(e) => setState({ ...state, middleName: e.target.value })}
          label="Middle Name"
          margin="dense"
          size="small"
          error={"middleName" in errors}
          helperText={"middleName" in errors && errors.middleName.map((v) => v)}
        />
        <TextField
          sx={{ width: { xs: "100%", md: "40%" } }}
          required
          name="lastName"
          value={state.lastName}
          onChange={(e) => setState({ ...state, lastName: e.target.value })}
          label="Last Name"
          margin="dense"
          size="small"
          error={"lastName" in errors}
          helperText={"lastName" in errors && errors.lastName.map((v) => v)}
        />
        <TextField
          sx={{ width: "50%" }}
          required
          name="email"
          value={state.email}
          onChange={(e) => setState({ ...state, email: e.target.value })}
          label="Email"
          margin="dense"
          size="small"
          error={"email" in errors}
          helperText={"email" in errors && errors.email.map((v) => v)}
        />
        <TextField
          sx={{ width: "50%" }}
          required
          name="mobileNo"
          value={state.mobileNo}
          onChange={(e) => setState({ ...state, mobileNo: e.target.value })}
          label="Mobile NO"
          margin="dense"
          size="small"
          error={"mobileNo" in errors}
          helperText={"mobileNo" in errors && errors.mobileNo.map((v) => v)}
        />
        <TextField
          sx={{ width: "100%" }}
          required
          name="address"
          value={state.address}
          onChange={(e) => setState({ ...state, address: e.target.value })}
          label="Mailing Address"
          multiline
          rows={5}
          margin="dense"
          size="small"
          error={"address" in errors}
          helperText={"address" in errors && errors.address.map((v) => v)}
        />
        <TextField
          sx={{ width: "33%" }}
          required
          name="nationality"
          value={state.nationality}
          onChange={(e) => setState({ ...state, nationality: e.target.value })}
          label="Nationality"
          margin="dense"
          size="small"
          error={"nationality" in errors}
          helperText={
            "nationality" in errors && errors.nationality.map((v) => v)
          }
        />
        <TextField
          sx={{ width: "33%" }}
          required
          name="cnicNo"
          value={state.cnicNo}
          onChange={(e) => setState({ ...state, cnicNo: e.target.value })}
          label="CNIC#"
          margin="dense"
          size="small"
          error={"cnicNo" in errors}
          helperText={"cnicNo" in errors && errors.cnicNo.map((v) => v)}
        />
        <TextField
          sx={{ width: "34%" }}
          name="passportNo"
          value={state.passport}
          onChange={(e) => setState({ ...state, passport: e.target.value })}
          label="Passport # (For Foreigners)"
          margin="dense"
          size="small"
          error={"passport" in errors}
          helperText={"passport" in errors && errors.passport.map((v) => v)}
        />
        <Typography variant="h6" gutterBottom>
          Bank Info
        </Typography>
        <TextField
          sx={{ width: "50%" }}
          required
          name="accountNo"
          value={state.accountNo}
          onChange={(e) => setState({ ...state, accountNo: e.target.value })}
          label="Bank Account #"
          margin="dense"
          size="small"
          error={"accountNo" in errors}
          helperText={"accountNo" in errors && errors.accountNo.map((v) => v)}
        />
        <TextField
          sx={{ width: "50%" }}
          required
          name="branchCode"
          value={state.branchCode}
          onChange={(e) => setState({ ...state, branchCode: e.target.value })}
          label="Branch Code"
          margin="dense"
          size="small"
          error={"branchCode" in errors}
          helperText={"branchCode" in errors && errors.branchCode.map((v) => v)}
        />
        <TextField
          sx={{ width: "100%" }}
          required
          name="bankName"
          value={state.bankName}
          onChange={(e) => setState({ ...state, bankName: e.target.value })}
          label="Bank Name"
          margin="dense"
          multiline
          rows={2}
          size="small"
          error={"bankName" in errors}
          helperText={"bankName" in errors && errors.bankName.map((v) => v)}
        />
        <TextField
          sx={{ width: "100%" }}
          name="ibanNo"
          value={state.ibanNo}
          onChange={(e) => setState({ ...state, ibanNo: e.target.value })}
          label="IBAN #"
          margin="dense"
          size="small"
          error={"ibanNo" in errors}
          helperText={"ibanNo" in errors && errors.ibanNo.map((v) => v)}
        />
        <Typography variant="h6" gutterBottom>
          ERP Info
        </Typography>
        <Autocomplete
          options={positions}
          getOptionLabel={(option) => option.title}
          value={state.positionId}
          onChange={(event, value) => {
            setState({ ...state, positionId: value });
          }}
          renderInput={(params) => (
            <TextField
              required
              {...params}
              label="Position"
              size="small"
              margin="dense"
              error={"positionId.id" in errors}
              helperText={
                "positionId.id" in errors &&
                errors["positionId.id"].map((v) => v)
              }
            />
          )}
        />
        <Autocomplete
          options={schedules}
          getOptionLabel={(option) => option.title}
          value={state.scheduleId}
          onChange={(event, value) => {
            setState({ ...state, scheduleId: value });
          }}
          renderInput={(params) => (
            <TextField
              required
              {...params}
              label="Schedule"
              size="small"
              margin="dense"
              error={"scheduleId.id" in errors}
              helperText={
                "scheduleId.id" in errors &&
                errors["scheduleId.id"].map((v) => v)
              }
            />
          )}
        />
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12} md={6}>
            <Autocomplete
              options={vendors}
              getOptionLabel={(option) => option.name}
              value={state.vendorId}
              onChange={(e, v) => setState({ ...state, vendorId: v })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="Vendor Id"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Autocomplete
              options={users}
              getOptionLabel={(option) => option.user}
              value={state.user_id}
              onChange={(e, v) => setState({ ...state, user_id: v })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label="User Name"
                  size="small"
                />
              )}
            />
          </Grid>
        </Grid>
        <Stack direction="row">
          <Autocomplete
            sx={{ width: "33%" }}
            options={projects}
            value={state.project}
            onChange={(e, v) =>
              setState({
                ...state,
                project: { id: v.id, name: v.name },
              })
            }
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Attach Salary with"
                margin="dense"
                size="small"
                error={"project.id" in errors}
                helperText={
                  "project.id" in errors && errors["project.id"].map((v) => v)
                }
              />
            )}
          />
          <Autocomplete
            sx={{ width: "33%" }}
            options={offices}
            value={state.officeId}
            onChange={(e, v) =>
              setState({
                ...state,
                officeId: { id: v.id, name: v.name },
              })
            }
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Duty Office"
                margin="dense"
                size="small"
                error={"officeId.id" in errors}
                helperText={
                  "officeId.id" in errors && errors["officeId.id"].map((v) => v)
                }
              />
            )}
          />
          <Autocomplete
            sx={{ width: "34%" }}
            options={["active", "deactive"]}
            value={state.status}
            onChange={(e, v) =>
              setState({
                ...state,
                status: v,
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                margin="dense"
                label="Status"
              />
            )}
          />
        </Stack>
        <Typography variant="h6" gutterBottom>
          Salary Info
        </Typography>
        <Stack direction="row">
          <TextField
            sx={{ width: "33%" }}
            required
            name="basicPay"
            value={state.basicPay}
            onChange={(e) => setState({ ...state, basicPay: e.target.value })}
            label="Basic Pay / Per Month"
            margin="dense"
            size="small"
            error={"basicPay" in errors}
            helperText={"basicPay" in errors && errors.basicPay.map((v) => v)}
          />
          <TextField
            sx={{ width: "33%" }}
            required
            name="perdayAmount"
            value={state.perdayAmount}
            onChange={(e) =>
              setState({ ...state, perdayAmount: e.target.value })
            }
            label="Per Day Amount"
            margin="dense"
            size="small"
            error={"perdayAmount" in errors}
            helperText={
              "perdayAmount" in errors && errors.perdayAmount.map((v) => v)
            }
          />
          <Autocomplete
            sx={{ width: "34%" }}
            required
            name="leaveDay"
            value={state.leaveDay}
            onChange={(e, v) => setState({ ...state, leaveDay: v })}
            size="small"
            options={[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ]}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Off Day"
                margin="dense"
                error={"leaveDay" in errors}
                helperText={
                  "leaveDay" in errors && errors.leaveDay.map((v) => v)
                }
              />
            )}
          />
        </Stack>
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <AllowanceForm
              employeeAllowances={employeeAllowances}
              setEmployeeAllowances={setEmployeeAllowances}
              allowances={allowances}
              errors={errors}
            />
          </Grid>
          <Grid item sm={12} md={6}>
            <DeductionForm
              deductions={deductions}
              setDeductions={setDeductions}
              liabilityAc={liabilityAc}
              errors={errors}
            />
          </Grid>
        </Grid>
        <Divider />
      </Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ my: 1 }}>
        <ButtonGroup>
          {formType == "create" ? (
            <Button onClick={handleSubmit}>Save</Button>
          ) : (
            <Button onClick={handleSubmit}>Update</Button>
          )}
          <Button>Reset</Button>
        </ButtonGroup>
      </Stack>
    </>
  );
}
const DeductionForm = ({ deductions, setDeductions, liabilityAc }) => {
  const [delId, setDelId] = useState("");
  const handleChange = (e, i) => {
    console.log(e.target.value, i);
    let a = [...deductions];
    a[i][e.target.name] = e.target.value;
    setDeductions(a);
  };
  return (
    <Box>
      <DeductionDelete data={delId} setData={setDeductions} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Deductions/Per Month</Typography>
        <Tooltip title="Add Deductions">
          <IconButton
            onClick={() =>
              setDeductions(
                deductions.concat({
                  id: "",
                  title: "",
                  amount: "",
                  account: null,
                })
              )
            }
          >
            <Avatar sx={{ backgroundColor: pink[200] }}>
              <AddIcon />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Stack>
      {deductions.map((v, i) => {
        return (
          <Grid key={v.id} container spacing={1} alignItems="center">
            <Grid item xs={12} md={1}>
              <Avatar>{i + 1}</Avatar>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                size="small"
                label="Title"
                name="title"
                value={v.title}
                onChange={(e) => handleChange(e, i)}
                fullWidth
                margin="dense"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                options={liabilityAc}
                getOptionLabel={(option) => option.acctname}
                value={v.account}
                onChange={(e, v) => {
                  setDeductions((prv) => {
                    let a = [...prv];
                    a[i]["account"] = v;
                    return a;
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="dense"
                    label="Account"
                    size="small"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Amount"
                name="amount"
                margin="dense"
                value={v.amount}
                onChange={(e) => handleChange(e, i)}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <Avatar component={IconButton} onClick={() => setDelId(v.id)}>
                <DeleteIcon color="error" />
              </Avatar>
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};
const AllowanceForm = ({
  employeeAllowances,
  setEmployeeAllowances,
  errors,
  allowances,
}) => {
  const [delId, setDelId] = useState();
  const addAllowance = () => {
    setEmployeeAllowances(
      employeeAllowances.concat({ id: null, allowance: null, amount: 0 })
    );
  };
  const handleChange = (event, value, i) => {
    setEmployeeAllowances((prv) => {
      let a = [...prv];
      a[i].allowance = value;
      return a;
    });
  };
  const handleChange1 = (e, i) => {
    setEmployeeAllowances((prv) => {
      let a = [...prv];
      a[i].amount = e.target.value;
      return a;
    });
  };
  return (
    <Box>
      <AllowanceDelete data={delId} setData={setEmployeeAllowances} />
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Allowances</Typography>
        <Tooltip title="Add Allowances">
          <IconButton onClick={addAllowance}>
            <Avatar sx={{ backgroundColor: lightGreen[500] }}>
              <AddIcon />
            </Avatar>
          </IconButton>
        </Tooltip>
      </Stack>
      {employeeAllowances.map((v, i) => {
        return (
          <Grid key={v.id} container spacing={1} alignItems="center">
            <Grid item xs={12} md={1}>
              <Avatar>{i + 1}</Avatar>
            </Grid>
            <Grid item xs={12} md={5}>
              <Autocomplete
                fullWidth
                options={allowances}
                value={v.allowance}
                getOptionLabel={(option) => option.title}
                onChange={(event, value) => handleChange(event, value, i)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    margin="dense"
                    label="allowance"
                    error={`allowances.${i}.allowance.id` in errors}
                    helperText={
                      `allowances.${i}.allowance.id` in errors &&
                      errors[`allowances.${i}.allowance.id`].map((v) => v)
                    }
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                name="amount"
                value={v.amount}
                onChange={(e) => handleChange1(e, i)}
                size="small"
                margin="dense"
                label="Amount"
                fullWidth
                error={`allowances.${i}.amount` in errors}
                helperText={
                  `allowances.${i}.amount` in errors &&
                  errors[`allowances.${i}.amount`].map((v) => v)
                }
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <IconButton onClick={() => setDelId(v.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};

const AllowanceDelete = ({ data, setData }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const { setMessage, showAlert, setSeverity } = useContext(Alert);
  const handleSubmit = async () => {
    setErrors({});
    const response = await API.delete(
      "payroll.employee_allowance.destroy",
      {
        params: {
          employee_allowance: 1,
        },
      },
      { params: { id: data, code: code } }
    );
    // console.log(response);
    if (response.status == 200) {
      refresh();
      setCode("");
      setOpen(false);
      setErrors({});
      setMessage("Success");
      setSeverity("success");
      showAlert(true);
    } else if (response.status == 203) {
      setErrors(response.data.errors);
    }
  };
  const refresh = () => {
    setData((prv) => {
      let a = [...prv];
      const b = a.filter((v) => v.id !== data);
      console.log("refresh", b, data);
      return b;
    });
  };
  useEffect(() => {
    if (data) {
      setOpen(true);
    }
  }, [data]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Are your sure to proceed further?
        </Typography>
        <TextField
          fullWidth
          label="Signatory Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          variant="outlined"
          margin="dense"
          error={"code" in errors}
          helperText={
            "code" in errors &&
            errors.code.length > 0 &&
            errors.code.map((v) => v)
          }
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Dialog>
  );
};
const DeductionDelete = ({ data, setData }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const { setMessage, showAlert, setSeverity } = useContext(Alert);
  const handleSubmit = async () => {
    setErrors({});
    const response = await API.delete(
      "payroll.deduction.destroy",
      { params: { deduction: 1 } },
      { params: { id: data, code: code } }
    );
    // console.log(response);
    if (response.status == 200) {
      refresh();
      setCode("");
      setOpen(false);
      setErrors({});
      setMessage("Success");
      setSeverity("success");
      showAlert(true);
    } else if (response.status == 203) {
      setErrors(response.data.errors);
    }
  };
  const refresh = () => {
    setData((prv) => {
      let a = [...prv];
      const b = a.filter((v) => v.id !== data);
      console.log("refresh", b, data);
      return b;
    });
  };
  useEffect(() => {
    if (data) {
      setOpen(true);
    }
  }, [data]);
  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h5" gutterBottom>
          Are your sure to proceed further?
        </Typography>
        <TextField
          fullWidth
          label="Signatory Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          variant="outlined"
          margin="dense"
          error={"code" in errors}
          helperText={
            "code" in errors &&
            errors.code.length > 0 &&
            errors.code.map((v) => v)
          }
        />
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Dialog>
  );
};

const getStepContent = (step) => {
  switch (step) {
    case 0:
      return <Box>"Personal Information"</Box>;
    case 1:
      return <Box>"Bank Information"</Box>;
    case 2:
      return <Box>"ERP Information"</Box>;
    case 3:
      return <Box>"Salary Information"</Box>;
    case 4:
      return <Box>"Project Information"</Box>;
    case 5:
      return <Box>"Office Information"</Box>;
    default:
      return <Box>"Unknown step"</Box>;
  }
};
const handleNext = () => {
  setActiveStep((prevActiveStep) => prevActiveStep + 1);
};
const handleBack = () => {
  setActiveStep((prevActiveStep) => prevActiveStep - 1);
};
const handleReset = () => {
  setActiveStep(0);
};
const handleStep = (step) => () => {
  setActiveStep(step);
};
const handleFinish = () => {
  console.log("Finish");
};
const handleCancel = () => {
  console.log("Cancel");
};

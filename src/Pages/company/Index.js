import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Company from "./Company";
import { useRef } from "react";
import axios from "axios";
import { useEffect } from "react";
import { blue } from "@mui/material/colors";
import _ from "lodash";
import { Error } from "../helpers/helpers";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import {
  useActivateCompanyMutation,
  useAllCompaniesQuery,
  useUserResponceMutation,
} from "../../features/companies/companyApi";
import {
  setCompanies,
  setSelectedCompany,
} from "../../features/companies/companySlice";

const Companies = () => {
  const dispatch = useDispatch();
  const { companies, selectedCompany, variant } = useSelector(
    (state) => state.companySlice
  );
  const { data, isLoading, isSuccess, isError, error } = useAllCompaniesQuery({
    type: "data",
  });
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
      dispatch(setCompanies(data));
    }
    if (isError) {
      console.log(error);
    }
    // getCompanies();
  }, [data]);
  return (
    <Box>
      <Tabs
        value={tabIndex}
        onChange={(e, newVal) => setTabIndex(newVal)}
        variant="fullWidth"
      >
        <Tab label="Associated" />
        <Tab label="Owned" />
      </Tabs>
      <Divider sx={{ mb: 2 }} />
      {tabIndex === 0 && <Associated />}
      {tabIndex === 1 && <OwnedCompaines />}
    </Box>
  );
};

export default Companies;

const Associated = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.companySlice);
  const [activateCompany, { data, isLoading, isSuccess, isError, error }] =
    useActivateCompanyMutation();
  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);
  return (
    <List>
      {companies?.associated?.map((company) => (
        <ListItem
          key={company.id}
          component={Paper}
          elevation={3}
          sx={{ mb: 0.5 }}
        >
          <ListItemAvatar>
            <Avatar />
          </ListItemAvatar>
          <ListItemText
            primary={company.company_name}
            secondary={
              company.user_response === "pending" &&
              `${company.company_name} added you, what is your decision? `
            }
          />

          {company.user_response === "pending" && (
            <ButtonGroup>
              <AcceptButton company={company} />
              <Button>Deny</Button>
            </ButtonGroup>
          )}
          {company.user_response == "accepted" && (
            <Button onClick={() => activateCompany({ company: company.id })}>
              Active
            </Button>
          )}
          {company.user_response == "rejected" && "You have Rejected "}
          {company.user_response == "suspended" && "Suspended"}
        </ListItem>
      ))}
    </List>
  );
};

const OwnedCompaines = () => {
  const dispatch = useDispatch();
  const { companies, selectedCompany } = useSelector(
    (state) => state.companySlice
  );
  const [activateCompany, { data, isLoading, isSuccess, isError, error }] =
    useActivateCompanyMutation();
  const companyRef = useRef();
  const [variant, setVariant] = useState("view");
  useEffect(() => {
    if (isSuccess) {
      window.location.reload();
    }
  }, [isSuccess]);
  return (
    <Box>
      <Company ref={companyRef} />
      <Stack
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <IconButton
          onClick={() => {
            setVariant("create");
            companyRef.current.open();
            setSelectedCompany({});
          }}
          sx={{ border: 2, borderColor: blue[900] }}
          children={<Icon children="add_cricle" />}
        />
      </Stack>
      <List>
        {companies?.owned?.map((company) => (
          <ListItem
            key={company.id}
            component={Paper}
            elevation={3}
            sx={{ mb: 0.5 }}
          >
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemButton
              onClick={() => {
                dispatch(setSelectedCompany(company));
                setVariant("view");
                companyRef.current.open();
              }}
            >
              <ListItemText primary={company.company_name} />
            </ListItemButton>
            {/* <AddUser company={company.id} /> */}
            <Button component={Link} to={"/public/management/users"}>
              Add Users
            </Button>
            <Button onClick={() => activateCompany({ company: company.id })}>
              Activate
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

const AcceptButton = () => {
  const { selectedCompany: company } = useSelector(
    (state) => state.companySlice
  );
  const [userResponce, { isLoading, isSuccess, isError, error }] =
    useUserResponceMutation();
  const [code, setCode] = useState(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});
  return (
    <>
      <Button onClick={() => setOpen(true)}>Accept</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Accept</DialogTitle>
        <DialogContent>
          <TextField
            label="Signatory Code"
            name="code"
            value={code || ""}
            onChange={(e) => setCode(e.target.value)}
            margin="dense"
            error={_.has(errors, "code")}
            helperText={<Error name="code" errors={errors} />}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => userResponce({ company: company.id })}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const AddUser = ({ company }) => {
  const [open, setOpen] = useState(false);
  const [emailAddres, setEmailAddress] = useState("");
  const [errors, setErrors] = useState({});
  const handleAdd = async () => {
    try {
      const result = await API.post("company/adduser", {
        email: emailAddres,
        company: company,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Add User</Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add user to your company</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email Address"
            name="Email"
            value={emailAddres}
            onChange={(e) => setEmailAddress(e.target.value)}
            margin="dense"
            error={_.has(errors, "Email")}
            helperText={<Error errors={errors} name="Email" />}
          />
          <Button fullWidth variant="contained" onClick={handleAdd}>
            Add User in Company
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

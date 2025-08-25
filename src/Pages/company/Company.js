import {
  Tabs,
  Tab,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Icon,
} from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import BasicInfo from "./BasicInfo";
import Address from "./Address";
import Contact from "./Contact";
import Meta from "./Meta";
import BankInfo from "./Bankinfo";
import { useEffect } from "react";
import axios from "axios";
import { Container } from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { setVariant } from "../../features/companies/companySlice";

const Company = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { selectedCompany, variant } = useSelector(
    (state) => state.companySlice
  );
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));
  const [open, setOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [state, setState] = useState({});
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const handdleSave = async () => {
    // try {
    //   const result = await axios.post(route("company.store"), state);
    //   console.log(result);
    //   if (result.status === 200) {
    //     setState({});
    //     setOpen(false);
    //     refresh();
    //   }
    //   if (result.status == 203) {
    //     setErrors(result.data);
    //   }
    // } catch (error) {
    //   console.log(error.response);
    // }
  };
  useEffect(() => {
    setState(selectedCompany);
  }, [selectedCompany]);
  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(setVariant("view"));
        setOpen(false);
      }}
      fullWidth
    >
      <DialogTitle>{state?.company_name}</DialogTitle>
      <DialogContent>
        <Grid
          container
          direction={"row"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
        >
          <Grid item xs={1}>
            <IconButton
              disabled={tabIndex === 0 ? true : false}
              onClick={() => setTabIndex((prv) => prv - 1)}
            >
              <Icon sx={{ fontSize: "2rem" }}>arrow_back_ios</Icon>
            </IconButton>
          </Grid>
          <Grid item xs={10}>
            <Tabs
              value={tabIndex}
              onChange={(e, newVal) => setTabIndex(newVal)}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              <Tab label="Basic Info" />
              <Tab label="Contact Person" />
              <Tab label="Address" />
              <Tab label="Bank Info" />
              <Tab label="Meta Info" />
            </Tabs>
            {tabIndex === 0 && (
              <BasicInfo
                variant={variant}
                data={state}
                handleChange={handleChange}
                errors={errors}
              />
            )}
            {tabIndex === 1 && (
              <Address
                variant={variant}
                data={state}
                handleChange={handleChange}
                errors={errors}
              />
            )}
            {tabIndex === 2 && (
              <Contact
                variant={variant}
                data={state}
                handleChange={handleChange}
                errors={errors}
              />
            )}
            {tabIndex === 3 && (
              <BankInfo
                variant={variant}
                data={state}
                handleChange={handleChange}
                errors={errors}
              />
            )}
            {tabIndex === 4 && (
              <Meta
                variant={variant}
                data={state}
                handleChange={handleChange}
                errors={errors}
              />
            )}
          </Grid>
          <Grid item xs={1}>
            <IconButton
              disabled={tabIndex === 4 ? true : false}
              onClick={() => setTabIndex((prv) => prv + 1)}
            >
              <Icon sx={{ fontSize: "2rem" }}>arrow_forward_ios</Icon>
            </IconButton>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {variant == "view" && (
          <Button
            onClick={() => dispatch(setVariant("edit"))}
            variant="contained"
            children="Edit"
          />
        )}
        {variant !== "view" && (
          <Button onClick={handdleSave} variant="contained" children="Save" />
        )}
      </DialogActions>
    </Dialog>
  );
});

export default Company;

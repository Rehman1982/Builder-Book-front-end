import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Paper,
  Dialog,
  DialogContent,
  Autocomplete,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  CircularProgress,
  Icon,
} from "@mui/material";
import API from "../../api/axiosApi";
import _, { set } from "lodash";
import { blue, grey, orange, yellow } from "@mui/material/colors";

const Create = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: handleClose,
  }));
  const [steps, setSteps] = useState([
    { id: "project", label: "Select Project" },
    { id: "vendor", label: "Select Vendor" },
    { id: "po", label: "Select PO" },
    { id: "", label: "Create Bill" },
  ]);
  // State management for the dialog and form steps
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setFormData({
      project: null,
      vendor: null,
      po: null,
      bill_desp: "",
      bill_details: null,
    });
    setActiveStep(0);
    setOpen(false);
  };
  const handleOpen = () => setOpen(true);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    project: null,
    vendor: null,
    po: null,
    bill_desp: "",
    bill_details: null,
  });
  const [errors, setErrors] = useState({});
  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const result = await API.post("transactions/creditBills", formData);
      if (result.status == 200) {
        setFormData({
          project: {},
          vendor: {},
          po: {},
          bill_desp: "",
          bill_details: null,
        });
        setOpen(false);
        props.setActiveTab(2);
      }
      if (result.status === 203) {
        setErrors(result.data);
      }
      console.log("Subitttttttttttttttttt", result);
    } catch (error) {
      console.log("submitttt Errrooooooooorrr", error);
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <SelectProject
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNext}
            setSteps={setSteps}
          />
        );
      case 1:
        return (
          <SelectVendor
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNext}
            setSteps={setSteps}
          />
        );
      case 2:
        return (
          <SelectPOs
            formData={formData}
            setFormData={setFormData}
            handleNext={handleNext}
            setSteps={setSteps}
          />
        );
      case 3:
        return (
          <GenerateBill
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            setSteps={setSteps}
            errors={errors}
          />
        );
      default:
        return "Unknown Step";
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogContent>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((step) => (
            <Step key={step.id}>
              <StepLabel>{formData[step.id]?.name || step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>{getStepContent(activeStep)}</Box>

        <Box mt={3} display="flex" justifyContent="space-between">
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
});

export default Create;

const SelectProject = ({ formData, setFormData, handleNext, setSteps }) => {
  const [projects, setProjects] = useState([]);
  const fetchProjects = async () => {
    try {
      // Replace with your API call to fetch projects
      const response = await API.get("transactions/creditBills/create");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  // Fetch projects from API or use static data
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <Autocomplete
      options={projects}
      getOptionLabel={(option) => option.name || ""}
      value={formData.project || null}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Project"
          fullWidth
          margin="normal"
        />
      )}
      onChange={(event, newValue) => {
        setFormData({
          ...formData,
          project: newValue || null,
        });
        handleNext();
      }}
    />
  );
};
const SelectVendor = ({ formData, setFormData, handleNext }) => {
  const [vendors, setPos] = useState([]);
  const fetchVendors = async () => {
    try {
      // Replace with your API call to fetch projects
      const response = await API.post("transactions/getDataforCRBill", {
        project_id: formData?.project?.id,
      });
      setPos(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  // Fetch projects from API or use static data
  useEffect(() => {
    if (formData.project) fetchVendors();
  }, []);
  return (
    <Autocomplete
      options={vendors}
      getOptionLabel={(option) => option.name || ""}
      value={formData.vendor || null}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Vendor"
          fullWidth
          margin="normal"
        />
      )}
      onChange={(event, newValue) => {
        setFormData({
          ...formData,
          vendor: newValue || "",
        });
        handleNext();
      }}
    />
  );
};
const SelectPOs = ({ formData, setFormData, handleNext }) => {
  const [pos, setPos] = useState([]);
  const fetchPOs = async () => {
    try {
      // Replace with your API call to fetch projects
      const response = await API.post("transactions/getDataforCRBill", {
        project_id: formData.project?.id,
        vendor_id: formData.vendor?.id,
      });
      console.log(response);
      setPos(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  // Fetch projects from API or use static data
  useEffect(() => {
    if (formData.vendor) fetchPOs();
  }, []);
  return (
    <Box sx={{ maxHeight: 500, overflow: "auto" }}>
      <List>
        {pos?.map((po) => (
          <Paper key={po.id} elevation={3} sx={{ m: 1 }}>
            <ListItem>
              <ListItemText
                primary={"PO Number: " + po.id}
                secondary={po.desp}
              />
              <Button
                onClick={() => {
                  setFormData({ ...formData, po: po });
                  handleNext();
                }}
                variant="outlined"
              >
                Create Bill
              </Button>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};
const GenerateBill = ({ formData, setFormData, errors }) => {
  const [state, setState] = useState([]);
  const getData = async () => {
    try {
      const response = await API.post("transactions/getDataforCRBill", {
        project_id: formData.project?.id,
        vendor_id: formData.vendor?.id,
        po_id: formData.po?.id,
      });
      console.log("data------------------------------------", response);
      const data = response?.data?.map((item) => {
        item.this_bill_qty = "";
        return item;
      });
      setFormData({ ...formData, bill_details: data });
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };
  // Fetch projects from API or use static data
  useEffect(() => {
    if (formData.po) getData();
  }, []);
  return (
    <Box>
      <TextField
        fullWidth
        label="Bill Description"
        name="bill_desp"
        required
        onChange={(e) =>
          setFormData({ ...formData, bill_desp: e.target.value })
        }
        margin="dense"
      />
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell></TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Received</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>This Bill</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formData?.bill_details?.map((item, index) => (
              <React.Fragment key={item.po_details_id}>
                {/* Main Data Row */}
                <TableRow>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell>{item.Final_rate}</TableCell>
                  <TableCell>
                    <Grid container direction="column">
                      <Typography variant="body2" sx={{ color: orange[400] }}>
                        Qty
                      </Typography>
                      <Typography variant="body2">Amount</Typography>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container direction="column">
                      <Typography variant="body2" sx={{ color: orange[400] }}>
                        {item.PO_qty}
                      </Typography>
                      <Typography variant="body2">
                        {_.round(item.PO_qty * item.Final_rate)}
                      </Typography>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container direction="column">
                      <Typography variant="body2" sx={{ color: orange[400] }}>
                        {item.received_qty}
                      </Typography>
                      <Typography variant="body2">
                        {_.round(item.received_qty * item.Final_rate)}
                      </Typography>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container direction="column">
                      <Typography variant="body2" sx={{ color: orange[400] }}>
                        {item.PO_qty - item.received_qty}
                      </Typography>
                      <Typography variant="body2">
                        {_.round(
                          (item.PO_qty - item.received_qty) * item.Final_rate
                        )}
                      </Typography>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container direction="column">
                      <ThisBill
                        formData={formData}
                        setFormData={setFormData}
                        index={index}
                      />

                      {/* <Typography variant="body2">
                                                100
                                            </Typography>
                                            <Typography variant="body2">
                                                1000
                                            </Typography> */}
                    </Grid>
                  </TableCell>
                </TableRow>
                {/* Full Row Description */}
                <TableRow>
                  <TableCell colSpan={7}>
                    <Box
                      sx={{
                        p: 1,
                        bgcolor: "#f9f9f9",
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={7} sx={{ bgcolor: yellow[200] }} />
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const ThisBill = ({ index, formData, setFormData }) => {
  const billDetail = formData?.bill_details?.[index];
  const [availableQty, setAvailableQty] = useState(0);
  const [open, setOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "this_bill_qty" && value > availableQty) {
      alert("Quantity Exceeded");
      return;
    }
    setFormData((prv) => {
      let update = { ...prv };
      update.bill_details[index][name] = value;
      return update;
    });
  };
  useEffect(() => {
    if (billDetail?.PO_qty && billDetail?.received_qty !== undefined) {
      setAvailableQty(billDetail.PO_qty - billDetail.received_qty);
    }
  }, [formData]);
  return (
    <>
      {availableQty === 0 ? (
        <Typography>Full Paid</Typography>
      ) : (
        <Typography
          sx={{
            cursor: "pointer",
            color: blue[500],
            ":hover": { bgcolor: grey[200] },
          }}
          variant="body2"
          onClick={() => setOpen(true)}
        >
          {billDetail?.this_bill_qty || "This Bill"}
        </Typography>
      )}
      {billDetail?.this_bill_qty && (
        <Typography variant="body2">
          {_.round(billDetail?.this_bill_qty * billDetail["Final_rate"])}
        </Typography>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <TextField
            required
            fullWidth
            name="this_bill_qty"
            label="Quantity"
            value={billDetail?.this_bill_qty || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            name="description"
            value={billDetail?.description || ""}
            onChange={handleChange}
            margin="dense"
            label="Description"
          />

          <Button
            sx={{ mt: 1 }}
            onClick={() => setOpen(false)}
            variant="contained"
          >
            Update
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

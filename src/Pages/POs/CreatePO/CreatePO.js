import {
    Autocomplete,
    Box,
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    Icon,
    IconButton,
    Paper,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import API from "../../../api/axiosApi";
import _ from "lodash";
import POHead from "./POHead";
import PODetails from "./PODetails";
import PODeductions from "./PODeductions";
const steps = ["PO", "Details", "Deductions", "Submit"];

const CreatePO = forwardRef(({ Variant, PoId }, ref) => {
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));
    const [stopNext, setStopNext] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const [selects, setSelects] = useState(null);
    const [po, setPo] = useState({});
    const [details, setDetails] = useState([]);
    const [deductions, setDeductions] = useState([]);
    const [totals, setTotals] = useState({ poTotal: 0, ddTotals: 0 });
    const hanldeClose = () => {
        setOpen(false);
        setPo({});
        setDetails([]);
        setDeductions([]);
        setTotals({ poTotal: 0, ddTotals: 0 });
    };
    const getData = async () => {
        try {
            const res = await API.get(route("PO.create"));
            console.log(res);
            if (res.status == 200) {
                setSelects(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const hanldeNext = (currentStep) => {
        if (currentStep === steps.length - 1) {
            return true;
        }
        if (steps[currentStep] === "PO") {
            if (!po.project || !po.vendor || !po.expiry_date) {
                return true;
            }
        }
        if (steps[currentStep] === "Details") {
            if (totals.poTotal === 0) {
                return true;
            }
        }
        return false;
    };
    const handleSubmit = async () => {
        alert("form Submitted");
        try {
            const res = await API.post(route("PO.store"), {
                po,
                details,
                deductions,
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };
    const dataForEdit = async (id) => {
        console.log("edit Called");
        try {
            const res = await API.get(route("PO.edit", { PO: 1 }), {
                params: {
                    po_id: id,
                },
            });
            if (res.status === 200) {
                setPo(res.data.po);
                setDetails(res.data.details);
                setDeductions(res.data.deductions);
                setActiveStep(0);
            }
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (Variant === "edit") {
            dataForEdit(PoId);
        }
    }, [Variant, PoId]);
    useEffect(() => {
        const detailsTotal = _.sumBy(details, (d) =>
            Number(d.qty * d.finalRate)
        );
        const ddTotal = _.sumBy(deductions, (d) =>
            Number((d.rate * detailsTotal) / 100)
        );
        console.log("totals", detailsTotal, ddTotal);
        setTotals({ poTotal: detailsTotal, ddTotals: ddTotal });
    }, [details, deductions]);
    useEffect(() => {
        getData();
    }, []);
    return (
        <Dialog open={open} onClose={hanldeClose} maxWidth="md" fullWidth>
            <DialogContent p={2}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box>
                    <StepContent
                        step={activeStep}
                        selects={selects}
                        po={po}
                        setPo={setPo}
                        details={details}
                        setDetails={setDetails}
                        deductions={deductions}
                        setDeductions={setDeductions}
                        totals={totals}
                        setTotals={setTotals}
                        handleSubmit={handleSubmit}
                    />
                </Box>
                <NavigationButtons
                    activeStep={activeStep}
                    setActiveStep={setActiveStep}
                    stopNext={stopNext}
                    hanldeNext={hanldeNext}
                />
            </DialogContent>
        </Dialog>
    );
});

export default CreatePO;

const NavigationButtons = ({
    activeStep,
    setActiveStep,
    stopNext,
    hanldeNext,
}) => {
    return (
        <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mt={2}
        >
            <IconButton
                disabled={activeStep === 0 ? true : false}
                onClick={() => setActiveStep(activeStep - 1)}
            >
                <Icon>arrow_back_ios_new</Icon>
            </IconButton>
            <IconButton
                disabled={hanldeNext(activeStep)}
                onClick={() => setActiveStep(activeStep + 1)}
            >
                <Icon>arrow_forward_ios</Icon>
            </IconButton>
        </Stack>
    );
};
const StepContent = ({
    step,
    selects,
    po,
    setPo,
    details,
    setDetails,
    deductions,
    setDeductions,
    totals,
    setTotals,
    handleSubmit,
}) => {
    switch (step) {
        case 0:
            return <POHead selects={selects} po={po} setPo={setPo} />;
            break;
        case 1:
            return (
                <PODetails
                    details={details}
                    setDetails={setDetails}
                    items={selects?.items}
                    totals={totals}
                    setTotals={setTotals}
                />
            );
            break;
        case 2:
            return (
                <PODeductions
                    dds={selects?.deductions}
                    deductions={deductions}
                    setDeductions={setDeductions}
                    details={details}
                    totals={totals}
                    setTotals={setTotals}
                />
            );
            break;
        case 3:
            return <SubmitForm totals={totals} handleSubmit={handleSubmit} />;
            break;
    }
};
const SubmitForm = ({ totals, handleSubmit }) => {
    return (
        <Box>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                py={1}
                px={2}
                component={Paper}
                elevation={3}
                my={1}
                borderRadius={1}
            >
                <Typography variant="body2">TOTAL PO Amount</Typography>
                <Typography variant="body2">{totals.poTotal}</Typography>
            </Stack>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                py={1}
                px={2}
                component={Paper}
                elevation={3}
                mb={1}
                borderRadius={1}
            >
                <Typography variant="body2">DEDUCTIONS</Typography>
                <Typography variant="body2">{totals.ddTotals}</Typography>
            </Stack>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                py={1}
                px={2}
                component={Paper}
                elevation={3}
                mb={1}
                borderRadius={1}
            >
                <Typography variant="body2">NET PO AMOUNT</Typography>
                <Typography variant="body2">
                    {totals.poTotal - totals.ddTotals}
                </Typography>
            </Stack>
            <TextField
                label="Signatory Code"
                fullWidth
                margin="dense"
                size="small"
            />
            <Button onClick={handleSubmit} variant="contained">
                Submit
            </Button>
        </Box>
    );
};

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    Icon,
    IconButton,
    Paper,
    Stack,
    Step,
    StepLabel,
    Stepper,
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
import {
    useCreatePOMutation,
    useUpdatePOMutation,
    useEditPOMutation,
} from "../../../features/purchseOrders/poApi";
import { useDispatch, useSelector } from "react-redux";
import { resetCreatePo } from "../../../features/purchseOrders/poSlice";
const steps = ["PO", "Details", "Deductions", "Submit"];

const CreatePO = forwardRef(({ Variant, PoId }, ref) => {
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));
    const currentPo = useSelector((state) => state.purchaseOrder.selectedPoId);
    const [editPO, { isLoading: eloading, isErrors: eerros, error: eerror }] =
        useEditPOMutation();
    const PO = useSelector((state) => state.purchaseOrder.createPo);
    const { details, deductions } = useSelector(
        (state) => state.purchaseOrder.createPo
    );
    const [createPO, { isLoading, isSuccess, isError, error }] =
        useCreatePOMutation();
    const [
        updatePO,
        { isLoading: uLoading, isError: uIsError, error: uerror },
    ] = useUpdatePOMutation();
    const dispatch = useDispatch();

    const [stopNext, setStopNext] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeStep, setActiveStep] = useState(0);

    const [totals, setTotals] = useState({ poTotal: 0, ddTotals: 0 });
    const hanldeClose = () => {
        setOpen(false);
        dispatch(resetCreatePo());
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
        try {
            if (Variant === "edit") {
                const res = await updatePO(PO);
            }
            const res = await updatePO({ id: 4808, po: PO });
            // const res = await createPO(PO);
            console.log("response", res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const poAmount =
            _.sumBy(details, (d) => Number(d.finalRate * d.qty)) || 0;
        const ddAmount = _.sumBy(deductions, (d) =>
            Number((poAmount * d.rate) / 100)
        );
        setTotals({ poTotal: poAmount, ddTotals: ddAmount });
    }, [details, deductions]);
    useEffect(() => {
        if (Variant === "edit") {
            console.log("Edit Po called", editPO[currentPo]);
            console.log(currentPo);
        }
    }, [Variant, currentPo]);
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
                        totals={totals}
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
                // disabled={hanldeNext(activeStep)}
                onClick={() => setActiveStep(activeStep + 1)}
            >
                <Icon>arrow_forward_ios</Icon>
            </IconButton>
        </Stack>
    );
};
const StepContent = ({ step, totals, handleSubmit }) => {
    switch (step) {
        case 0:
            return <POHead />;
            break;
        case 1:
            return <PODetails totals={totals} />;
            break;
        case 2:
            return <PODeductions totals={totals} />;
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

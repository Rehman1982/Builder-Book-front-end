import {
    Box,
    Button,
    Collapse,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
    Fade,
    Grid,
    Grow,
    Paper,
    Stack,
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
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import API from "../../api/axiosApi";
import ApprovalTimeline from "../../components/ui/ApprovalTimeline";
import Messenger from "../messenger/Messenger";
import { App } from "../../context/AppProvider";
import CreatePO from "./CreatePO/CreatePO";
import { useDispatch, useSelector } from "react-redux";
import {
    clearSelectedPO,
    setCreatePo,
} from "../../features/purchseOrders/poSlice";
import {
    useEditPOQuery,
    useShowPOMutation,
} from "../../features/purchseOrders/poApi";
import { orange } from "@mui/material/colors";

const ViewPO = forwardRef(({ PoId }, ref) => {
    const dispatch = useDispatch();
    const { deductions } = useSelector((state) => state.purchaseOrder.createPo);
    const selectedPo = useSelector((state) => state.purchaseOrder.selectedPoId);
    const [showPO, { isLoading, isSuccess, isError, error }] =
        useShowPOMutation();
    const EditPoRef = useRef(null);
    const { approvals, messages } = useContext(App);
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
    }));

    useEffect(() => {
        if (isSuccess && PoData) {
            dispatch(setCreatePo(PoData));
        }
        if (error) {
            alert("error in Query");
        }
    }, [selectedPo, PoData, dispatch]);

    return (
        <>
            {/* <CreatePO ref={EditPoRef} Variant="edit" /> */}
            <Dialog
                open={open}
                onClose={() => {
                    setOpen(false);
                    dispatch(clearSelectedPO());
                }}
                maxWidth="md"
            >
                <DialogTitle>
                    <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <span>{"PO No. " + selectedPo || ""}</span>
                        <Stack direction="row" spacing={1}>
                            {PoData?.po?.status === "drafted" ? (
                                <SubmitForApproval po={PoData || null} />
                            ) : (
                                <Button
                                    onClick={() =>
                                        approvals({
                                            type: "PO",
                                            id: selectedPo,
                                        })
                                    }
                                >
                                    Approvals
                                </Button>
                            )}
                            <Button
                                onClick={() =>
                                    messages({ type: "PO", id: selectedPo })
                                }
                            >
                                Messages
                            </Button>
                            {PoData?.po?.status === "drafted" && (
                                <Button
                                    onClick={() => EditPoRef?.current?.open()}
                                >
                                    Edit
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </DialogTitle>
                <DialogContent>
                    <POHead />
                    <Divider sx={{ my: 1 }} />
                    <PODetails />
                    {deductions.length > 0 && <PODeductions />}
                </DialogContent>
            </Dialog>
        </>
    );
});

export default ViewPO;

const POHead = () => {
    const po = useSelector((state) => state.purchaseOrder.createPo.po);
    return (
        <Grid container alignItems={"center"} spacing={1}>
            <Grid item xs={6}>
                <Box
                    px={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={2}
                    component={Paper}
                    elevation={3}
                >
                    <Typography variant="caption">Raise By</Typography>
                    <Typography variant="body2">{po?.user?.user}</Typography>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    px={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={2}
                    component={Paper}
                    elevation={3}
                >
                    <Typography variant="caption">Status</Typography>
                    <Typography variant="body2">{po?.status}</Typography>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    px={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={2}
                    component={Paper}
                    elevation={3}
                >
                    <Typography variant="caption">Project</Typography>
                    <Typography variant="body2">{po?.project?.name}</Typography>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    px={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={2}
                    component={Paper}
                    elevation={3}
                >
                    <Typography variant="caption">Vendor</Typography>
                    <Typography variant="body2">{po?.vendor?.name}</Typography>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    px={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={2}
                    component={Paper}
                    elevation={3}
                >
                    <Typography variant="caption">Raised On</Typography>
                    <Typography variant="body2">{po?.raised_date}</Typography>
                </Box>
            </Grid>
            <Grid item xs={6}>
                <Box
                    px={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={2}
                    component={Paper}
                    elevation={3}
                >
                    <Typography variant="caption">Expired On</Typography>
                    <Typography variant="body2">{po?.expiry_date}</Typography>
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Box
                    px={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={2}
                    component={Paper}
                    elevation={3}
                >
                    <Typography variant="caption">
                        Description/Instructions
                    </Typography>
                    <Typography variant="body2">{po?.podesp}</Typography>
                    <Typography variant="body2">{po?.instruction}</Typography>
                </Box>
            </Grid>
        </Grid>
    );
};
const PODetails = () => {
    const details = useSelector(
        (state) => state.purchaseOrder.createPo.details
    );
    return (
        <>
            <TableContainer
                sx={{ maxHeight: 300 }}
                component={Paper}
                elevation={3}
            >
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Desp</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell>Tax</TableCell>
                            <TableCell>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {details?.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Typography variant="body2">
                                        {"Item: " + item?.item?.item}
                                    </Typography>
                                    <Typography variant="body2">
                                        {item.desp}
                                    </Typography>
                                </TableCell>
                                <TableCell>{item.qty}</TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        fontSize={"0.7rem"}
                                    >
                                        Gross: {item.gross}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        fontSize={"0.7rem"}
                                    >
                                        Dis: {item.dis + "%"}
                                    </Typography>
                                    <Typography variant="body2">
                                        Rate: {item.finalRate}
                                    </Typography>
                                </TableCell>
                                <TableCell>{item.tax}</TableCell>
                                <TableCell>
                                    {item?.finalRate * item?.qty}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack
                bgcolor={orange[50]}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                component={Paper}
                elevation={3}
                p={2}
                mt={1}
            >
                <Typography variant="body2">Total</Typography>
                <Typography variant="body2">
                    {_.round(
                        _.sumBy(details, (d) => Number(d.finalRate * d.qty))
                    )}
                </Typography>
            </Stack>
        </>
    );
};
const PODeductions = () => {
    const { deductions, details } = useSelector(
        (state) => state.purchaseOrder.createPo
    );
    const [open, setOpen] = useState(false);
    const [poAmount, setPoAmount] = useState(0);
    const [totaldd, setTotalDD] = useState(0);
    useEffect(() => {
        setPoAmount(_.sumBy(details, (d) => Number(d.finalRate * d.qty)));
    }, [details]);
    useEffect(() => {
        setTotalDD(
            _.sumBy(deductions, (d) => Number((poAmount * d.rate) / 100))
        );
    }, [deductions, poAmount]);
    return (
        <>
            <Box component={Paper} elevation={3} mt={1}>
                <Collapse in={open}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Rate</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deductions?.map((dd, index) => (
                                <TableRow key={index}>
                                    <TableCell>{dd?.ddtype?.name}</TableCell>
                                    <TableCell>{dd?.rate}</TableCell>
                                    <TableCell padding="checkbox">
                                        {(poAmount * dd?.rate) / 100}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Collapse>
                <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    p={2}
                >
                    <Typography
                        sx={{ cursor: "pointer" }}
                        onClick={() => setOpen(!open)}
                        variant="body2"
                    >
                        Total Deductions
                    </Typography>
                    <Typography variant="body2">{totaldd}</Typography>
                </Stack>
            </Box>
            <Stack
                bgcolor={orange[50]}
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mt={1}
                p={2}
                component={Paper}
                elevation={3}
            >
                <Typography variant="body2">Net Amount</Typography>
                <Typography variant="body2">{poAmount - totaldd}</Typography>
            </Stack>
        </>
    );
};
const SubmitForApproval = ({ po }) => {
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState({});
    const handleSubmit = async () => {
        console.log("aaa");
        try {
            const res = await API.post(route("signature.inject"), {
                code: code,
                project_id: po.project_id,
                entity_id: po.id,
                sign_ables_id: 1,
            });
            console.log(res);
            if (res.status === 203) {
                setErrors(res.data);
            }
            if (res.status === 200) {
                console.log(res.data);
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <Box>
            <Button onClick={() => setOpen(true)}>Submit for Approval</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent>
                    <TextField
                        label="Signatory Code"
                        name="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        margin="dense"
                        fullWidth
                    />
                    <Button onClick={handleSubmit}>Submit</Button>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

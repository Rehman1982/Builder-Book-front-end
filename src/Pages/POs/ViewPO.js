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

const ViewPO = forwardRef(({ PoId }, ref) => {
    const EditPoRef = useRef(null);
    const { approvals, messages } = useContext(App);
    const ApprovalTMRef = useRef(null);
    const MessengerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [po, setPo] = useState({});
    const [details, setDetails] = useState([]);
    const [deductions, setDeductions] = useState([]);
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
    }));
    const getData = async () => {
        console.log("asdfdsf");
        try {
            const res = await API.get(route("PO.show", { PO: PoId || 1 }));
            console.log(res);
            setPo(res?.data?.po);
            setDetails(res?.data?.details);
            setDeductions(res?.data?.deductions);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getData();
    }, [PoId]);
    return (
        <>
            <CreatePO ref={EditPoRef} Variant="edit" PoId={po.id} />
            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md">
                <DialogTitle>
                    <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                    >
                        <span>{"PO No. " + po.id}</span>
                        <Stack direction="row" spacing={1}>
                            {po.status === "drafted" ? (
                                <SubmitForApproval po={po} />
                            ) : (
                                <Button
                                    onClick={() =>
                                        approvals({ type: "PO", id: PoId })
                                    }
                                >
                                    Approvals
                                </Button>
                            )}
                            <Button
                                onClick={() =>
                                    messages({ type: "PO", id: PoId })
                                }
                            >
                                Messages
                            </Button>
                            {po.status === "drafted" && (
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
                    <POHead po={po} />
                    <Divider sx={{ my: 1 }} />
                    <PODetails details={details} />
                    {deductions.length > 0 && (
                        <PODeductions
                            deductions={deductions}
                            details={details}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
});

export default ViewPO;

const POHead = ({ po }) => {
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
                    <Typography variant="body2">{po.user_name}</Typography>
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
                    <Typography variant="body2">{po.status}</Typography>
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
                    <Typography variant="body2">{po.project_name}</Typography>
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
                    <Typography variant="body2">{po.vendor_name}</Typography>
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
                    <Typography variant="body2">{po.raised_date}</Typography>
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
                    <Typography variant="body2">{po.expiry_date}</Typography>
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
                    <Typography variant="body2">{po.podesp}</Typography>
                    <Typography variant="body2">{po.instruction}</Typography>
                </Box>
            </Grid>
        </Grid>
    );
};
const PODetails = ({ details }) => {
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
                                        {"Item: " + item.item_name}
                                    </Typography>
                                    <Typography variant="body2">
                                        {item.description}
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
                                        Dis: {item.discount + "%"}
                                    </Typography>
                                    <Typography variant="body2">
                                        Rate: {item.rate}
                                    </Typography>
                                </TableCell>
                                <TableCell>{item.tax}</TableCell>
                                <TableCell>{Number(item.total)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                component={Paper}
                elevation={3}
                p={2}
                mt={1}
            >
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1">
                    {_.round(_.sumBy(details, (d) => Number(d.total)))}
                </Typography>
            </Stack>
        </>
    );
};
const PODeductions = ({ deductions, details }) => {
    const [open, setOpen] = useState(false);
    const [totaldd, setTotalDD] = useState(0);
    const billTotal = _.round(_.sumBy(details, (d) => Number(d.total)));

    useEffect(() => {
        setTotalDD(
            _.sum(deductions.map((v) => (v.deductions_rate * billTotal) / 100))
        );
    }, [deductions]);
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
                            {deductions.map((dd, index) => (
                                <TableRow key={index}>
                                    <TableCell>{dd.deduction_name}</TableCell>
                                    <TableCell>{dd.deductions_rate}</TableCell>
                                    <TableCell padding="checkbox">
                                        {(billTotal * dd.deductions_rate) / 100}
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
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mt={1}
                p={2}
                component={Paper}
                elevation={3}
            >
                <Typography variant="body2">Net Amount</Typography>
                <Typography variant="body2">{billTotal - totaldd}</Typography>
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

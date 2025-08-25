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
    Table,
    TableBody,
    TableCell,
    TableContainer,
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
import { useDispatch, useSelector } from "react-redux";
import {
    setPODetails,
    removePODetails,
    updatePODetails,
} from "../../../features/purchseOrders/poSlice";

const PODetails = ({ totals }) => {
    const dispatch = useDispatch();
    const details = useSelector(
        (state) => state.purchaseOrder?.createPo?.details
    );
    const DetailsRef = useRef(null);
    const [Varient, setVarient] = useState("create");
    const [current, setCurrent] = useState({ index: "", data: "" });

    const handleEdit = (data, index) => {
        setVarient("edit");
        setCurrent({ index: index, data: data });
        DetailsRef?.current?.open();
    };
    return (
        <Box mt={1}>
            <IconButton onClick={() => DetailsRef?.current?.open()}>
                <Icon>add</Icon>
            </IconButton>
            <DetailAdd
                ref={DetailsRef}
                Varient={Varient}
                setVarient={setVarient}
                current={current}
            />
            <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Desp/Item</TableCell>
                            <TableCell>Qty</TableCell>
                            <TableCell>Rate</TableCell>
                            <TableCell padding="checkbox">Amount</TableCell>
                            <TableCell padding="checkbox"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {details &&
                            details.length > 0 &&
                            details.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {item?.item?.item}
                                        </Typography>
                                        <Typography variant="body2">
                                            {item?.desp}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{item?.qty}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontSize: "0.7rem" }}
                                        >
                                            {"Gross: " + item.gross}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontSize: "0.7rem" }}
                                        >
                                            {"Dis%: " + item.dis || ""}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontSize: "0.7rem" }}
                                        >
                                            {"Tax: " + item.tax || ""}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontSize: "0.7rem" }}
                                        >
                                            {"Final: " + item.finalRate}
                                        </Typography>
                                    </TableCell>
                                    <TableCell padding="checkbox">
                                        {item.qty * item.finalRate}
                                    </TableCell>
                                    <TableCell>
                                        <ButtonGroup
                                            size="small"
                                            orientation="vertical"
                                        >
                                            <Button
                                                onClick={() =>
                                                    handleEdit(item, index)
                                                }
                                                variant="outlined"
                                            >
                                                <Icon children="edit" />
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    dispatch(
                                                        removePODetails(index)
                                                    )
                                                }
                                                variant="outlined"
                                            >
                                                <Icon children="delete" />
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                py={1}
                px={2}
                component={Paper}
                elevation={3}
                mt={1}
                borderRadius={1}
            >
                <Typography variant="body2">Total PO Amount</Typography>
                <Typography variant="body2">{totals?.poTotal}</Typography>
            </Stack>
        </Box>
    );
};
export default PODetails;

const DetailAdd = forwardRef(({ Varient, setVarient, current }, ref) => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.purchaseOrder.items);
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: handleClose,
    }));
    const [open, setOpen] = useState(false);
    const [state, setState] = useState({});
    const handleUpdate = (action) => {
        if (Varient === "create") {
            dispatch(setPODetails(state));
        } else {
            dispatch(updatePODetails({ index: current.index, data: state }));
        }
        setState({});
        if (action === "update_close") {
            setOpen(false);
        }
    };
    const handleFixed = (e) => {
        const { name, value } = e.target;
        const num = Number(value);
        if (!isNaN(num) && num <= 100) {
            setState({ ...state, [name]: num });
        }
    };
    const handleClose = () => {
        setVarient("create");
        setState({});
        setOpen(false);
    };
    useEffect(() => {
        if (Varient === "edit") {
            setState((prv) => {
                return current.data;
            });
        }
    }, [Varient, current]);
    useEffect(() => {
        const gross = state.gross || 0;
        const disRate = state.dis || 0;
        const taxRate = state.tax || 0;
        const disamount = (gross * disRate) / 100;
        const taxamount = (gross * taxRate) / 100;
        const finalRate = gross - disamount + taxamount;
        setState({ ...state, finalRate: finalRate });
        console.log("calculate", finalRate);
    }, [state.gross, state.dis, state.tax]);

    return (
        <Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent>
                    <Autocomplete
                        options={items || []}
                        getOptionLabel={(option) => option.item}
                        value={state.item || null}
                        onChange={(e, v) => setState({ ...state, item: v })}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select Item"
                                margin="dense"
                                required
                            />
                        )}
                    />
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={state.desp || ""}
                        onChange={(e, v) =>
                            setState({ ...state, desp: e.target.value })
                        }
                        margin="dense"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Qty"
                        value={state.qty || ""}
                        onChange={(e, v) => {
                            setState({ ...state, qty: e.target.value });
                        }}
                        margin="dense"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Gross Rate"
                        value={state.gross || ""}
                        onChange={(e, v) => {
                            setState({ ...state, gross: e.target.value });
                        }}
                        margin="dense"
                        required
                    />
                    <TextField
                        fullWidth
                        name="dis"
                        type="number"
                        inputProps={{ max: 100, min: 1 }}
                        label="Discount in %"
                        value={state.dis || ""}
                        onChange={handleFixed}
                        margin="dense"
                    />
                    <TextField
                        type="number"
                        name="tax"
                        inputProps={{ max: 100, min: 1 }}
                        fullWidth
                        label="Tax in % (add)"
                        value={state.tax || ""}
                        onChange={handleFixed}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        disabled
                        label="Final Rate"
                        value={state?.finalRate || ""}
                        margin="dense"
                    />
                    <TextField
                        fullWidth
                        disabled
                        label="Amount"
                        value={state?.qty * state?.finalRate || ""}
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleUpdate()}>Add & New</Button>
                    <Button onClick={() => handleUpdate("update_close")}>
                        Add & Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
});

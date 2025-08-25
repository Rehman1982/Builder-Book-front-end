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

const PODeductions = ({ dds, deductions, setDeductions, details, totals }) => {
    const DeductionRef = useRef(null);
    const [Variant, setVariant] = useState("create");
    const [current, setCurrent] = useState({ index: "", data: "" });
    const handleEdit = (data, index) => {
        setVariant("edit");
        setCurrent({ index: index, data: data });
        DeductionRef?.current?.open();
    };
    const handleDelete = (index) => {
        let updated = deductions.filter((d, idx) => idx !== index);
        setDeductions(updated);
    };
    return (
        <Box mt={1}>
            <DeductionAdd
                ref={DeductionRef}
                Variant={Variant}
                setVariant={setVariant}
                current={current}
                setCurrent={setCurrent}
                dds={dds}
                PoAmount={totals?.poTotal}
                setDeductions={setDeductions}
            />
            <Stack
                direction={"row"}
                justifyContent={"flex-end"}
                alignContent={"center"}
            >
                <IconButton onClick={() => DeductionRef?.current?.open()}>
                    <Icon>add</Icon>
                </IconButton>
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
                <Typography variant="body2">B/F PO Amount</Typography>
                <Typography variant="body2">{totals?.poTotal || 0}</Typography>
            </Stack>
            <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Deduction Type</TableCell>
                            <TableCell>Rate (%)</TableCell>
                            <TableCell padding="checkbox">Amount</TableCell>
                            <TableCell padding="checkbox"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {deductions &&
                            deductions.length > 0 &&
                            deductions.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {item?.ddtype?.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{item?.rate}</TableCell>
                                    <TableCell>
                                        {(totals?.poTotal * item?.rate) / 100}
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
                                            >
                                                <Icon>edit</Icon>
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    handleDelete(index)
                                                }
                                            >
                                                <Icon>delete</Icon>
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
                <Typography variant="body2">Total Deductions</Typography>
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
                mt={1}
                borderRadius={1}
            >
                <Typography variant="body2">NET PO Amount</Typography>
                <Typography variant="body2">
                    {totals.poTotal - totals.ddTotals}
                </Typography>
            </Stack>
        </Box>
    );
};
export default PODeductions;

const DeductionAdd = forwardRef(
    (
        {
            Variant,
            setVariant,
            current,
            setCurrent,
            dds,
            setDeductions,
            PoAmount,
        },
        ref
    ) => {
        useImperativeHandle(ref, () => ({
            open: () => setOpen(true),
            close: handleClose,
        }));
        const [open, setOpen] = useState(false);
        const [state, setState] = useState({});
        const handleClose = () => {
            setState({});
            setCurrent({ index: "", data: "" });
            setVariant("create");
            setOpen(false);
        };
        const handleFixed = (e) => {
            const { name, value } = e.target;
            const num = Number(value);
            if (!isNaN(num) && num <= 100) {
                setState({ ...state, [name]: num });
            }
        };
        const handleUpdate = (action) => {
            if (Variant === "edit") {
                setDeductions((prv) => {
                    let update = [...prv];
                    update[current.index] = state;
                    return update;
                });
            } else {
                setDeductions((prv) => {
                    let update = [...prv];
                    update.push(state);
                    return update;
                });
            }
            handleClose();
            if (action === "update_close") {
                setOpen(false);
            }
        };
        useEffect(() => {
            if (Variant === "edit") {
                setState(current.data);
            }
        }, [Variant, current]);
        useEffect(() => {
            const rate = state.rate || 0;
            const amount = (PoAmount * rate) / 100;
            setState({ ...state, amount: amount });
        }, [state.rate]);

        return (
            <Box>
                <Dialog open={open} onClose={() => setOpen(false)}>
                    <DialogContent>
                        <Autocomplete
                            options={dds || []}
                            getOptionLabel={(option) => option.name}
                            value={state.ddtype || null}
                            onChange={(e, v) =>
                                setState({ ...state, ddtype: v })
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Type of Deductions"
                                    margin="dense"
                                    required
                                />
                            )}
                        />
                        <TextField
                            fullWidth
                            type="number"
                            name="rate"
                            inputProps={{ max: 100, min: 1 }}
                            label="Rate in %"
                            value={state.rate || ""}
                            onChange={handleFixed}
                            margin="dense"
                        />
                        <TextField
                            fullWidth
                            disabled
                            label="Amount"
                            value={state?.amount || ""}
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleUpdate()}>
                            Add & New
                        </Button>
                        <Button onClick={() => handleUpdate("update_close")}>
                            Add & Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }
);

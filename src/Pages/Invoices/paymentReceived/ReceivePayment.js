import {
    Add,
    Close,
    DeleteForever,
    Edit,
    Height,
    Person2,
    RemoveRedEye,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Grow,
    Icon,
    IconButton,
    InputAdornment,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { blue, green, grey, indigo, orange, red } from "@mui/material/colors";
import axios from "axios";
import { reduce } from "lodash";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Error } from "../../helpers/helpers";
import { useContext } from "react";
import { Alert } from "../../../context/AlertBar/AlertBar";
import JREntries from "./JREntries";
import TransDetails from "./TransDetails";

export const ReceivePayment = ({
    currentInvoice,
    setCurrentInvoice,
    refresh,
}) => {
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [state, setState] = useState({});
    const [invoice, setInvoice] = useState();
    const [signatoryCode, setSignatoryCode] = useState("");
    const [errors, setErrors] = useState({});
    const [currentIndex, setCurrentIndex] = useState(null);
    const [trDetails, setTRDetails] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const hanldeSubmit = async () => {
        try {
            const res = await axios.post(route("invoicing.postinvoice.store"), {
                signatoryCode: signatoryCode,
                invoice: invoice,
                data: state,
            });
            if (res.status == 200) {
                setErrors({});
                setCurrentInvoice(null);
                setCurrentIndex(null);
                setMessage("Invoice Posted Successfully!");
                showAlert(true);
                refresh();
                console.log(res.data);
            }
            if (res.status == 203) {
                setErrors(res.data);
                setMessage("Something went wrong");
                setSeverity("error");
                showAlert(true);
                console.log(res);
            }
        } catch (error) {
            console.log(error.response);
        }
    };
    const handlClose = () => {
        setState({});
        setCurrentInvoice(null);
    };
    const getInvData = async (invId) => {
        const res = await axios.get(
            route("invoicing.paymentreceived.create", { invoice_id: invId })
        );
        if (res.status == 200) {
            console.log(res);
            setState(res.data.invoice);
            setAccounts(res.data.accounts);
        }
        console.log(res);
    };
    useEffect(() => {
        if (currentInvoice) getInvData(currentInvoice);
    }, [currentInvoice]);
    return (
        <Dialog open={Boolean(currentInvoice)} onClose={handlClose} fullWidth>
            <Box>
                <DialogTitle>Receive Payment</DialogTitle>
                <DialogContent>
                    <Grid container mb={1} spacing={0.5}>
                        <StyledGrid
                            icon="apartment"
                            text={state?.project?.name}
                            sizes={{ xs: 12 }}
                        />
                        <StyledGrid
                            icon="supervisor_account"
                            text={state?.customer?.name}
                            sizes={{ xs: 12 }}
                        />
                        <StyledGrid
                            icon="receipt_long"
                            text={state?.trans_no}
                            sizes={{ xs: 12, sm: 12, md: 6 }}
                        />
                        <StyledGrid
                            icon="receipt_long"
                            text={
                                state?.prefix +
                                "-" +
                                state?.date +
                                "-" +
                                state.number
                            }
                            sizes={{ xs: 12, sm: 12, md: 6 }}
                        />
                    </Grid>
                    {state?.transaction?.length > 0 && (
                        <>
                            {/* <Collapse in={trDetails}> */}
                            <TransDetails transactions={state.transaction} />
                            {/* </Collapse> */}

                            <JREntries
                                accounts={accounts}
                                data={state.transaction}
                                invoice={state}
                                setCurrentInvoice={setCurrentInvoice}
                                refresh={refresh}
                            />
                        </>
                    )}
                </DialogContent>
            </Box>
        </Dialog>
    );
};

// const TransDetails = ({ transactions }) => {
//     const [journals, setJournals] = useState([]);
//     const [open, setOpen] = useState(false);
//     const colors = {
//         I: blue[800],
//         L: orange[800],
//         C: red[800],
//         E: indigo[300],
//         A: green[800],
//     };
//     return (
//         <Box>
//             <Stack
//                 direction="row"
//                 justifyContent="space-between"
//                 alignItems="center"
//             >
//                 <Typography variant="body1" children="Transaction Details" />
//                 <IconButton
//                     size="small"
//                     onClick={() => setOpen(!open)}
//                     children={open ? <Visibility /> : <VisibilityOff />}
//                 />
//             </Stack>
//             <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
//                 <DialogTitle>
//                     JR Entries
//                     <IconButton
//                         onClick={() => setOpen(false)}
//                         sx={{ position: "absolute", top: 2, right: 2 }}
//                         children={<Close color="error" />}
//                     />
//                 </DialogTitle>

//                 <DialogContent>
//                     {transactions.map((trans) => (
//                         <Box key={trans.id}>
//                             <Typography
//                                 variant="caption"
//                                 display="block"
//                                 fontWeight={800}
//                                 my={1}
//                             >
//                                 Trans No: {trans.id}
//                             </Typography>
//                             {trans.journals.map((v, i) => (
//                                 <Grid
//                                     key={i}
//                                     container
//                                     alignItems="center"
//                                     py={0.25}
//                                     borderBottom={0.5}
//                                     borderColor={grey[400]}
//                                 >
//                                     <Grid item xs={1}>
//                                         <Avatar
//                                             sx={{
//                                                 height: 20,
//                                                 width: 20,
//                                                 backgroundColor:
//                                                     colors[
//                                                         v.accounts.type
//                                                             .charAt(0)
//                                                             .toUpperCase()
//                                                     ],
//                                                 color: grey[50],
//                                                 padding: 1,
//                                             }}
//                                             children={
//                                                 <Typography variant="caption">
//                                                     {v.accounts?.type
//                                                         ?.charAt(0)
//                                                         .toUpperCase()}
//                                                 </Typography>
//                                             }
//                                         />
//                                     </Grid>
//                                     <Grid item xs={7}>
//                                         <Typography
//                                             variant="caption"
//                                             children={v.accounts.name}
//                                         />
//                                     </Grid>
//                                     <Grid item xs={2}>
//                                         <Typography
//                                             variant="caption"
//                                             children={
//                                                 v.debit > 0 && v.debit + " DR"
//                                             }
//                                         />
//                                     </Grid>
//                                     <Grid item xs={2}>
//                                         <Typography
//                                             variant="caption"
//                                             children={
//                                                 v.credit > 0 && v.credit + " CR"
//                                             }
//                                         />
//                                     </Grid>
//                                 </Grid>
//                             ))}
//                         </Box>
//                     ))}
//                 </DialogContent>
//             </Dialog>
//         </Box>
//     );
// };

const StyledGrid = ({ icon, text, sizes }) => (
    <Grid item {...sizes}>
        <Grid container>
            <Grid item>
                <IconButton
                    sx={{ borderRadius: 1, border: 2, borderColor: blue[200] }}
                >
                    <Icon sx={{ color: blue[500] }}>{icon}</Icon>
                </IconButton>
            </Grid>
            <Grid
                item
                border={0.5}
                borderColor={grey[300]}
                flexGrow={1}
                paddingX={1}
            >
                <Typography variant="body1" sx={{ py: 1 }}>
                    {text}
                </Typography>
            </Grid>
        </Grid>
    </Grid>
);

const EditJREntry = ({ state, setState, accounts, index, setIndex }) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState();
    const handleUpdate = () => {
        setState((prv) => {
            let a = [...prv];
            a[index]["account"] = data.account;
            a[index]["desp"] = data.desp;
            return a;
        });
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
        setIndex(null);
        setData();
    };
    useEffect(() => {
        console.log("EDitAcc", state[index], accounts, index);
        if (index !== null) {
            setData(state[index]);
            setOpen(true);
        }
    }, [index]);
    return (
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogContent>
                <TextField
                    multiline
                    rows={5}
                    value={data?.desp}
                    onChange={(e) => setData({ ...data, desp: e.target.value })}
                    label="Description"
                    margin="dense"
                    fullWidth
                />
                <Autocomplete
                    options={data ? accounts[data.acType] : []}
                    getOptionLabel={(ops) => ops.name}
                    value={data?.account}
                    onChange={(e, v) => setData({ ...data, account: v })}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Accounts"
                            margin="dense"
                        />
                    )}
                />

                <Stack
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    mt={2}
                >
                    <ButtonGroup>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleUpdate} variant="contained">
                            Update
                        </Button>
                    </ButtonGroup>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

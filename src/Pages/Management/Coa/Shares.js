import React, {
    useState,
    useEffect,
    forwardRef,
    useImperativeHandle,
} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    Box,
    IconButton,
    Typography,
    Slide,
    List,
    ListItem,
    ListItemText,
    Paper,
    TableRow,
    TableCell,
    Icon,
    ButtonGroup,
    Stack,
    Grid,
    TextField,
    Autocomplete,
    DialogActions,
    Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { blue, grey, orange } from "@mui/material/colors";
import axios from "axios";
import _ from "lodash";
import { Error } from "../../helpers/helpers";
import CreateorEditShare from "./SharesCreate";

const Shares = forwardRef(({ title = "Dialog", currentProject }, ref) => {
    const [open, setOpen] = useState(false);
    const [project_id, setProject_id] = useState(null);
    const [state, setState] = useState([
        { id: 1, name: "Waqar", account: "2010012", percent: "50" },
        { id: 2, name: "Kakaji", account: "2010012", percent: "25" },
        { id: 3, name: "Qazi Saib", account: "2010012", percent: "25" },
    ]);
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
    }));
    const getShares = async () => {
        setLoading(true);
        try {
            const result = await axios.get(route("management.shares.index"), {
                params: { type: "data", project_id: currentProject.id },
            });
            setState(result.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };
    useEffect(() => {
        console.log("currentproject", currentProject);
        getShares();
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            maxWidth="sm"
            fullWidth
        >
            <Box
                sx={{
                    bgcolor: blue[500],
                    color: "white",
                    px: 3,
                    py: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                }}
            >
                <Typography variant="h6" fontWeight={600}>
                    Shares
                </Typography>
                <IconButton
                    onClick={() => setOpen(false)}
                    sx={{ color: "white" }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>
            <DialogContent>
                <ListProjects state={state} />
            </DialogContent>
            <DialogActions>
                <ButtonGroup>
                    <CreateorEditShare
                        data={state}
                        project_id={currentProject?.id}
                        refresh={getShares}
                    />
                </ButtonGroup>
            </DialogActions>
        </Dialog>
    );
});

export default Shares;

const ListProjects = React.memo(({ state }) => {
    return (
        <List>
            {state.map((v, i) => (
                <Paper elevation={3} sx={{ mb: 0.5, width: "100%" }} key={i}>
                    <ListItem>
                        <ListItemText
                            primary={v.user_name}
                            secondary={v.account_name}
                        />
                        <Typography>{v.share + "%"}</Typography>
                    </ListItem>
                </Paper>
            ))}
            <Paper elevation={3} sx={{ bgcolor: orange[200] }}>
                <ListItem>
                    <ListItemText primary="Total" />
                    <Typography variant="body1">
                        {_.sumBy(state, "share") + "%"}
                    </Typography>
                </ListItem>
            </Paper>
        </List>
    );
});

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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { blue, grey } from "@mui/material/colors";

// Slide transition component
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const CustomDialog = forwardRef(({ title = "Dialog", getData }, ref) => {
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        openDialog: () => setOpen(true),
        closeDialog: () => setOpen(false),
    }));

    useEffect(() => {
        if (open && typeof getData === "function") {
            setLoading(true);
            getData()
                .then((res) => setData(res))
                .catch((err) => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [open, getData]);

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            TransitionComponent={Transition}
            keepMounted
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    bgcolor: "white",
                    color: "black",
                    boxShadow: 10,
                },
            }}
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
                    {title}
                </Typography>
                <IconButton
                    onClick={() => setOpen(false)}
                    sx={{ color: "white" }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogContent
                sx={{
                    bgcolor: grey[100],
                    minHeight: 150,
                    py: 3,
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center">
                        <CircularProgress color="primary" />
                    </Box>
                ) : (
                    <Box px={1}>
                        <Typography variant="body1">
                            {data
                                ? JSON.stringify(data, null, 2)
                                : "No data found."}
                        </Typography>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
});

export default CustomDialog;

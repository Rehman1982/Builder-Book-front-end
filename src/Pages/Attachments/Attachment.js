import React, {
    useState,
    forwardRef,
    useImperativeHandle,
    useEffect,
} from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box,
    Stack,
    Link,
    Grow,
} from "@mui/material";
import { Close, PictureAsPdf, DeleteForever } from "@mui/icons-material";
import { blue, grey, red } from "@mui/material/colors";
import axios from "axios";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import UploadFiles from "./UploadFiles";

const Attachments = forwardRef(({ table, id, onUpload }, ref) => {
    const [open, setOpen] = useState(false);

    const [images, setImages] = useState([]);
    const [serverFiles, setServerFiles] = useState([]);

    useImperativeHandle(ref, () => ({
        openDialog: () => setOpen(true),
        closeDialog: () => setOpen(false),
    }));
    const getAttachments = async () => {
        const res = await axios.get("http://localhost/api/AttachmentApi", {
            params: { table: table, id: id },
        });
        console.log(res.data);
        // if (res.status == 200) {
        //     const SavedFiles =
        //         res.data.length > 0
        //             ? res.data.map((file) => route("showfile", { file: file }))
        //             : [];
        //     setServerFiles([...SavedFiles]);
        // }
    };

    useEffect(() => {
        getAttachments();
    }, [id, table, open]);
    return (
        <>
            <IconButton
                onClick={() => {
                    setImages([]);
                    setOpen(true);
                }}
                sx={{ border: 0.2, borderColor: blue[300] }}
            >
                <AttachFileIcon color="primary" fontSize="1.2rem" />
            </IconButton>
            <Dialog
                open={open}
                onClose={() => {
                    setServerFiles([]);
                    setImages([]);
                    setOpen(false);
                }}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Attachments
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={() => setOpen(false)}
                        style={{ position: "absolute", right: 10, top: 10 }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <UploadFiles
                    table={table}
                    id={id}
                    parentRefresh={getAttachments}
                />
                <DialogContent sx={{ height: 300 }}>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        flexWrap="wrap"
                        border={0.3}
                        borderColor={grey[300]}
                        height={300}
                        overflow="auto"
                        columnGap={1}
                        p={1}
                    >
                        {serverFiles.length > 0 &&
                            serverFiles.map((path) => {
                                return <Image key={Math.random()} url={path} />;
                            })}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="secondary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
});

export default Attachments;

const Image = ({ url, error }) => {
    return (
        <Box
            component={Link}
            target="_blank"
            rel="noreferrer"
            href={url}
            key={url}
            border={0.2}
            borderColor={grey[300]}
            sx={{
                width: 100,
                height: 100,
                p: 1,
            }}
        >
            {url.split(".")[1] == "pdf" ? (
                <PictureAsPdf sx={{ height: "100%", width: "100%" }} />
            ) : (
                <img
                    src={url}
                    alt="Preview"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: 8,
                    }}
                />
            )}
            <Stack direction="row" py={1}>
                {error}
            </Stack>
        </Box>
    );
};

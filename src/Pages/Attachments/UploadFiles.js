import React, { useState, forwardRef, useImperativeHandle } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Stack,
    Link,
    Grow,
    Collapse,
    IconButton,
    Typography,
} from "@mui/material";
import {
    CloudUpload,
    Close,
    DockOutlined,
    PictureAsPdf,
    DeleteForever,
    Add,
} from "@mui/icons-material";
import { blue, grey, pink, red } from "@mui/material/colors";
import { useEffect } from "react";
import axios from "axios";
import { each } from "lodash";
import { Error } from "../helpers/helpers";

const UploadFiles = ({ table, id, parentRefresh }) => {
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);
    const [errors, setErrors] = useState({});
    const handleUpload = async () => {
        if (images.length > 0) {
            const formData = new FormData();
            formData.append("attachment_type", table);
            formData.append("attachment_id", id);
            each(images, (image) => formData.append("file[]", image));
            try {
                const res = await axios.post(
                    route("AttachmentApi.store"),
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                if (res.status == 200) {
                    setImages([]);
                    parentRefresh();
                    setOpen(false);
                }
                if (res.status == 203) {
                    setErrors(res.data);
                }
                // console.log(res);
            } catch (error) {}
        }
    };
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        // console.log("file details", file);
        if (file) {
            setImages(images.concat(file));
        }
    };
    return (
        <>
            <Button
                sx={{ mx: 2 }}
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setOpen(true)}
            >
                Upload File(s)
            </Button>
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogContent>
                    <Stack
                        direction="row"
                        justifyContent="flex-start"
                        flexWrap="wrap"
                        columnGap={1}
                        rowGap={1}
                    >
                        {images.length > 0 &&
                            images.map((image, i) => {
                                return (
                                    <Image
                                        setImages={setImages}
                                        index={i}
                                        key={Math.random()}
                                        url={URL.createObjectURL(image)}
                                        error={
                                            <Error
                                                errors={errors}
                                                name={`file.${i}`}
                                            />
                                        }
                                    />
                                );
                            })}
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="baseline"
                        mt={2}
                    >
                        <label htmlFor="upload-button">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                id="upload-button"
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                component="span"
                                startIcon={<CloudUpload />}
                            >
                                Choose File
                            </Button>
                        </label>
                        {images.length > 0 && (
                            <Button onClick={handleUpload} variant="contained">
                                Upload
                            </Button>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>
        </>
    );
};

const Image = ({ index, url, error, setImages }) => {
    const [open, setOpen] = useState(false);
    const handleDelete = () => {
        setImages((images) => {
            let a = [...images];
            return a.filter((_, i) => i !== index);
        });
    };
    return (
        <Box
            key={url}
            border={0.2}
            borderColor={grey[300]}
            sx={{
                width: 100,
                height: 100,
                p: 1,
            }}
            position="relative"
            onMouseEnter={() => {
                setOpen(true);
            }}
            onMouseLeave={() => setOpen(false)}
        >
            <Grow
                in={open}
                sx={{
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: pink[200],
                }}
                // bgcolor={red[600]}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <IconButton onClick={handleDelete}>
                        <DeleteForever sx={{ color: grey[50] }} />
                    </IconButton>
                </Box>
            </Grow>
            <Box component={Link} target="_blank" rel="noreferrer" href={url}>
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
        </Box>
    );
};

export default UploadFiles;

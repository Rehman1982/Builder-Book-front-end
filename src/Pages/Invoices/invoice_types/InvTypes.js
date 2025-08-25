import { ArrowBackIosNew, DeleteForever, Edit } from "@mui/icons-material";
import {
    Avatar,
    Button,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { blue, green, orange, pink, red } from "@mui/material/colors";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { DeleteInvoiceType } from "./DeleteInvTyp";
import { InvoiceTypeCreate } from "./InvTypCreate";
import { useNavigate } from "react-router-dom";

export const InvoiceTypes = () => {
    const navigate = useNavigate();
    const [state, setState] = useState([
        // {
        //     id: "",
        //     type: "",
        //     status: "",
        // },
    ]);
    const [currentType, setCurrentType] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);
    const handleEdit = (data) => {
        setCurrentType(data);
    };
    const hanldeDelete = (data) => {
        setDeleteItem(data);
    };
    const getData = async () => {
        const res = await axios.get(
            route("invoicing.invoicetype.index", { type: "data" })
        );
        if (res.status == 200) {
            setState(res.data);
        }
        console.log(res);
    };
    useEffect(() => {
        getData();
    }, []);
    return (
        <Container>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                p={2}
                component={Paper}
            >
                <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ border: 1, borderColor: blue[800] }}
                >
                    <ArrowBackIosNew color="primary" />
                </IconButton>
                <Typography variant="h5">Invoice Type</Typography>
                <InvoiceTypeCreate
                    types={state}
                    setTypes={setState}
                    currentType={currentType}
                    setCurrentType={setCurrentType}
                />
            </Stack>
            <DeleteInvoiceType
                types={state}
                setTypes={setState}
                deleteItem={deleteItem}
            />

            <List sx={{ mt: 1 }}>
                {state.map((v, i) => (
                    <ListItem
                        component={Paper}
                        key={i}
                        divider
                        sx={{
                            backgroundColor:
                                v.fresh == 1
                                    ? green[200]
                                    : v.update == 1 && orange[200],
                        }}
                    >
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    backgroundColor:
                                        v.status == "active"
                                            ? green[800]
                                            : pink[800],
                                }}
                            >
                                {i + 1}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={v.type} secondary={v.status} />
                        <ListItemSecondaryAction>
                            <IconButton
                                onClick={() => handleEdit(v)}
                                sx={{
                                    border: 1,
                                    borderColor: orange[800],
                                    mr: 1,
                                }}
                            >
                                <Edit color="warning" />
                            </IconButton>
                            <IconButton
                                onClick={() => hanldeDelete(v)}
                                sx={{ border: 1, borderColor: red[800] }}
                            >
                                <DeleteForever color="error" />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

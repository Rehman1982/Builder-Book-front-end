import { SignalWifiStatusbar4BarRounded } from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Paper,
} from "@mui/material";
import React from "react";
import { useState } from "react";
const defaultData = [];
export const Approvals = () => {
    const [state, setState] = useState([]);
    return (
        <Box>
            <List>
                <ListItem divider component={Paper}>
                    <ListItemText
                        disableTypography={true}
                        primary={"Project Name"}
                        secondary={<Secondry />}
                    />
                </ListItem>
            </List>
        </Box>
    );
};

const Secondry = () => {
    return (
        <List>
            <ListItem divider>
                <ListItemText>Controller</ListItemText>
                <ListItemSecondaryAction></ListItemSecondaryAction>
            </ListItem>
            <ListItem divider>
                <ListItemText>Controller</ListItemText>
            </ListItem>
        </List>
    );
};

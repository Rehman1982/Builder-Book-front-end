import React, { useEffect } from "react";
import { Box, Typography, Paper, Avatar } from "@mui/material";
import _ from "lodash";

const MessageBubble = ({ message, isSender }) => {
    return (
        <Box
            display="flex"
            justifyContent={isSender ? "flex-end" : "flex-start"}
            mb={1}
        >
            {!isSender && (
                <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>
                    {message.sender_name?.[0]}
                </Avatar>
            )}

            <Paper
                elevation={3}
                sx={{
                    px: 2,
                    py: 1,
                    maxWidth: "70%",
                    bgcolor: isSender ? "#DCF8C6" : "#FFF",
                    borderRadius: 3,
                    borderTopLeftRadius: isSender ? 12 : 0,
                    borderTopRightRadius: isSender ? 0 : 12,
                }}
            >
                <Typography
                    variant="caption"
                    sx={{ fontWeight: "bold", color: "text.secondary" }}
                >
                    {message.sender_name}
                </Typography>

                <Typography variant="body1">{message.text}</Typography>

                <Typography
                    variant="caption"
                    sx={{
                        display: "block",
                        textAlign: "right",
                        mt: 0.5,
                        fontSize: "0.7rem",
                    }}
                >
                    {new Date(message.created_at).toLocaleString()}
                </Typography>
            </Paper>
        </Box>
    );
};

const Messages = ({ messages, currentUserId }) => {
    const endRef = React.useRef(null);
    React.useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);
    return (
        <Box sx={{ maxHeight: "70vh", overflowY: "auto", p: 2 }}>
            {messages.map((msg) => (
                <MessageBubble
                    key={msg.id}
                    message={msg}
                    isSender={msg.sender_id === currentUserId}
                />
            ))}
            <div ref={endRef} />
        </Box>
    );
};

export default Messages;

import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { amber, deepOrange, lightGreen } from "@mui/material/colors";

const MyLoader = ({ interval = 300 }) => {
    const [dotCount, setDotCount] = useState(1);

    useEffect(() => {
        const timer = setInterval(() => {
            setDotCount((prev) => (prev >= 10 ? 1 : prev + 1));
        }, interval);

        return () => clearInterval(timer);
    }, [interval]);

    return (
        <Typography
            variant="subtitle1"
            fontWeight={700}
            fontSize={"1.2rem"}
            sx={{ color: amber[600] }}
        >
            Loading{".".repeat(dotCount)}
        </Typography>
    );
};

export default MyLoader;

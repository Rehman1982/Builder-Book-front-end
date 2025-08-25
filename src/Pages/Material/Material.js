import React from "react";
import MaterialProvider from "./MaterialContext";
import { Typography } from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import Index from "./Index";
import Single from "./Single";
import { Button } from "@mui/material";
const Material = () => {
    return (
        <MaterialProvider>
            <Routes>
                {/* <Route exact path="public/material" element={<Single />} /> */}
                <Route exact path="public/material" element={<Index />} />
                <Route exact path="public/material/:project_id" element={<Single />} />
            </Routes>
        </MaterialProvider>
    )
}

export default Material

import { Typography } from "@mui/material";
import React, { createContext } from "react";
import { Outlet } from "react-router-dom";
const MaterialContext = createContext();

const MaterialProvider = (props) => {
    const Testing = () => {};
    return (
        <MaterialContext.Provider value={{ Testing }}>
            {props.children}
            <Outlet />
        </MaterialContext.Provider>
    );
};

export default MaterialProvider;

export { MaterialContext };

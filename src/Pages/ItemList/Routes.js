import React from "react";
import { Route } from "react-router-dom";
import ItemsIndex from "./Index";

const Routes = () => {
    return (
        <Routes>
            <Route path="public/item" element={<ItemsIndex />} />
        </Routes>
    );
};
export default Routes;

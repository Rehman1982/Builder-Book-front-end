import React, { useContext } from "react";
import BoqProvider from "./BOQContext";
import { Routes, Route, Switch } from "react-router-dom";
import Show from "./Show";
import Index from "./Index";
import CreateBoq from "./CreateBoq";
import { BoqMain } from "./BoqMain";
import { BOQLayout } from "./BOQLayout";

const BOQ = () => {
    return (
        <BoqProvider>
            <Routes>
                <Route index path="" element={<Index />} />
                <Route path=":project_id" element={<Show />} />
            </Routes>
        </BoqProvider>
    );
};
export default BOQ;

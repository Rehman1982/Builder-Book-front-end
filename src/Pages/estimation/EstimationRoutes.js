import React from "react";
import { Route, Routes } from "react-router-dom";
import { EstimationLayout } from "./EstimationLayout";
import BOQIndex from "../BOQs/Index";
import BOQShow from "../BOQs/Show";
import BoqProvider from "../BOQs/BOQContext";
import EstimationDash from "./EstimationDash";
import MaterialProvider from "../Material/MaterialContext";
import MaterialIndex from "../Material/Index";
import MaterialSingle from "../Material/Single";
import Schedules from "./Schedule/Index";
import ItemsIndex from "./Schedule/Items/Index";
import ScheduleProvider from "./Schedule/ScheduleProvider";
import Dash from "../Reports/Dash";

const EstimationRoutes = () => {
    return (
        <Routes>
            {/* <Route path="" element={<Dash />}> */}
            <Route index element={<EstimationDash />} />
            <Route path="boq" element={<BoqProvider />}>
                <Route index path="" element={<BOQIndex />} />
                <Route path=":project_id" element={<BOQShow />} />
            </Route>
            <Route path="schedules" element={<ScheduleProvider />}>
                <Route index element={<Schedules />} />
                <Route path="items" element={<ItemsIndex />} />
            </Route>
            <Route path="material" element={<MaterialProvider />}>
                <Route index element={<MaterialIndex />} />
                <Route path=":project_id" element={<MaterialSingle />} />
            </Route>
            {/* </Route> */}
        </Routes>
    );
};
export default EstimationRoutes;

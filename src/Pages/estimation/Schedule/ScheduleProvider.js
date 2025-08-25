import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
export const ScheduleContext = createContext();
const ScheduleProvider = (props) => {
    // states
    const [materialItems, setMaterialItems] = useState([{ id: "", name: "" }]);
    // functions
    const getMaterialItems = async () => {
        try {
            const res = await axios.get(
                route("estimation.schedules.items.create")
            );
            if (res.status == 200) {
                setMaterialItems(res.data);
            }
        } catch (error) {}
    };
    // effect
    useEffect(() => {
        getMaterialItems();
    }, []);
    // return
    return (
        <ScheduleContext.Provider value={{ materialItems }}>
            {props.children}
            <Outlet />
        </ScheduleContext.Provider>
    );
};

export default ScheduleProvider;

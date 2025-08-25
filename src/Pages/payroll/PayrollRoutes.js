import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import Dashboard from "./dashboard/Dashboard";

import List from "./employees/List";
import Create from "./employees/Create";
import AllowancesList from "./allowances/AllowancesList";
import Positions from "./positions/Positions";
import Schedules from "./schedules/Schedules";
import Layout from "./dashboard/Layout";
import Attendance from "./attendence/Attendance";
import { UserPayroll } from "./payrolles/UserPayroll";
import { PayrolList } from "./payrolles/PayrolList";
import Offices from "./offices/Offices";

import { LeavesDash } from "./leaves/LeavesDash";
import Entitlement from "./leaves/Entitles";

import LoginReset from "../LoginReset/LoginReset";
import Dash from "../Reports/Dash";

const items = [
    {
        heading: "",
        path: "dashboard",
        text: "Dashboard",
        icon: "list",
    },
    { heading: "", path: "employee", text: "Employee", icon: "list" },
    {
        heading: "",
        path: "allowance",
        text: "Allowances",
        icon: "list",
    },
    { heading: "", path: "positions", text: "Positions", icon: "list" },
    {
        heading: "",
        path: "schedules",
        text: "Schedules",
        icon: "list",
    },
    {
        heading: "",
        path: "attendance",
        text: "Attendance",
        icon: "list",
    },
    {
        heading: "",
        path: "payroll",
        text: "Payrolls",
        icon: "list",
    },
    {
        heading: "",
        path: "office",
        text: "Offices",
        icon: "list",
    },
    {
        heading: "",
        path: "leaves",
        text: "Leaves",
        icon: "list",
    },
    {
        heading: "",
        path: "resetlogin",
        text: "Login Reset",
        icon: "list",
    },
];
const PayrollRoutes = () => {
    return (
        <Routes>
            {/* <Route path="" element={<Layout />}> */}
            {/* <Route path="" element={<Dash title="Payrolls" items={items} />} /> */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employee" element={<Outlet />}>
                <Route path="" element={<List />} />
                <Route path="create" element={<Create />} />
            </Route>
            <Route path="allowance" element={<Outlet />}>
                <Route path="" element={<AllowancesList />} />
            </Route>
            <Route path="positions" element={<Outlet />}>
                <Route path="" element={<Positions />} />
            </Route>
            <Route path="schedules" element={<Outlet />}>
                <Route path="" element={<Schedules />} />
            </Route>
            <Route path="attendance" element={<Outlet />}>
                <Route path="" element={<Attendance />} />
            </Route>
            <Route path="payroll" element={<Outlet />}>
                <Route path="" element={<PayrolList />} />
                <Route path="view" element={<UserPayroll />} />

                <Route
                    path="generatePayroll"
                    element={<h1>Generate Payrolls</h1>}
                />
            </Route>
            <Route path="office" element={<Outlet />}>
                <Route path="" element={<Offices />} />
                {/* <Route path="approvalStages" element={<Offices />} /> */}
            </Route>
            <Route path="leaves" element={<LeavesDash />}>
                <Route path="" element={<Entitlement />} />
                <Route path="approvals" element={<h1>Approvals</h1>} />
                <Route path="applications" element={<h1>Applications</h1>} />
            </Route>
            <Route path="resetlogin" element={<LoginReset />} />
            {/* </Route> */}
        </Routes>
    );
};
export default PayrollRoutes;

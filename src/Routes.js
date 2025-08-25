import React from "react";
import { Routes, Route, createBrowserRouter, Outlet } from "react-router-dom";

import ProgTracking from "./Pages/progressTracking/Index";
import DPRs from "./Pages/dpr/Index";
import BOQ from "./Pages/BOQs/BOQs";

import Material from "./Pages/Material/Material";
// import SupplierCRUD from "./Pages/vendors/Vendors";
import IsoProcedures from "./Pages/isoForms/Procedures";
import SingleAccount from "./Pages/singleAccount/SingleAccount";
import Invoices from "./Pages/Invoices/Invoices";
// import { AuthProvider } from "./context/AuthContext";
import Customers from "./Pages/customers/Customers";
import { BOQLayout } from "./Pages/BOQs/BOQLayout";
import EstimationRoutes from "./Pages/estimation/EstimationRoutes";
import ReportsRoutes from "./Pages/Reports/Routes";
import PayrollRoutes from "./Pages/payroll/PayrollRoutes";
import LayoutAfteLogin from "./components/layout/Layout";
import Dash from "./Pages/Reports/Dash";
import SideMenu from "./Pages/SideMenu/SideMenu";
import MangementRoutes from "./Pages/Management/ManagementRoutes";
import Register from "./Pages/Auth/Register";
import Login from "./Pages/Auth/Login";
import EmailVerify from "./Pages/Auth/EmailVerify";
import Companies from "./Pages/company/Index";
import PasswordResetEmail from "./Pages/Auth/password/Email";
import ResetPassword from "./Pages/Auth/password/Reset";
import Main from "./Pages/Dashbaord/Main";

import MenuLoader from "./Pages/Reports/Dash";
import CreditBills from "./Pages/creditBills/Index";
import PurchaseBills from "./Pages/purchaseBills/Index";
import RouteErrorHandler from "./ErrorHandler/RouteErrorHandler";
import Signatures from "./Pages/signatures/Index";
import axios from "axios";
import { authLoader, guestOnly, emailverifyLoader } from "./loaders/loaders";
import Profile from "./Pages/Profile/Profile";
import Journals from "./Pages/Journals/Index";
import CreateJournals from "./Pages/Journals/Create";
// import JrProvider from "./Pages/Journals/JrProvider";
import POsIndex from "./Pages/POs/Index";
import ReduxPOsIndex from "./Pages/POsRedux/Index";

// testing components
import Testing from "./components/ui/PageLayout";
import ErrorPage from "./Pages/Errors/ErrorPage";
import AcTransfer from "./Pages/opAcTransfer/AcTransfer";

const routes = createBrowserRouter([
  {
    path: "register",
    element: <Register />,
    loader: guestOnly,
  },
  {
    path: "login",
    element: <Login />,
    loader: guestOnly,
  },
  {
    path: "password",
    loader: guestOnly,
    children: [
      {
        path: "email",
        element: <PasswordResetEmail />,
      },
      {
        path: "reset",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "email/verify",
    element: <EmailVerify />,
    loader: emailverifyLoader,
  },
  // ------------------ Secured Routes -------------------
  {
    path: "/", // Secure base layout
    element: <LayoutAfteLogin />,
    loader: authLoader, // protect all children using loader
    errorElement: <ErrorPage />,
    children: [
      { path: "forbidden", element: <ErrorPage /> },
      { path: "main", element: <Main /> },
      { path: "company", element: <Companies /> },
      ...MangementRoutes,
      {
        path: "trackflow",
        element: <MenuLoader />,
        children: [
          { path: "progressTracking/*", element: <ProgTracking /> },
          { path: "DPR/*", element: <DPRs /> },
        ],
      },
      {
        path: "signatures/*",
        children: [{ path: "signatures", element: <Signatures /> }],
      },
      { path: "invoicing/*", element: <Invoices /> },
      { path: "estimation/*", element: <EstimationRoutes /> },
      { path: "customers", element: <Customers /> },
      { path: "payroll/*", element: <PayrollRoutes /> },
      { path: "reports/*", element: <ReportsRoutes /> },
      {
        path: "isoForms",
        element: <Outlet />,
        children: [{ index: true, element: <IsoProcedures /> }],
      },
      { path: "menu", element: <SideMenu /> },
      { path: "opactransfer", element: <AcTransfer /> },
      {
        path: "transactions/*",
        children: [
          {
            path: "creditBills",
            element: <CreditBills />,
          },
          { path: "purchaseBills", element: <PurchaseBills /> },
          {
            path: "journals",
            children: [
              {
                path: "",
                element: <Journals />,
              },
              {
                path: "create",
                element: <CreateJournals />,
              },
            ],
          },

          { path: "debitMemos", element: <>DBMs </> },
          { path: "vendorPayments", element: <>VPs </> },
          { path: "personalExpenses", element: <>PEs </> },
          { path: "resealseRetentions", element: <>RRs </> },
        ],
      },
      { path: "purchaseBills", element: <PurchaseBills /> },
      {
        path: "profile",
        element: <Profile />,
      },
      { path: "testing", element: <Testing /> },
      {
        path: "purchaseOrders",
        element: <POsIndex />,
      },
      { path: "ReduxPos", element: <ReduxPOsIndex /> },
    ],
  },
]);

export default routes;

import React, { useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";

import PLbyAccount from "./PL/ByAccount/ProfitLoss";
import PLbyProject from "./PL/ByProject/ProfitLoss";
import PLbyBusiness from "./PL/ByBusiness/ProfitLoss";
import Trialbalance from "./Trail/Trialbalance";
import BalanceSheet from "./BalanceSheet/BalanceSheet";
import Liability from "./Liability/ByProject/Report";
import MainReport from "./Report/MianReport";
import CashFlowReport from "./CashFlow/Report";
import EquityChangeReport from "./Equity/EquityChangeReport";
import ShareholderPL from "./ShareholderPL/ShareholderPL";
import Dash from "./Dash";
import { useDispatch } from "react-redux";
import { useReportPartialsQuery } from "../../features/reports/reportApi";
import { setReportPartials } from "../../features/reports/reportSlice";
const items = [
  {
    heading: "Financial",
    icon: "list",
    text: "Profit & Loss (by Account)",
    path: "profitloss/byaccount",
  },
  {
    heading: "Financial",
    icon: "list",
    text: "Profit & Loss (by Project)",
    path: "profitloss/byproject",
  },
  {
    heading: "Financial",
    icon: "list",
    text: "Profit & Loss (by Business Nature)",
    path: "profitloss/bybusiness",
  },

  {
    heading: "Financial",
    icon: "list",
    text: "Balance Sheet",
    path: "balancesheet",
  },

  {
    heading: "Financial",
    icon: "bar_chart",
    text: "Trail Balance",
    path: "trailbalance",
  },
  {
    heading: "Ledger",
    icon: "bar_chart",
    text: "Income",
    path: "income",
  },
  {
    heading: "Ledger",
    icon: "bar_chart",
    text: "Cost of Goods",
    path: "cogs",
  },
  {
    heading: "Ledger",
    icon: "bar_chart",
    text: "Payables",
    path: "payables",
  },
  {
    heading: "Ledger",
    icon: "bar_chart",
    text: "Receivables / Assets",
    path: "assets",
  },

  {
    heading: "Ledger",
    icon: "bar_chart",
    text: "Equities",
    path: "equity",
  },
  {
    heading: "Ledger",
    icon: "bar_chart",
    text: "Cash Flow",
    path: "cashflow",
  },
  {
    heading: "Taxation",
    icon: "bar_chart",
    text: "Tax Computation Report",
    path: "trailbalance",
  },
  {
    heading: "Budgeting",
    icon: "bar_chart",
    text: "Budget vs Actual Report",
    path: "trailbalance",
  },
  {
    heading: "Shareholders",
    icon: "bar_chart",
    text: "Equity Change Report",
    path: "equitychange",
  },
  {
    heading: "Shareholders",
    icon: "bar_chart",
    text: "Shareholder's P/L Project Wise",
    path: "shareholderpl",
  },
  {
    heading: "Shareholders",
    icon: "bar_chart",
    text: "Shareholder's Income Report",
    path: "trailbalance",
  },
];
const ReportsRoutes = () => {
  const dispatch = useDispatch();
  const { data: partials = [], isSuccess } = useReportPartialsQuery();
  useEffect(() => {
    if (isSuccess && partials) {
      dispatch(setReportPartials(partials));
    }
  }, [partials]);
  return (
    <Routes>
      <Route path="">
        {/* <Route index element={<Dash />} /> */}
        <Route path="profitloss">
          <Route path="byaccount" element={<PLbyAccount />} />
          <Route path="byproject" element={<PLbyProject />} />
          <Route path="bybusiness" element={<PLbyBusiness />} />
        </Route>
        {/* <Route path="profitloss" element={<ProfitLoss />} /> */}
        <Route path="balancesheet" element={<BalanceSheet />} />
        <Route path="trailbalance" element={<Trialbalance />} />
        {/* <Route path="liability"> */}
        <Route
          path="payables"
          element={
            <MainReport
              title="Payables"
              APIUrl="/reports/payables"
              groupOn="vendor_id"
            />
          }
        />
        <Route
          path="income"
          element={
            <MainReport
              title="Income"
              APIUrl="/reports/income"
              groupOn="account_id"
            />
          }
        />
        <Route
          path="cogs"
          element={
            <MainReport
              title="Cost of Goods"
              APIUrl="/reports/cogs"
              groupOn="project_id"
            />
          }
        />
        <Route
          path="assets"
          element={
            <MainReport
              title="Assets / Receivables"
              APIUrl="/reports/assets"
              groupOn="account_id"
            />
          }
        />
        <Route
          path="equity"
          element={
            <MainReport
              title="Equities"
              APIUrl="/reports/equity"
              groupOn="account_id"
            />
          }
        />
        <Route path="cashflow" element={<CashFlowReport />} />
        <Route path="equitychange" element={<EquityChangeReport />} />
        <Route path="shareholderpl" element={<ShareholderPL />} />
        {/* </Route> */}
        <Route path="receivables" />
        {/* <Route path="boq" element={<BoqProvider />}>
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
                </Route> */}
      </Route>
    </Routes>
  );
};

export default ReportsRoutes;

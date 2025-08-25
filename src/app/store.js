import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "../features/baseApi/baseApi";
import poReducer from "../features/purchseOrders/poSlice";
import authSlice from "../features/auth/authSlice";
import dashSlice from "../features/dashboard/dashSlice";
import companySlice from "../features/companies/companySlice";
import vendorlistSlice from "../features/vendorlist/vendorlistSlice";
import alertSlice from "../features/alert/alertSlice";
import projectsSlice from "../features/projects/projectsSlice";
import coaSlice from "../features/coa/coaSlice";
import userSlice from "../features/user/userSlice";
import privilegeSlice from "../features/privileges/privilegeSlice";
import sharesSlice from "../features/shares/sharesSlice";
import progressSlice from "../features/progressTracking/progressSlice";
import sidemenuSlice from "../features/sidemenu/sidemenuSlice";
import journalSlice from "../features/journals/journalSlice";
import creditBillSlice from "../features/creditBill/creditBillSlice";
import messengerSlice from "../features/messenger/messengerSlice";
import signatureSlice from "../features/signatures/signatureSlice";
import itemlistSlice from "../features/itemlist/itemlistSlice";
import reportSlice from "../features/reports/reportSlice";
import plReportSlice from "../features/reports/plReportSlice";
import acTransferSlice from "../features/acTransfer/acTransferSlice";
import purchaseBillSlice from "../features/purcasheBill/purchaseBillSlice";

const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    dashSlice: dashSlice,
    authSlice: authSlice,
    purchaseOrder: poReducer,
    companySlice: companySlice,
    vendorlistSlice: vendorlistSlice,
    alertSlice: alertSlice,
    projectsSlice: projectsSlice,
    coaSlice: coaSlice,
    userSlice: userSlice,
    privilegeSlice: privilegeSlice,
    sharesSlice: sharesSlice,
    progressSlice: progressSlice,
    sidemenuSlice: sidemenuSlice,
    journalSlice: journalSlice,
    creditBillSlice: creditBillSlice,
    messengerSlice: messengerSlice,
    signatureSlice: signatureSlice,
    itemlistSlice: itemlistSlice,
    reportSlice: reportSlice,
    plReportSlice: plReportSlice,
    acTransferSlice: acTransferSlice,
    purchaseBillSlice: purchaseBillSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export { store };

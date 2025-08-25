import React from "react";
import { Route, Routes } from "react-router-dom";
import InvoicesIndex from "./InvoicesIndex";
import { InvContext } from "./context";
import { Main } from "./Main";
import { ApplicableTaxes } from "./applicable_taxes/ApplicableTaxes";
import { InvoiceTypes } from "./invoice_types/InvTypes";
import { PrintInvoice } from "./PrintInvoice";
import { Approvals } from "./approvals/Approvals";
import PostInvoices from "./PostInvoice/PostInvoices";
import { InvoiceSetting } from "./settings/InvoiceSetting";
import PRIndex from "./paymentReceived/PRIndex";
import Layout from "./Layout";
import Dash from "../Reports/Dash";

const Invoices = () => {
    return (
        <InvContext>
            <Routes>
                {/* <Route path="" element={<Dash />}> */}
                <Route path="applicabletaxes" element={<ApplicableTaxes />} />
                <Route path="invoicetype" element={<InvoiceTypes />} />
                <Route path="invoices" element={<InvoicesIndex />} />
                <Route path="postinvoice" element={<PostInvoices />} />
                <Route path="settings" element={<InvoiceSetting />} />
                <Route path="paymentreceived" element={<PRIndex />} />
                {/* <Route path="approvals" element={<Approvals />} /> */}
                {/* </Route> */}
            </Routes>
        </InvContext>
    );
};
export default Invoices;

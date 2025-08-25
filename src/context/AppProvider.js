import { Typography } from "@mui/material";
import React, {
    createContext,
    forwardRef,
    useCallback,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";
import ViewVendorBill from "../Pages/creditBills/CURD";
import ApprovalTimeline from "../components/ui/ApprovalTimeline";
import Messenger from "../Pages/messenger/Messenger";
const App = createContext();
const AppProvider = (props) => {
    // Refs
    const VBRef = useRef(null);
    const MessengerRef = useRef(null);
    const ApprovalRef = useRef(null);
    // States
    const [vendorbill, setVendorBill] = useState(null);
    const [approval, setApproval] = useState({ type: "", id: "" });
    const [message, setMessage] = useState({ type: "", id: "" });
    // Actions
    const showBill = useCallback((id) => {
        setVendorBill(id);
        VBRef?.current?.open();
    }, []);
    const approvals = useCallback((data) => {
        setApproval(data);
        ApprovalRef?.current?.open();
    }, []);
    const messages = useCallback((data) => {
        setMessage(data);
        MessengerRef?.current?.open();
    }, []);
    return (
        <App.Provider value={{ showBill, approvals, messages }}>
            <ViewVendorBill ref={VBRef} billNo={vendorbill} />
            <ApprovalTimeline
                ref={ApprovalRef}
                type={approval.type}
                id={approval.id}
            />
            <Messenger ref={MessengerRef} type={message.type} id={message.id} />
            {props.children}
        </App.Provider>
    );
};

export default AppProvider;
export { App };

const VendorBill = forwardRef(({ id }, ref) => {
    const [open, setOpen] = useState(false);
    useImperativeHandle(ref, () => ({
        open: () => setOpen(true),
    }));
    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Vendor Bill</DialogTitle>
            <DialogContent>asdfsafsdfdfs</DialogContent>
            <DialogActions></DialogActions>
        </Dialog>
    );
});

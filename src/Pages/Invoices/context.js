import axios from "axios";
import react, { useContext, createContext, useState } from "react";
import { useEffect } from "react";
import { AsyncCompiler } from "sass";
import { Alert } from "../../context/AlertBar/AlertBar";
import { useCallback } from "react";

const CONTEXT = createContext();
const defaults = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
];
export const InvContext = (props) => {
    const { showAlert, setMessage, setSeverity } = useContext(Alert);
    const [projects, setProjects] = useState(defaults);
    const [customers, setCustomers] = useState(defaults);
    const [taxes, setTaxes] = useState([
        // { id: 1, name: "GST", tax_rate: 17, tax_type: "indirect", included: 1 },
        // { id: 2, name: "SST", tax_rate: 17, tax_type: "indirect", included: 0 },
        // { id: 3, name: "FED", tax_rate: 5, tax_type: "indirect", included: 0 },
        // { id: 4, name: "W/H", tax_rate: 3, tax_type: "indirect", included: 0 },
    ]);
    const [invoicePrefix, setInvoicePrefix] = useState([
        // { id: 1, type: "GST" },
        // { id: 2, type: "KPPRA" },
    ]);
    const [allInvoices, setAllInvoices] = useState([]);
    const [invoice, setInvoice] = useState({
        project: null,
        customer: null,
        invoiceType: null,
    });
    const [billingDetails, setBillingDetails] = useState([
        // { id: "", desp: "afsadfsdf", qty: 1, rate: 15000 },
    ]);
    const [billingDetailsTotal, setBillingDetailsTotal] = useState(0); // valueIncluding Tax;

    const [valueExludingTax, setValueExludingTax] = useState(0);

    const [includedTaxes, setIncludedTaxes] = useState([
        // {
        //     id: "",
        //     tax: { id: "", name: "", tax_rate: "" },
        //     tax_rate: "",
        //     tax_value: "",
        // },
    ]);

    const [taxesDetails, setTaxesDetails] = useState([]);
    const [taxesDetailsTotal, setTaxesDetailsTotal] = useState(0);
    const [transDetails, setTransDetails] = useState([]);
    const [errors, setErrors] = useState({});
    const [refresh, setRefresh] = useState(true);
    useEffect(() => {
        if (taxesDetails) {
            const TotalTaxes = taxesDetails.reduce(
                (total, current, index) => (total += current.amount),
                0
            );
            setTaxesDetailsTotal(TotalTaxes);
        }
    }, [taxesDetails]);
    const getData = useCallback(async () => {
        try {
            const res = await axios.get(
                route("invoicing.invoices.create", { invoice: 1 })
            );
            console.log(res);
            if (res.status == 200) {
                setProjects(res.data.projects);
                setCustomers(res.data.customers);
                setInvoicePrefix(res.data.invoices_type);
                setTaxes(res.data.taxes);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);
    const getAllInvoices = useCallback(async () => {
        try {
            const res = await axios.get(
                route("invoicing.invoices.index", { type: "data" })
            );
            console.log(res.data);
            setAllInvoices(res.data);
            // setLoading(false);
            return true;
        } catch (error) {
            console.log(error);
            // setLoading(false);
            return false;
        }
    }, []);
    const getInvoiceData = async (invoice_id) => {
        const res = await axios.get(
            route("invoicing.invoices.show", {
                invoice: 1,
                invoice_id: invoice_id,
            })
        );
        if (res.status == 200) {
            const { data } = res;
            console.log("dafgafsdafsafsadfsadff", data);
            setInvoice({
                id: data.id,
                project: data.project,
                customer: data.customer,
                invoiceType: data.invoice_type,
                date: data.date,
                number: data.number,
                user: data.user,
                company: data.company,
            });
            setBillingDetails(data.details);
            setIncludedTaxes(data.included_taxes);
            setTaxesDetails(data.taxes);
            // setLoading(false);
        }
        console.log("invoice data fetched", res.data);
    };
    useEffect(() => {
        if (billingDetails) {
            const valueBeforeTax = billingDetails.reduce(
                (total, current, index) =>
                    (total += current.qty * current.rate),
                0
            );
            setBillingDetailsTotal(valueBeforeTax);
        }
    }, [billingDetails]);
    // useEffect(() => {
    //     getData();
    //     getAllInvoices();
    // }, []);
    return (
        <CONTEXT.Provider
            value={{
                getInvoiceData,
                projects,
                setProjects,
                customers,
                setCustomers,
                taxes,
                setTaxes,
                invoicePrefix,
                setInvoicePrefix,
                invoice,
                setInvoice,
                billingDetails,
                billingDetailsTotal,
                setBillingDetails,
                taxesDetails,
                setTaxesDetails,
                taxesDetailsTotal,
                errors,
                setErrors,
                refresh,
                setRefresh,
                showAlert,
                setMessage,
                setSeverity,
                valueExludingTax,
                setValueExludingTax,
                includedTaxes,
                setIncludedTaxes,
                allInvoices,
                setAllInvoices,
                getAllInvoices,
                getData,
            }}
        >
            {props.children}
        </CONTEXT.Provider>
    );
};
export default CONTEXT;

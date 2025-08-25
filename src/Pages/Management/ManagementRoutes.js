import VendorList from "./Vendors/Index";
import UsersList from "./Users/Index";
import ProjectsIndex from "./Projects/Index";
import CoaIndex from "./Coa/Index";
import ItemList from "../ItemList/Index";
const MangementRoutes = [
  { path: "vendors", element: <VendorList /> },
  { path: "projects", element: <ProjectsIndex /> },
  { path: "coa", element: <CoaIndex /> },
  { path: "itemlist", element: <ItemList /> },
  { path: "users", element: <UsersList /> },
  { path: "taxes_deductions", element: <h1>Taxes and Deductions</h1> },
  { path: "books", element: <h1>Books</h1> },
  { path: "reportReceivables", element: <h1>Report Receivables</h1> },
];
export default MangementRoutes;

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../utils/axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    "Vendors",
    "Projects",
    "Accounts",
    "Users",
    "Privilege",
    "Privileges",
    "PrvProject",
    "Shares",
    "MenuItem",
    "MenuItems",
    "Journals",
    "Journal",
    "Messeges",
    "Item",
    "Items",
    "AcTransfers",
    "AcTransfer",
  ],
  endpoints: () => ({}),
});

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../utils/axiosBaseQuery";
import { baseApi } from "../baseApi/baseApi";

const vendorlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVendors: builder.query({
      query: (params) => ({
        url: "/management/vendors",
        method: "GET",
        params: params,
      }),
      providesTags: (result) => [
        ...result.map(({ id }) => ({ type: "Vendor", id })),
        { type: "Vendors" },
      ],
    }),
    showVendor: builder.query({
      query: (params) => ({
        url: "/management/vendors/1",
        method: "get",
        params: params,
      }),
    }),
    storeVendor: builder.mutation({
      query: (params) => ({
        url: "/management/vendors",
        method: "POST",
        params: params,
      }),
      invalidatesTags: [{ type: "Vendors" }],
    }),
    updateVendor: builder.mutation({
      query: (params) => ({
        url: "/management/vendors/1",
        method: "PUT",
        params: params,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Vendor", id }],
    }),
    destroyVendor: builder.mutation({
      query: (params) => ({
        url: "/management/vendors",
        method: "Delete",
        params: params,
      }),
    }),
    getAccounts: builder.query({
      query: (params) => ({
        url: "/management/vendors/create",
        method: "GET",
        params: params,
      }),
    }),
  }),
});
export const {
  useGetVendorsQuery,
  useShowVendorQuery,
  useStoreVendorMutation,
  useUpdateVendorMutation,
  useDestroyVendorMutation,
  useGetAccountsQuery,
} = vendorlistApi;
export default vendorlistApi;

import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../utils/axiosBaseQuery";
import { baseApi } from "../baseApi/baseApi";

const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allCompanies: builder.query({
      query: (params) => ({
        url: "/company",
        method: "get",
        params: params,
      }),
    }),
    showCompany: builder.query({
      query: (params) => ({
        url: "/company/1",
        method: "get",
        params: params,
      }),
    }),
    storeCompany: builder.mutation({
      query: (params) => ({
        url: "/company",
        method: "POST",
        params: params,
      }),
    }),
    updateCompany: builder.mutation({
      query: (params) => ({
        url: "/company",
        method: "PUT",
        params: params,
      }),
    }),
    activateCompany: builder.mutation({
      query: (params) => ({
        url: "/company/activate",
        method: "post",
        params: params,
      }),
    }),
    userResponce: builder.mutation({
      query: (params) => ({
        url: "/company/user_response",
        method: "post",
        params: params,
      }),
    }),
    addUser: builder.mutation({
      query: (params) => ({
        url: "/company/adduser",
        method: "post",
        params: params,
      }),
    }),
  }),
});

export const {
  useAllCompaniesQuery,
  useShowCompanyQuery,
  useStoreCompanyMutation,
  useUpdateCompanyMutation,
  useActivateCompanyMutation,
  useUserResponceMutation,
  useAddUserMutation,
} = companyApi;
export default companyApi;

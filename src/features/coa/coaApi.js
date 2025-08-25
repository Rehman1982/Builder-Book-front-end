import { baseApi } from "../baseApi/baseApi";

const coaApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAccounts: builder.query({
      query: (params) => ({
        url: "/management/coa",
        method: "Get",
        params: params,
      }),
      providesTags: ["Accounts"],
    }),
    createAc: builder.query({
      query: (params) => ({
        url: "/management/coa/create",
        method: "GET",
        params: params,
      }),
    }),
    storeAc: builder.mutation({
      query: (params) => ({
        url: "/management/coa",
        method: "post",
        data: params,
      }),
      invalidatesTags: ["Accounts"],
    }),
    updateAc: builder.mutation({
      query: (params) => ({
        url: "/management/coa/update",
        method: "PUT",
        params: params,
      }),
      invalidatesTags: ["Accounts"],
    }),
    destroyAc: builder.mutation({
      query: (params) => ({
        url: "/management/coa/destroy",
        method: "DELETE",
        params: params,
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetAllAccountsQuery,
  useCreateAcQuery,
  useDestroyAcMutation,
  useUpdateAcMutation,
  useStoreAcMutation,
} = coaApi;
export default coaApi;

import { baseApi } from "../baseApi/baseApi";

const creditBillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    index: builder.query({
      query: (params) => ({
        url: "/transactions/creditBills",
        method: "Get",
        params: params,
      }),
      providesTags: (rslt, err, arg) =>
        rslt
          ? [...rslt.map((v) => ({ type: "creditBill", id: v.id }))]
          : [{ type: "creditBills" }],
    }),
    show: builder.query({
      query: (params) => ({
        url: "/transactions/creditBills/show",
        method: "Get",
        params: params,
      }),
    }),
    store: builder.mutation({
      query: (params) => ({
        url: "/transactions/creditBills",
        method: "POST",
        params: params,
      }),
      invalidatesTags: [{ type: "creditBills" }],
    }),
    update: builder.mutation({
      query: (params) => ({
        url: "/transactions/creditBills",
        method: "PUT",
        params: params,
      }),
      invalidatesTags: (rslt, err, arg) =>
        rslt && [{ type: "creditBill", id: arg.id }],
    }),
    destroy: builder.mutation({
      query: (params) => ({
        url: "/transactions/creditBills/1",
        method: "DELETE",
        params: params,
      }),
      invalidatesTags: (rslt, err, arg) =>
        rslt && [{ type: "creditBill", id: arg.id }],
    }),
  }),
});

export const {
  useIndexQuery,
  useShowQuery,
  useStoreMutation,
  useUpdateMutation,
  useDestroyMutation,
} = creditBillApi;
export default creditBillApi;

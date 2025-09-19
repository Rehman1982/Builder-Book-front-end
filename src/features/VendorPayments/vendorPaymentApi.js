import { baseApi } from "../baseApi/baseApi";
const vendorPaymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    index: builder.query({
      query: (params) => ({
        url: `/transactions/vendorpayments?page=${params?.page || 1}`,
        method: "get",
        params: params,
      }),
      providesTags: (rslt, err, arg) =>
        rslt?.data
          ? [
              ...rslt.data.map((j) => ({ type: "VendorPayment", id: j.id })),
              { type: "VendorPayments" },
            ]
          : [{ type: "VendorPayments" }],
    }),
    store: builder.mutation({
      query: (data) => ({
        url: "/transactions/vendorpayments",
        method: "post",
        data: data,
      }),
      invalidatesTags: [{ type: "VendorPayments" }],
    }),
    update: builder.mutation({
      query: (params) => ({
        url: "/transactions/vendorpayments/1",
        method: "put",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) => [
        { type: "VendorPayment", id: arg.trans },
      ],
    }),
    destroy: builder.mutation({
      query: (params) => ({
        url: "/transactions/vendorpayments/1",
        method: "DELETE",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) =>
        rslt ? [{ type: "VendorPayment", id: arg.trans_no }] : [],
    }),
    create: builder.query({
      query: (params) => ({
        url: "/transactions/vendorpayments/create",
        method: "get",
        params: params,
      }),
    }),
    show: builder.query({
      query: (params) => ({
        url: "/transactions/vendorpayments/1",
        method: "get",
        params: params,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});
export const {
  useIndexQuery,
  useStoreMutation,
  useUpdateMutation,
  useDestroyMutation,
  useCreateQuery,
  useShowQuery,
} = vendorPaymentApi;
export default vendorPaymentApi;

import { baseApi } from "../baseApi/baseApi";
const purchaseBillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    indexPB: builder.query({
      query: (params) => ({
        url: `/transactions/purchaseBills?page=${params?.page || 1}`,
        method: "get",
        params: params,
      }),
      providesTags: (rslt, err, arg) =>
        rslt?.data
          ? [...rslt.data.map((j) => ({ type: "AcTransfer", id: j.id }))]
          : ["AcTransfers"],
    }),
    storePB: builder.mutation({
      query: (data) => ({
        url: "/transactions/purchaseBills",
        method: "post",
        data: data,
      }),
      invalidatesTags: (rslt, err, arg) => (rslt ? ["AcTransfers"] : []),
    }),
    updatePB: builder.mutation({
      query: (params) => ({
        url: "/transactions/purchaseBills/1",
        method: "put",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) => [
        { type: "AcTransfer", id: arg.trans },
      ],
    }),
    destroyPB: builder.mutation({
      query: (params) => ({
        url: "/transactions/purchaseBills/1",
        method: "DELETE",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) =>
        rslt ? [{ type: "AcTransfer", id: arg.trans_no }] : [],
    }),
    createPB: builder.query({
      query: (params) => ({
        url: "/transactions/purchaseBills/create",
        method: "get",
        params: params,
      }),
    }),
    showPB: builder.query({
      query: (params) => ({
        url: "/transactions/purchaseBills/1",
        method: "get",
        params: params,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});
export const {
  useIndexPBQuery,
  useStorePBMutation,
  useUpdatePBMutation,
  useDestroyPBMutation,
  useCreatePBQuery,
  useShowPBQuery,
} = purchaseBillApi;
export default purchaseBillApi;

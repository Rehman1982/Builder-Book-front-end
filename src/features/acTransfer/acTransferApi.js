import { baseApi } from "../baseApi/baseApi";
const acTransferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    indexAcTransfer: builder.query({
      query: (params) => ({
        url: `/transactions/oprtransfer?page=${params?.page || 1}`,
        method: "get",
        params: params,
      }),
      providesTags: (rslt, err, arg) =>
        rslt?.data
          ? [...rslt.data.map((j) => ({ type: "AcTransfer", id: j.id }))]
          : ["AcTransfers"],
    }),
    storeAcTransfer: builder.mutation({
      query: (data) => ({
        url: "/transactions/oprtransfer",
        method: "post",
        data: data,
      }),
      invalidatesTags: (rslt, err, arg) => (rslt ? ["AcTransfers"] : []),
    }),
    updateAcTransfer: builder.mutation({
      query: (params) => ({
        url: "/transactions/oprtransfer/1",
        method: "put",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) => [
        { type: "AcTransfer", id: arg.trans },
      ],
    }),
    destroyAcTransfer: builder.mutation({
      query: (params) => ({
        url: "/transactions/oprtransfer/1",
        method: "DELETE",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) =>
        rslt ? [{ type: "AcTransfer", id: arg.trans_no }] : [],
    }),
    createAcTransfer: builder.query({
      query: (params) => ({
        url: "/transactions/oprtransfer/create",
        method: "get",
        params: params,
      }),
    }),
    showAcTransfer: builder.query({
      query: (params) => ({
        url: "/transactions/oprtransfer/1",
        method: "get",
        params: params,
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useIndexAcTransferQuery,
  useStoreAcTransferMutation,
  useUpdateAcTransferMutation,
  useDestroyAcTransferMutation,
  useCreateAcTransferQuery,
  useShowAcTransferQuery,
} = acTransferApi;
export default acTransferApi;

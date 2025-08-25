import { baseApi } from "../baseApi/baseApi";

const sharesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allShares: builder.query({
      query: (params) => ({
        url: "/management/shares",
        method: "Get",
        params: params,
      }),
      providesTags: ["Shares"],
    }),
    createShare: builder.query({
      query: (params) => ({
        url: "/management/shares/create",
        method: "GET",
        params: params,
      }),
    }),
    storeShare: builder.mutation({
      query: (params) => ({
        url: "/management/shares",
        method: "post",
        data: params,
      }),
      invalidatesTags: ["Shares"],
    }),
    updateShare: builder.mutation({
      query: (params) => ({
        url: "/management/shares/update",
        method: "PUT",
        params: params,
      }),
      invalidatesTags: ["Shares"],
    }),
    destroyShare: builder.mutation({
      query: (params) => ({
        url: "/management/shares/destroy",
        method: "DELETE",
        params: params,
      }),
      invalidatesTags: ["Shares"],
    }),
  }),
});
export const {
  useAllSharesQuery,
  useCreateShareQuery,
  useDestroyShareMutation,
  useUpdateShareMutation,
  useStoreShareMutation,
} = sharesApi;
export default sharesApi;

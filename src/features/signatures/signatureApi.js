import { baseApi } from "../baseApi/baseApi";

const signatureApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    index: builder.query({
      query: (params) => ({
        url: "signatures",
        method: "GET",
        params: params,
      }),
      providesTags: ["Signatures"],
    }),
    showSignature: builder.query({
      query: (params) => ({
        url: "signatures/show",
        method: "GET",
        params: params,
      }),
    }),
    store: builder.mutation({
      query: (params) => ({
        url: "signatures",
        method: "POST",
        data: params,
      }),
      invalidatesTags: ["Signatures"],
    }),
    update: builder.mutation({
      query: (params) => ({
        url: "signatures",
        method: "PUT",
        data: params,
      }),
      invalidatesTags: ["Signatures"],
    }),
    destroy: builder.mutation({
      query: (params) => ({
        url: "signatures",
        method: "DELETE",
        data: params,
      }),
      invalidatesTags: ["Signatures"],
    }),
    inject: builder.mutation({
      query: (params) => ({
        url: "signatures/inject",
        method: "POST",
        data: params,
      }),
      invalidatesTags: ["Signatures"],
    }),
    approve: builder.mutation({
      query: (params) => ({
        url: "signatures/approve",
        method: "POST",
        data: params,
      }),
      invalidatesTags: ["Signatures"],
    }),
    reject: builder.mutation({
      query: (params) => ({
        url: "signatures/reject",
        method: "POST",
        data: params,
      }),
      invalidatesTags: ["Signatures"],
    }),
  }),
});
export const {
  useIndexQuery,
  useShowSignatureQuery,
  useStoreMutation,
  useUpdateMutation,
  useDestroyMutation,
  useInjectMutation,
  useApproveMutation,
  useRejectMutation,
} = signatureApi;
export default signatureApi;

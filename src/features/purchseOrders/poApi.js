import { baseApi } from "../baseApi/baseApi";

const poApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPOs: builder.query({
      query: (args) => ({
        url: "/PO",
        method: "GET",
        params: args,
      }),
    }),
    createPO: builder.mutation({
      query: (po) => ({
        url: "/PO",
        method: "POST",
        params: po,
      }),
    }),
    showPO: builder.mutation({
      query: (id) => ({
        url: `/PO/${id}`,
        method: "GET",
      }),
    }),
    editPO: builder.mutation({
      query: (args) => ({
        url: "/PO/1/edit",
        method: "GET",
        params: args,
      }),
    }),
    updatePO: builder.mutation({
      query: (args) => ({
        url: `/PO/${args.id}`,
        method: "PUT",
        params: args.po,
      }),
    }),
    deletePO: builder.mutation({
      query: (id) => ({
        url: `/PO/${id}`,
        method: "DELETE",
      }),
    }),
    getPartials: builder.query({
      query: () => ({
        url: "/PO/create",
        method: "get",
      }),
    }),
  }),
});

export const {
  useGetPOsQuery,
  useCreatePOMutation,
  useShowPOMutation,
  useUpdatePOMutation,
  useDeletePOMutation,
  useGetPartialsQuery,
  useEditPOMutation,
} = poApi;
export default poApi;

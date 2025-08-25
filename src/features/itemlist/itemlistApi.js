import { baseApi } from "../baseApi/baseApi";

const itemlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allItems: builder.query({
      query: (params) => ({
        url: "/item",
        method: "get",
        params: params,
      }),
      providesTags: (rslt, err, arg) =>
        rslt
          ? [
              ...rslt?.map((v) => ({ type: "Item", id: v.id })),
              { type: "Items" },
            ]
          : [],
    }),
    showItem: builder.query({
      query: (params) => ({
        url: "/item/show",
        method: "get",
        params: params,
      }),
    }),
    getPartials: builder.query({
      query: (params) => ({
        url: "/item/create",
        method: "get",
        params: params,
      }),
    }),
    storeItem: builder.mutation({
      query: (params) => ({
        url: "/item",
        method: "POST",
        data: params,
      }),
      invalidatesTags: [{ type: "Items" }],
    }),
    updateItem: builder.mutation({
      query: (params) => ({
        url: "/item/1",
        method: "put",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) => [{ type: "Item", id: arg.id }],
    }),
    destroyItem: builder.mutation({
      query: (params) => ({
        url: "/item/1",
        method: "DELETE",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) => [{ type: "Item", id: arg.id }],
    }),
    changeParentItem: builder.mutation({
      query: (params) => ({
        url: "/changeParent",
        method: "POST",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) => [{ type: "Item", id: arg.id }],
    }),
  }),
});

export const {
  useAllItemsQuery,
  useShowItemQuery,
  useGetPartialsQuery,
  useStoreItemMutation,
  useUpdateItemMutation,
  useDestroyItemMutation,
  useChangeParentItemMutation,
} = itemlistApi;
export default itemlistApi;

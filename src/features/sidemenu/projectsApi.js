import { baseApi } from "../baseApi/baseApi";

const sidemenuApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    indexMenu: builder.query({
      query: (params) => ({
        url: "/menu",
        method: "Get",
        params: params,
      }),
      providesTags: (result, error, args) =>
        result
          ? [...result.map((v) => ({ type: "MenuItem", id: v.id }))]
          : ["MenuItems"],
    }),
    getControllersMenu: builder.query({
      query: (params) => ({
        url: "/menu/create",
        method: "Get",
        params: params,
      }),
    }),
    storeMenu: builder.mutation({
      query: (params) => ({
        url: "/menu",
        method: "post",
        params: params,
      }),
      invalidatesTags: (reslt, error, arg) => [
        { type: "MenuItem", id: arg.id },
      ],
    }),
  }),
});

export const {
  useIndexMenuQuery,
  useGetControllersMenuQuery,
  useStoreMenuMutation,
  // useCreateQuery,
  // useDestroyMutation,
  // useUpdateMutation,
  // useStoreMutation,
} = sidemenuApi;
export default sidemenuApi;

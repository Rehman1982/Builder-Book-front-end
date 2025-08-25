import { baseApi } from "../baseApi/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/management/users",
        method: "Get",
        params: params,
      }),
      providesTags: ["Users"],
    }),
    createUser: builder.query({
      query: (params) => ({
        url: "/management/users/create",
        method: "GET",
        params: params,
      }),
    }),
    storeUser: builder.mutation({
      query: (params) => ({
        url: "/management/users",
        method: "post",
        data: params,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: (params) => ({
        url: "/management/users/update",
        method: "PUT",
        params: params,
      }),
      invalidatesTags: ["Users"],
    }),
    destroyUser: builder.mutation({
      query: (params) => ({
        url: "/management/users/destroy",
        method: "DELETE",
        params: params,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useCreateUserQuery,
  useStoreUserMutation,
  useUpdateUserMutation,
  useDestroyUserMutation,
} = userApi;
export default userApi;

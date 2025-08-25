import { baseApi } from "../baseApi/baseApi";

const privilegeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPrivileges: builder.query({
      query: (params) => ({
        url: "/management/privileges",
        method: "Get",
        params: params,
      }),
      providesTags: (result, error, arg) =>
        result
          ? [
              ...result.map((v, i) => ({
                type: "Privilege",
                id: v.controller_id,
              })),
            ]
          : [],
    }),
    showPrivilege: builder.query({
      query: (params) => ({
        url: "/management/privileges/show",
        method: "GET",
        params: params,
      }),
      providesTags: (rslt, err, arg) =>
        rslt ? [...rslt.map((v) => ({ type: "PrvProject", id: v.id }))] : [],
    }),
    storePrivilege: builder.mutation({
      query: (params) => ({
        url: "/management/privileges",
        method: "post",
        data: params,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Privilege", id: arg.controller_id },
        { type: "PrvProject", id: arg.project_id },
      ],
    }),
    updatePrivilege: builder.mutation({
      query: (params) => ({
        url: "/management/coa/update",
        method: "PUT",
        params: params,
      }),
    }),
    destroyPrivilege: builder.mutation({
      query: (params) => ({
        url: "/management/coa/destroy",
        method: "DELETE",
        params: params,
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetAllPrivilegesQuery,
  useShowPrivilegeQuery,
  useDestroyPrivilegeMutation,
  useUpdatePrivilegeMutation,
  useStorePrivilegeMutation,
} = privilegeApi;
export default privilegeApi;

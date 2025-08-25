import { baseApi } from "../baseApi/baseApi";

const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allProjects: builder.query({
      query: (params) => ({
        url: "/management/projects",
        method: "Get",
        params: params,
      }),
      providesTags: ["Projects"],
    }),
    create: builder.query({
      query: (params) => ({
        url: "/management/projects/create",
        method: "GET",
        params: params,
      }),
    }),
    store: builder.mutation({
      query: (params) => ({
        url: "/management/projects",
        method: "post",
        data: params,
      }),
      invalidatesTags: ["Projects"],
    }),
    update: builder.mutation({
      query: (params) => ({
        url: "/management/projects/update",
        method: "PUT",
        params: params,
      }),
      invalidatesTags: ["Projects"],
    }),
    destroy: builder.mutation({
      query: (params) => ({
        url: "/management/projects/destroy",
        method: "DELETE",
        params: params,
      }),
      invalidatesTags: ["Projects"],
    }),
  }),
});

export const {
  useAllProjectsQuery,
  useCreateQuery,
  useDestroyMutation,
  useUpdateMutation,
  useStoreMutation,
} = projectsApi;
export default projectsApi;

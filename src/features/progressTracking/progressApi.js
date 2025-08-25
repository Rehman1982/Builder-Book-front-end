import { baseApi } from "../baseApi/baseApi";

const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    projectsWithoutSchecuels: builder.query({
      query: (params) => ({
        url: "/trackflow/progressTracking",
        method: "get",
        params: { type: "projects" },
      }),
    }),
    projectsWithSchecuels: builder.query({
      query: (params) => ({
        url: "/trackflow/progressTracking",
        method: "get",
        params: params,
      }),
    }),
    showProgress: builder.query({
      query: (params) => ({
        url: "/trackflow/progressTracking/show",
        method: "get",
        params: params,
      }),
    }),

    // showCompany: builder.query({
    //   query: (params) => ({
    //     url: "/company/1",
    //     method: "get",
    //     params: params,
    //   }),
    // }),
    // storeCompany: builder.mutation({
    //   query: (params) => ({
    //     url: "/company",
    //     method: "POST",
    //     params: params,
    //   }),
    // }),
    // updateCompany: builder.mutation({
    //   query: (params) => ({
    //     url: "/company",
    //     method: "PUT",
    //     params: params,
    //   }),
    // }),
    // activateCompany: builder.mutation({
    //   query: (params) => ({
    //     url: "/company/activate",
    //     method: "post",
    //     params: params,
    //   }),
    // }),
    // userResponce: builder.mutation({
    //   query: (params) => ({
    //     url: "/company/user_response",
    //     method: "post",
    //     params: params,
    //   }),
    // }),
    // addUser: builder.mutation({
    //   query: (params) => ({
    //     url: "/company/adduser",
    //     method: "post",
    //     params: params,
    //   }),
    // }),
  }),
});

export const {
  useProjectsWithoutSchecuelsQuery,
  useProjectsWithSchecuelsQuery,
  useShowProgressQuery,
  //   useShowCompanyQuery,
  //   useStoreCompanyMutation,
  //   useUpdateCompanyMutation,
  //   useActivateCompanyMutation,
  //   useUserResponceMutation,
  //   useAddUserMutation,
} = progressApi;
export default progressApi;

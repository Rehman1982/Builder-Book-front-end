import { baseApi } from "../baseApi/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credintials) => ({
        url: "/login",
        method: "post",
        params: credintials,
      }),
    }),
    register: builder.mutation({
      query: (credintials) => ({
        url: "/register",
        method: "post",
        params: credintials,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    me: builder.mutation({
      query: () => ({
        url: "/me",
        method: "get",
        params: {},
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useMeMutation,
  useRegisterMutation,
} = authApi;
export default authApi;

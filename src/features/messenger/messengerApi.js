import { baseApi } from "../baseApi/baseApi";

export const messengarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (params) => ({
        url: "messenger",
        method: "GET",
        params: params,
      }),
      providesTags: ["Messeges"],
    }),
    storeMessage: builder.mutation({
      query: (params) => ({
        url: "messenger",
        method: "POST",
        data: params,
      }),
      invalidatesTags: ["Messeges"],
    }),
  }),
});
export const { useGetMessagesQuery, useStoreMessageMutation } = messengarApi;

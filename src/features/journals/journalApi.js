import { baseApi } from "../baseApi/baseApi";
const journalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    indexJournal: builder.query({
      query: (params) => ({
        url: `/transactions/journal?page=${params?.page || 1}`,
        method: "get",
        params: params,
      }),
      providesTags: (rslt, err, arg) =>
        rslt?.data
          ? [...rslt.data.map((j) => ({ type: "Journal", id: j.id }))]
          : ["Journals"],
    }),
    storeJournal: builder.mutation({
      query: (data) => ({
        url: "/transactions/journal",
        method: "post",
        data: data,
      }),
      invalidatesTags: (rslt, err, arg) => [{ type: "Journal", id: arg.trans }],
    }),
    updateJournal: builder.mutation({
      query: (params) => ({
        url: "/transactions/journal",
        method: "put",
        params: params,
      }),
    }),
    destroyJournal: builder.mutation({
      query: (params) => ({
        url: "/transactions/journal/1",
        method: "DELETE",
        data: params,
      }),
      invalidatesTags: (rslt, err, arg) =>
        rslt ? [{ type: "Journal", id: arg.trans_no }] : [],
    }),
    showJournal: builder.query({
      query: (params) => ({
        url: "/transactions/journal/1",
        method: "get",
        params: params,
      }),
    }),
    createJournal: builder.query({
      query: (params) => ({
        url: "/transactions/journal/create",
        method: "get",
        params: params,
      }),
    }),
  }),
});

export const {
  useLazyIndexJournalQuery,
  useIndexJournalQuery,
  useStoreJournalMutation,
  useUpdateJournalMutation,
  useDestroyJournalMutation,
  useLazyShowJournalQuery,
  useCreateJournalQuery,
} = journalApi;
export default journalApi;

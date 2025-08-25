import { baseApi } from "../baseApi/baseApi";

const dashApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    plOverview: builder.query({
      query: (params) => ({
        url: "/main/PLOverview",
        method: "get",
        params: params,
      }),
    }),
    expenseOverview: builder.query({
      query: (params) => ({
        url: "/main/expenseoverview",
        method: "get",
        params: params,
      }),
    }),
    vitals: builder.query({
      query: () => ({
        url: "/main/vitals",
        method: "get",
      }),
    }),
    cards: builder.query({
      query: () => ({
        url: "/main/cards",
        method: "get",
      }),
    }),
  }),
});

export const {
  usePlOverviewQuery,
  useExpenseOverviewQuery,
  useVitalsQuery,
  useCardsQuery,
} = dashApi;
export default dashApi;

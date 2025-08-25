import { baseApi } from "../baseApi/baseApi";

const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    reportPartials: builder.query({
      query: (params) => ({
        url: "/reports/partials",
        method: "Get",
        params: params,
      }),
    }),
    reportPlbyProject: builder.query({
      query: (params) => ({
        url: "/reports/profitloss/byproject",
        method: "Get",
        params: params,
      }),
    }),
    reportPlbyAccount: builder.query({
      query: (params) => ({
        url: "/reports/profitloss/byaccount",
        method: "Get",
        params: params,
      }),
    }),
    reportPlbyBusiness: builder.query({
      query: (params) => ({
        url: "/reports/profitloss/bybusiness",
        method: "Get",
        params: params,
      }),
    }),
    reportTrailbalance: builder.query({
      query: (params) => ({
        url: "/reports/trailbalance",
        method: "Get",
        params: params,
      }),
    }),
    reportBalancesheet: builder.query({
      query: (params) => ({
        url: "/reports/balancesheet",
        method: "Get",
        params: params,
      }),
    }),
    reportMulty: builder.query({
      query: (params) => ({
        url: `${params.url}`,
        method: "Get",
        params: params,
      }),
    }),

    reportCashflow: builder.query({
      query: (params) => ({
        url: "/reports/cashflow",
        method: "Get",
        params: params,
      }),
    }),
    reportEquitychange: builder.query({
      query: (params) => ({
        url: "/reports/equitychange",
        method: "Get",
        params: params,
      }),
    }),
    reportShareholderpl: builder.query({
      query: (params) => ({
        url: "/reports/shareholderpl",
        method: "Get",
        params: params,
      }),
    }),
  }),
});

export const {
  useReportPartialsQuery,
  useReportPlbyProjectQuery,
  useReportPlbyAccountQuery,
  useReportPlbyBusinessQuery,
  useReportTrailbalanceQuery,
  useReportBalancesheetQuery,
  useReportMultyQuery,
  useReportCashflowQuery,
  useReportEquitychangeQuery,
  useReportShareholderplQuery,
} = reportApi;
export default reportApi;

// src/utils/axiosBaseQuery.js
import axios from "axios";
import API from "../api/axiosApi";

export const axiosBaseQuery =
    () =>
    async ({ url, method, data, params }) => {
        try {
            const result = await API({
                url: url,
                method,
                data,
                params,
            });
            return { data: result.data };
        } catch (axiosError) {
            return {
                error: {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data || axiosError.message,
                },
            };
        }
    };

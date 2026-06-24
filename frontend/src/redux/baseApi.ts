import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";
import { CONFIG } from "@/config";

const baseQuery = fetchBaseQuery({
  baseUrl: CONFIG.API_PATH,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) headers.set("admin-authorization", `${token}`);
    return headers;
  },
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  endpoints: () => ({}),
  tagTypes: [
    "user",
    "contact",
    "message",
    "generalSetting",
    "banner",
    "gtm",
    "about",
    "team",
    "teamCategory",
    "seo",
    "blogs",
    "service",
    "gallery",
    "notice",
    "appointment",
    "privacyPolicy",
    "termCondition",
    "campaign",
    "testimonial",
    "packages",
    "smtpConfig",
  ],
});

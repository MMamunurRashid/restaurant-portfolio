import { baseApi } from "@/redux/baseApi";
import type { ISmtpConfig } from "@/interface/smtpConfigInterface";

export const smtpConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSmtpConfig: builder.query({
      query: () => ({
        url: "/smtp-config",
      }),
      providesTags: ["smtpConfig"],
    }),

    updateSmtpConfig: builder.mutation({
      query: (data: ISmtpConfig) => ({
        url: "/smtp-config/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["smtpConfig"],
    }),
  }),
});

export const { useGetSmtpConfigQuery, useUpdateSmtpConfigMutation } =
  smtpConfigApi;

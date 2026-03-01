import { baseApi } from "@/redux/baseApi";

export const privacyPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPrivacyPolicy: builder.mutation({
      query: (data) => ({
        url: `/privacy-policy/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["privacyPolicy"],
    }),

    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/privacy-policy",
      }),
      providesTags: ["privacyPolicy"],
    }),

    updatePrivacyPolicy: builder.mutation({
      query: ({ data, id }) => ({
        url: `/privacy-policy/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["privacyPolicy"],
    }),
  }),
});

export const {
  useAddPrivacyPolicyMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} = privacyPolicyApi;

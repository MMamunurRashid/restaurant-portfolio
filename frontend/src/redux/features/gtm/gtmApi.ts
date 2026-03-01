import { baseApi } from "@/redux/baseApi";

export const gtmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addGtmConfig: builder.mutation({
      query: (data) => ({
        url: `/gtm/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["gtm"],
    }),

    getGtmConfig: builder.query({
      query: () => ({
        url: "/gtm",
      }),
      providesTags: ["gtm"],
    }),

    updateGtmConfig: builder.mutation({
      query: ({ data, id }) => ({
        url: `/gtm/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["gtm"],
    }),
  }),
});

export const {
  useAddGtmConfigMutation,
  useGetGtmConfigQuery,
  useUpdateGtmConfigMutation,
} = gtmApi;

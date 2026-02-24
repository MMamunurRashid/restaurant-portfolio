import { apiSlice } from "./api/apiSlice";

export const topCampaignBannerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addTopCampaignBanner: builder.mutation({
      query: (formData) => ({
        url: `/topCampaignBanner/add`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["topCampaignBanner"],
    }),

    getTopCampaignBanners: builder.query({
      query: () => ({
        url: "/topCampaignBanner",
      }),
      providesTags: ["topCampaignBanner"],
    }),

    updateTopCampaignBanner: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/topCampaignBanner/update/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["topCampaignBanner"],
    }),
  }),
});

export const {
  useAddTopCampaignBannerMutation,
  useGetTopCampaignBannersQuery,
  useUpdateTopCampaignBannerMutation,
} = topCampaignBannerApi;

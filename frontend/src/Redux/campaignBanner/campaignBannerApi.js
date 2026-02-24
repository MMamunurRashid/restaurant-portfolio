import { apiSlice } from "../api/apiSlice";

export const campaignBannerApi = apiSlice.injectEndpoints({
  tagTypes: ["campaignBanner"],
  endpoints: (builder) => ({
    addCampaignBanner: builder.mutation({
      query: (formData) => ({
        url: `/campaignBanner/add`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["campaignBanner"],
    }),

    getCampaignBanners: builder.query({
      query: () => ({
        url: "/campaignBanner/all",
      }),
      providesTags: ["campaignBanner"],
    }),

    deleteCampaignBanner: builder.mutation({
      query: (id) => ({
        url: `/campaignBanner/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["campaignBanner"],
    }),

    getCampaignBannerById: builder.query({
      query: (id) => ({
        url: `/campaignBanner/single/${id}`,
      }),
      providesTags: ["campaignBanner"],
    }),

    editCampaignBanner: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/campaignBanner/edit/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["campaignBanner"],
    }),
  }),
});

export const {
  useAddCampaignBannerMutation,
  useGetCampaignBannersQuery,
  useGetCampaignBannerByIdQuery,
  useDeleteCampaignBannerMutation,
  useEditCampaignBannerMutation,
} = campaignBannerApi;

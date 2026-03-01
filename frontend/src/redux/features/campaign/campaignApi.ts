import { baseApi } from "@/redux/baseApi";

export const CampaignApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCampaign: builder.mutation({
      query: (data) => ({
        url: `/campaign/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["campaign"],
    }),

    getCampaign: builder.query({
      query: () => ({
        url: "/campaign",
      }),
      providesTags: ["campaign"],
    }),

    updateCampaign: builder.mutation({
      query: ({ data, id }) => ({
        url: `/campaign/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["campaign"],
    }),
  }),
});

export const { useAddCampaignMutation, useGetCampaignQuery, useUpdateCampaignMutation } =
  CampaignApi;

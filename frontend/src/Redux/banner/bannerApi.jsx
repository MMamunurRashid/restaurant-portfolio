import { apiSlice } from "../api/apiSlice";

export const bannerApi = apiSlice.injectEndpoints({
  tagTypes: ["banner"],
  endpoints: (builder) => ({
    addBanner: builder.mutation({
      query: (formData) => ({
        url: `/banner/add-banner`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["banner"],
    }),
    getBanners: builder.query({
      query: () => ({
        url: "/banner/all-banners",
      }),
      providesTags: ["banner"],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banner"],
    }),
    getBannerById: builder.query({
      query: (id) => ({
        url: `/banner/single/${id}`,
      }),
      providesTags: ["banner"],
    }),
    editBanner: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/banner/edit/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["banner"],
    }),
  }),
});

export const {
  useAddBannerMutation,
  useGetBannersQuery,
  useDeleteBannerMutation,
  useGetBannerByIdQuery,
  useEditBannerMutation,
} = bannerApi;

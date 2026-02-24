import { apiSlice } from "../api/apiSlice";

export const BrandApi = apiSlice.injectEndpoints({
  tagTypes: ["brand"],
  endpoints: (builder) => ({
    addBrand: builder.mutation({
      query: (formData) => ({
        url: `/brand/add`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["campaignBanner"],
    }),
    allBrands: builder.query({
      query: () => ({
        url: `/brand/allBrands`,
      }),
      providesTags: ["campaignBanner"],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `/brand/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["campaignBanner"],
    }),
    brandById: builder.query({
      query: (id) => ({
        url: `/brand/single/${id}`,
      }),
      providesTags: ["campaignBanner"],
    }),
    editBrand: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/brand/edit/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["campaignBanner"],
    }),
  }),
});

export const {
  useAddBrandMutation,
  useAllBrandsQuery,
  useDeleteBrandMutation,
  useBrandByIdQuery,
  useEditBrandMutation,
} = BrandApi;

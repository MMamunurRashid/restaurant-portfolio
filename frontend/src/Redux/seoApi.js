import { apiSlice } from "./api/apiSlice";

export const seoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addSEO: builder.mutation({
      query: (data) => ({
        url: `/seo/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["seo"],
    }),

    getSEO: builder.query({
      query: () => ({
        url: "/seo",
      }),
      providesTags: ["seo"],
    }),

    updateSEO: builder.mutation({
      query: ({ data, id }) => ({
        url: `/seo/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["seo"],
    }),
  }),
});

export const { useAddSEOMutation, useGetSEOQuery, useUpdateSEOMutation } =
  seoApi;

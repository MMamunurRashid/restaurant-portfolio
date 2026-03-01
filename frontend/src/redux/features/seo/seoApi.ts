import { baseApi } from "@/redux/baseApi";

export const seoApi = baseApi.injectEndpoints({
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

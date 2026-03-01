import { baseApi } from "@/redux/baseApi";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBanner: builder.mutation({
      query: (data) => ({
        url: "/banner/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),
    getAllBanner: builder.query({
      query: (query) => ({
        url: "/banner/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["banner"],
    }),
    getBannerById: builder.query({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "GET",
      }),
      providesTags: ["banner"],
    }),
    updateBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/banner/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["banner"],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["banner"],
    }),
  }),
});

export const {
  useAddBannerMutation,
  useGetAllBannerQuery,
  useGetBannerByIdQuery,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannerApi;

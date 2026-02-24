import { apiSlice } from "../api/apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (data) => ({
        url: `/review/add-review`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["review", "product"],
    }),

    getReviewsByProductId: builder.query({
      query: ({ productId, query }) => ({
        url: `/review/get-reviews-by-productId/${productId}`,
        method: "GET",
        params: query,
      }),
      providesTags: ["review", "product"],
    }),

    getReviewsByUserId: builder.query({
      query: ({ userId, query }) => ({
        url: `/review/get-reviews-by-user/${userId}`,
        method: "GET",
        params: query,
      }),
      providesTags: ["review", "product"],
    }),

    getAllReviews: builder.query({
      query: (query) => ({
        url: `/review/get-all-reviews`,
        method: "GET",
        params: query,
      }),
      providesTags: ["review", "product"],
    }),

    deleteReview: builder.mutation({
      query: ({ reviewId, data }) => ({
        url: `/review/delete-review/${reviewId}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["review", "product"],
    }),

    editReview: builder.mutation({
      query: ({data,id}) => ({
        url: `/review/update-review/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["review", "product"],
    }),
  }),
});

export const {
  useAddReviewMutation,
  useEditReviewMutation,
  useGetReviewsByProductIdQuery,
  useGetReviewsByUserIdQuery,
  useDeleteReviewMutation,
  useGetAllReviewsQuery,
} = reviewApi;

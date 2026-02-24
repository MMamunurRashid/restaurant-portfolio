import { apiSlice } from "../api/apiSlice";

export const couponApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addCoupon: builder.mutation({
      query: (coupon) => ({
        url: "/coupon/add",
        method: "POST",
        body: coupon,
      }),
      invalidatesTags: ["coupon"],
    }),

    getCoupons: builder.query({
      query: () => ({
        url: "/coupon/all",
      }),
      providesTags: ["coupon"],
    }),

    getCouponById: builder.query({
      query: (id) => ({
        url: `/coupon/single/${id}`,
      }),
      providesTags: ["coupon"],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/coupon/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["coupon"],
    }),

    editCoupon: builder.mutation({
      query: ({ id, coupon }) => ({
        url: `/coupon/edit/${id}`,
        method: "PATCH",
        body: coupon,
      }),
      invalidatesTags: ["coupon"],
    }),

    applyCoupon: builder.mutation({
      query: (couponInfo) => ({
        url: "/coupon/apply",
        method: "POST",
        body: couponInfo,
      }),
      invalidatesTags: ["coupon"],
    }),

    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/coupon/update/status/${id}`,
        method: "PUT",
        body: status,
      }),
      invalidatesTags: ["coupon"],
    }),
  }),
});

export const {
  useAddCouponMutation,
  useGetCouponsQuery,
  useDeleteCouponMutation,
  useGetCouponByIdQuery,
  useEditCouponMutation,
  useApplyCouponMutation,
  useUpdateStatusMutation,
} = couponApi;

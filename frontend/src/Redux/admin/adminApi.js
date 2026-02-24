import { apiSlice } from "../api/apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdmins: builder.query({
      query: () => ({
        url: "/admin/allAdmins",
      }),
      providesTags: ["admin"],
    }),

    getAdminById: builder.query({
      query: (id) => ({
        url: `/admin/${id}`,
      }),
      providesTags: ["admin"],
    }),

    addAdmin: builder.mutation({
      query: (info) => ({
        url: `/admin/add-admin`,
        method: "POST",
        body: info,
      }),
      invalidatesTags: ["admin"],
    }),

    deleteAdmin: builder.mutation({
      query: (id) => ({
        url: `/admin/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),

    updateAdminProfile: builder.mutation({
      query: ({ id, info }) => ({
        url: `/admin/update/profile/${id}`,
        method: "PATCH",
        body: info,
      }),
      invalidatesTags: ["admin"],
    }),

    updateAdminPassword: builder.mutation({
      query: ({ id, info }) => ({
        url: `/admin/update/password/${id}`,
        method: "PATCH",
        body: info,
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const {
  useGetAllAdminsQuery,
  useGetAdminByIdQuery,
  useAddAdminMutation,
  useDeleteAdminMutation,
  useUpdateAdminProfileMutation,
  useUpdateAdminPasswordMutation,
} = adminApi;

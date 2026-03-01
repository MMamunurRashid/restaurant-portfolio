import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (data) => ({
        url: `/user/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    getAllUser: builder.query({
      query: (query) => ({
        url: "/user/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["user"],
    }),
    getUserCount: builder.query({
      query: () => ({
        url: "/user/count",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    updateProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update/profile/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["user"],
    }),
    updatePassword: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update/password/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useAddUserMutation,
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useGetUserCountQuery,
} = userApi;

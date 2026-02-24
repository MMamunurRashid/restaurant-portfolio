import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allUsers: builder.query({
      query: () => ({
        url: "/user/allUsers",
      }),
      providesTags: ["users"],
    }),

    allCustomers: builder.query({
      query: () => ({
        url: "/user/allCustomers",
      }),
      providesTags: ["users"],
    }),

    editUserInfo: builder.mutation({
      query: ({ id, userInfo }) => ({
        url: `/user/update/info/${id}`,
        method: "PUT",
        body: userInfo,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useAllUsersQuery,
  useAllCustomersQuery,
  useEditUserInfoMutation,
} = userApi;

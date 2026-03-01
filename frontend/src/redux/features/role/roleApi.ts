import { baseApi } from "@/redux/baseApi";

export const roleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addRole: builder.mutation({
      query: (data) => ({
        url: "/role/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["role"],
    }),
    getAllRole: builder.query({
      query: () => ({
        url: "/role/all",
        method: "GET",
      }),
      providesTags: ["role"],
    }),
    getSingleRole: builder.query({
      query: (id) => ({
        url: `/role/${id}`,
        method: "GET",
      }),
      providesTags: ["role"],
    }),
    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `/role/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["role"],
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/role/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["role"],
    }),
  }),
});

export const {
  useAddRoleMutation,
  useGetAllRoleQuery,
  useGetSingleRoleQuery,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
} = roleApi;

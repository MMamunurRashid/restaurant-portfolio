import { baseApi } from "@/redux/baseApi";

export const teamCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTeamCategory: builder.mutation({
      query: (data) => ({
        url: "/team-category/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["teamCategory"],
    }),
    getAllTeamCategory: builder.query({
      query: (query) => ({
        url: "/team-category/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["teamCategory"],
    }),
    getTeamCategoryCount: builder.query({
      query: () => ({
        url: "/team-category/count",
        method: "GET",
      }),
      providesTags: ["teamCategory"],
    }),
    getTeamCategoryById: builder.query({
      query: (id) => ({
        url: `/team-category/${id}`,
        method: "GET",
      }),
      providesTags: ["teamCategory"],
    }),
    updateTeamCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/team-category/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["teamCategory"],
    }),
    deleteTeamCategory: builder.mutation({
      query: (id) => ({
        url: `/team-category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["teamCategory"],
    }),
  }),
});

export const {
  useAddTeamCategoryMutation,
  useGetAllTeamCategoryQuery,
  useGetTeamCategoryByIdQuery,
  useUpdateTeamCategoryMutation,
  useDeleteTeamCategoryMutation,
  useGetTeamCategoryCountQuery,
} = teamCategoryApi;

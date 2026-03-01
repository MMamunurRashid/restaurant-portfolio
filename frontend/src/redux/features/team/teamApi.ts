import { baseApi } from "@/redux/baseApi";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTeam: builder.mutation({
      query: (data) => ({
        url: "/team/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),
    getAllTeam: builder.query({
      query: (query) => ({
        url: "/team/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["team"],
    }),
    getTeamCount: builder.query({
      query: () => ({
        url: "/team/count",
        method: "GET",
      }),
      providesTags: ["team"],
    }),
    getTeamById: builder.query({
      query: (id) => ({
        url: `/team/${id}`,
        method: "GET",
      }),
      providesTags: ["team"],
    }),
    updateTeam: builder.mutation({
      query: ({ id, data }) => ({
        url: `/team/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["team"],
    }),
    deleteTeam: builder.mutation({
      query: (id) => ({
        url: `/team/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["team"],
    }),
  }),
});

export const {
  useAddTeamMutation,
  useGetAllTeamQuery,
  useGetTeamByIdQuery,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
  useGetTeamCountQuery,
} = teamApi;

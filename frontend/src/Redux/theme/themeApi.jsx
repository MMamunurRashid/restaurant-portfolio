import { apiSlice } from "../api/apiSlice";

export const themeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getThemes: builder.query({
      query: () => ({
        url: "/theme/get-themes",
      }),
      providesTags: ["theme"],
    }),
    updateTheme: builder.mutation({
      query: ({ id, data }) => ({
        url: `/theme/update-theme/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["theme"],
    }),
    addTheme: builder.mutation({
      query: (data) => ({
        url: `/theme/add-theme`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["theme"],
    }),
  }),
});

export const {
  useGetThemesQuery,
  useUpdateThemeMutation,
  useAddThemeMutation,
} = themeApi;

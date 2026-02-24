import { apiSlice } from "../api/apiSlice";

export const logoApi = apiSlice.injectEndpoints({
  tagTypes: ["mainLogo", "dashboardLogo"],
  endpoints: (builder) => ({
    getMainLogo: builder.query({
      query: () => ({
        url: "/logo",
      }),
      providesTags: ["mainLogo"],
    }),
    updateMainLogo: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/logo/update-logo/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["mainLogo"],
    }),
    addLogo: builder.mutation({
      query: (formData) => ({
        url: "/logo/add-logo",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["mainLogo"],
    }),
  }),
});

export const {
  useGetMainLogoQuery,
  useUpdateMainLogoMutation,
  useAddLogoMutation,
} = logoApi;

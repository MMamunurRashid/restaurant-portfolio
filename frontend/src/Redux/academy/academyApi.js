import { apiSlice } from "../api/apiSlice";

export const academyApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // Get all academies
    getAllAcademies: builder.query({
      query: (query) => ({
        url: `/academy`,
        method: "GET",
        params: query,
      }),
      providesTags: ["academy"],
    }),

    // Get academy by ID
    getAcademyById: builder.query({
      query: (id) => ({
        url: `/academy/${id}`,
        method: "GET",
      }),
      providesTags: ["academy"],
    }),

    // Get academy by slug
    getAcademyBySlug: builder.query({
      query: (slug) => ({
        url: `/academy/${slug}`,
        method: "GET",
      }),
      providesTags: ["academy"],
    }),

    // Add a new academy
    addAcademy: builder.mutation({
      query: (formData) => ({
        url: `/academy/add-academy`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["academy"],
    }),

    // Update an existing academy
    updateAcademy: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/academy/update-academy/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["academy"],
    }),

    // Delete an academy
    deleteAcademy: builder.mutation({
      query: (id) => ({
        url: `/academy/delete-academy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["academy"],
    }),
  }),
});

export const {
  useGetAllAcademiesQuery,
  useGetAcademyByIdQuery,
  useGetAcademyBySlugQuery,
  useAddAcademyMutation,
  useUpdateAcademyMutation,
  useDeleteAcademyMutation,
} = academyApi;

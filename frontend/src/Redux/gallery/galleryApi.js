import { apiSlice } from "../api/apiSlice";

export const galleryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGallery: builder.query({
      query: () => ({
        url: "/gallery",
      }),
      providesTags: ["gallery"],
    }),

    createGallery: builder.mutation({
      query: (formData) => ({
        url: `/gallery/add`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["gallery"], 
    }),

    DeleteGalleryById: builder.mutation({
      query: (id) => ({
        url: `/gallery/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["gallery"],
    }),

    GetGalleryById: builder.query({
      query: (id) => ({
        url: `/gallery/${id}`,
      }),
      providesTags: ["gallery"],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useCreateGalleryMutation,
  useDeleteGalleryByIdMutation,
  useGetGalleryByIdQuery,
} = galleryApi;

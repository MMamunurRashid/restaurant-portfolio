import { baseApi } from '@/redux/baseApi';

export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addGallery: builder.mutation({
      query: (data) => ({
        url: '/gallery/add',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['gallery'],
    }),
    getAllGallery: builder.query({
      query: (query) => ({
        url: '/gallery/all',
        method: 'GET',
        params: query,
      }),
      providesTags: ['gallery'],
    }),
    getGalleryCount: builder.query({
      query: () => ({
        url: '/gallery/counts',
        method: 'GET',
      }),
      providesTags: ['gallery'],
    }),
    getGalleryById: builder.query({
      query: (id) => ({
        url: `/gallery/${id}`,
        method: 'GET',
      }),
      providesTags: ['gallery'],
    }),
    updateGallery: builder.mutation({
      query: ({ id, data }) => ({
        url: `/gallery/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['gallery'],
    }),
    deleteGallery: builder.mutation({
      query: (id) => ({
        url: `/gallery/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['gallery'],
    }),
  }),
});

export const {
  useAddGalleryMutation,
  useGetAllGalleryQuery,
  useGetGalleryByIdQuery,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useGetGalleryCountQuery,
} = galleryApi;

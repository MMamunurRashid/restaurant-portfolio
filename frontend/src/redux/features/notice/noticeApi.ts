import { baseApi } from "@/redux/baseApi";

export const popupNoticeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNotice: builder.mutation({
      query: (data) => ({
        url: "/notice/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["notice"],
    }),
    getNotice: builder.query({
      query: (query) => ({
        url: "/notice",
        method: "GET",
        params: query,
      }),
      providesTags: ["notice"],
    }),
    getNoticeById: builder.query({
      query: (id) => ({
        url: `/notice/${id}`,
        method: "GET",
      }),
      providesTags: ["notice"],
    }),
    updateNotice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/notice/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["notice"],
    }),
    deleteNotice: builder.mutation({
      query: (id) => ({
        url: `/notice/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notice"],
    }),
  }),
});

export const {
  useAddNoticeMutation,
  useGetNoticeQuery,
  useGetNoticeByIdQuery,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = popupNoticeApi;

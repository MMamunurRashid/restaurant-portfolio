import { baseApi } from "@/redux/baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (data) => ({
        url: "/blogs/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blogs"],
    }),
    getAllBlogs: builder.query({
      query: (query) => ({
        url: "/blogs/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["blogs"],
    }),
    getBlogCount: builder.query({
      query: () => ({
        url: "/blogs/count",
        method: "GET",
      }),
      providesTags: ["blogs"],
    }),
    getBlogById: builder.query({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
      providesTags: ["blogs"],
    }),
    getBlogBySlug: builder.query({
      query: (slug) => ({
        url: `/blogs/slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["blogs"],
    }),
    updateBlog: builder.mutation({
      query: ({ id, data }) => ({
        url: `/blogs/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blogs"],
    }),
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blogs"],
    }),
    toggleBlogStatus: builder.mutation({
      query: (id) => ({
        url: `/blogs/toggle/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["blogs"],
    }),
  }),
});

export const {
  useAddBlogMutation,
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useToggleBlogStatusMutation,
  useGetBlogCountQuery,
} = blogApi;

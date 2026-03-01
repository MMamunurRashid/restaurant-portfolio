import { baseApi } from "@/redux/baseApi";

export const testimonialApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTestimonial: builder.mutation({
      query: (data) => ({
        url: "/testimonial/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["testimonial"],
    }),
    getAllTestimonial: builder.query({
      query: (query) => ({
        url: "/testimonial/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["testimonial"],
    }),
    getTestimonialCount: builder.query({
      query: () => ({
        url: "/testimonial/count",
        method: "GET",
      }),
      providesTags: ["testimonial"],
    }),
    getTestimonialById: builder.query({
      query: (id) => ({
        url: `/testimonial/${id}`,
        method: "GET",
      }),
      providesTags: ["testimonial"],
    }),
    updateTestimonial: builder.mutation({
      query: ({ id, data }) => ({
        url: `/testimonial/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["testimonial"],
    }),
    deleteTestimonial: builder.mutation({
      query: (id) => ({
        url: `/testimonial/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["testimonial"],
    }),
  }),
});

export const {
  useAddTestimonialMutation,
  useGetAllTestimonialQuery,
  useGetTestimonialByIdQuery,
  useUpdateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetTestimonialCountQuery,
} = testimonialApi;

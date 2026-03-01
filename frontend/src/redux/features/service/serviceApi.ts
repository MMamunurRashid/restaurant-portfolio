import { baseApi } from "@/redux/baseApi";

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation({
      query: (data) => ({
        url: "/service/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["service"],
    }),
    getAllService: builder.query({
      query: (query) => ({
        url: "/service/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["service"],
    }),
    getServiceCount: builder.query({
      query: () => ({
        url: "/service/count",
        method: "GET",
      }),
      providesTags: ["service"],
    }),
    getServiceById: builder.query({
      query: (id) => ({
        url: `/service/${id}`,
        method: "GET",
      }),
      providesTags: ["service"],
    }),
    getServiceBySlug: builder.query({
      query: (slug) => ({
        url: `/service/slug/${slug}`,
        method: "GET",
      }),
      providesTags: ["service"],
    }),
    updateService: builder.mutation({
      query: ({ id, data }) => ({
        url: `/service/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["service"],
    }),
    toggleStatusService: builder.mutation({
      query: (id) => ({
        url: `/service/toggle-active/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/service/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["service"],
    }),
  }),
});

export const {
  useAddServiceMutation,
  useGetAllServiceQuery,
  useGetServiceByIdQuery,
  useGetServiceBySlugQuery,
  useUpdateServiceMutation,
  useToggleStatusServiceMutation,
  useDeleteServiceMutation,
  useGetServiceCountQuery,
} = serviceApi;

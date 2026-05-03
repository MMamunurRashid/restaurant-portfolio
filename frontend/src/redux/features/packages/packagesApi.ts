import { baseApi } from "@/redux/baseApi";

export const contactPackageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPackage: builder.mutation({
      query: (data) => ({
        url: `/packages/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["packages"],
    }),
    getAllPackage: builder.query({
      query: (query) => ({
        url: "/packages/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["packages"],
    }),

    getPackageCount: builder.query({
      query: () => ({
        url: `/packages/counts`,
      }),
      providesTags: ["packages"],
    }),

    getPackageById: builder.query({
      query: (id) => ({
        url: `/packages/${id}`,
      }),
      providesTags: ["packages"],
    }),

    updatePackage: builder.mutation({
      query: ({ data, id }) => ({
        url: `/packages/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["packages"],
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["packages"],
    }),

    togglePopularPackage: builder.mutation({
      query: (id) => ({
        url: `/packages/toggle-popular/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["packages"],
    }),
    toggleFeaturedPackage: builder.mutation({
      query: (id) => ({
        url: `/packages/toggle-featured/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["packages"],
    }),
  }),
});

export const {
  useAddPackageMutation,
  useGetAllPackageQuery,
  useGetPackageByIdQuery,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useGetPackageCountQuery,
  useTogglePopularPackageMutation,
  useToggleFeaturedPackageMutation,
} = contactPackageApi;

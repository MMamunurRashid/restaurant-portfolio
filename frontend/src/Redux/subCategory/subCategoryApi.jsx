import { apiSlice } from "../api/apiSlice";

export const subCategoryApi = apiSlice.injectEndpoints({
  tagTypes: ["sub_category"],
  endpoints: (builder) => ({
    getSubCategories: builder.query({
      query: () => ({
        url: "/category/allSubCategories",
      }),
      providesTags: ["sub_category"],
    }),

    getSubCategory: builder.query({
      query: (id) => ({
        url: `/category/subCategory/${id}`,
      }),
    }),

    addSubCategory: builder.mutation({
      query: (data) => ({
        url: `/category/addSubCategory`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["sub_category"],
    }),

    updateSubCategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `/category/updateSubCategory/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["sub_category"],
    }),

    deleteSubCategory: builder.mutation({
      query: ({ id, categoryId }) => ({
        url: `/category/deleteSubCategory/${id}`,
        method: "DELETE",
        body: { categoryId },
      }),
      invalidatesTags: ["sub_category"],
    }),
  }),
});

export const {
  useGetSubCategoriesQuery,
  useGetSubCategoryQuery,
  useAddSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategoryApi;

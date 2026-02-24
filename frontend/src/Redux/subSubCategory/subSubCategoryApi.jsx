import { apiSlice } from "../api/apiSlice";

export const subSubCategoryApi = apiSlice.injectEndpoints({
  tagTypes: ["sub_subCategory"],
  endpoints: (builder) => ({
    getSubSubCategories: builder.query({
      query: () => ({
        url: "/category/allSubSubCategories",
      }),
      providesTags: ["sub_subCategory"],
    }),

    getSubSubCategory: builder.query({
      query: (id) => ({
        url: `/category/subSubCategory/${id}`,
      }),
    }),

    addSubSubCategory: builder.mutation({
      query: (data) => ({
        url: `/category/addSubSubCategory`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["sub_subCategory"],
    }),

    updateSubSubCategory: builder.mutation({
      query: ({ id, name }) => ({
        url: `/category/updateSubSubCategory/${id}`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["sub_subCategory"],
    }),

    deleteSubSubCategory: builder.mutation({
      query: ({ id, subCategoryId }) => ({
        url: `/category/deleteSubSubCategory/${id}`,
        method: "DELETE",
        body: { subCategoryId },
      }),
      invalidatesTags: ["sub_subCategory"],
    }),
  }),
});

export const {
  useGetSubSubCategoriesQuery,
  useGetSubSubCategoryQuery,
  useAddSubSubCategoryMutation,
  useUpdateSubSubCategoryMutation,
  useDeleteSubSubCategoryMutation,
} = subSubCategoryApi;

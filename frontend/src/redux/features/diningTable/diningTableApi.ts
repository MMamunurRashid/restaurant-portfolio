import { baseApi } from "@/redux/baseApi";
import type { IDiningTable } from "@/interface/diningTableInterface";

export const diningTableApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addDiningTable: builder.mutation({
      query: (data: Partial<IDiningTable>) => ({
        url: "/dining-table/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["diningTable"],
    }),

    getAllDiningTable: builder.query({
      query: (params) => ({
        url: "/dining-table/all",
        method: "GET",
        params,
      }),
      providesTags: ["diningTable"],
    }),

    updateDiningTable: builder.mutation({
      query: ({ id, data }) => ({
        url: `/dining-table/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["diningTable", "appointment"],
    }),

    deleteDiningTable: builder.mutation({
      query: (id) => ({
        url: `/dining-table/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["diningTable", "appointment"],
    }),
  }),
});

export const {
  useAddDiningTableMutation,
  useGetAllDiningTableQuery,
  useUpdateDiningTableMutation,
  useDeleteDiningTableMutation,
} = diningTableApi;

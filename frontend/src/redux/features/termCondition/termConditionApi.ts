import { baseApi } from "@/redux/baseApi";

export const termConditionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTermCondition: builder.mutation({
      query: (data) => ({
        url: `/term-condition/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["termCondition"],
    }),

    getTermCondition: builder.query({
      query: () => ({
        url: "/term-condition",
      }),
      providesTags: ["termCondition"],
    }),

    updateTermCondition: builder.mutation({
      query: ({ data, id }) => ({
        url: `/term-condition/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["termCondition"],
    }),
  }),
});

export const {
  useAddTermConditionMutation,
  useGetTermConditionQuery,
  useUpdateTermConditionMutation,
} = termConditionApi;

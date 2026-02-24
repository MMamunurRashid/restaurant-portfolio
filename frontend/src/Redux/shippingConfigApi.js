import { apiSlice } from "./api/apiSlice";

export const shippingConfigApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addShippingConfig: builder.mutation({
      query: (data) => ({
        url: `/shippingConfig/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["shippingConfig"],
    }),

    getShippingConfig: builder.query({
      query: () => ({
        url: "/shippingConfig",
      }),
      providesTags: ["shippingConfig"],
    }),

    updateShippingConfig: builder.mutation({
      query: ({ data, id }) => ({
        url: `/shippingConfig/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["shippingConfig"],
    }),
  }),
});

export const {
  useAddShippingConfigMutation,
  useGetShippingConfigQuery,
  useUpdateShippingConfigMutation,
} = shippingConfigApi;

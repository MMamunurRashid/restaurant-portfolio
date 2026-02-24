import { apiSlice } from "../api/apiSlice";

export const businessInfoApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessInfo: builder.query({
      query: () => ({
        url: "/businessInfo",
      }),
      providesTags: ["businessInfo"],
    }),
    addBusinessInfo: builder.mutation({
      query: (data) => ({
        url: `/businessInfo/add-info`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["businessInfo"],
    }),
    updateBusinessInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/businessInfo/update-info/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["businessInfo"],
    }),
  }),
});

export const {
  useGetBusinessInfoQuery,
  useAddBusinessInfoMutation,
  useUpdateBusinessInfoMutation,
} = businessInfoApi;

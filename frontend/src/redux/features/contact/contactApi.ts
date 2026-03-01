import { baseApi } from "@/redux/baseApi";

export const contactApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addContact: builder.mutation({
      query: (data) => ({
        url: `/contact/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["contact"],
    }),

    getContact: builder.query({
      query: () => ({
        url: "/contact",
      }),
      providesTags: ["contact"],
    }),

    updateContact: builder.mutation({
      query: ({ data, id }) => ({
        url: `/contact/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useAddContactMutation,
  useGetContactQuery,
  useUpdateContactMutation,
} = contactApi;

import { baseApi } from "@/redux/baseApi";

export const aboutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAbout: builder.mutation({
      query: (data) => ({
        url: `/about/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["about"],
    }),

    getAbout: builder.query({
      query: () => ({
        url: "/about",
      }),
      providesTags: ["about"],
    }),

    updateAbout: builder.mutation({
      query: ({ data, id }) => ({
        url: `/about/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["about"],
    }),
  }),
});

export const { useAddAboutMutation, useGetAboutQuery, useUpdateAboutMutation } =
  aboutApi;

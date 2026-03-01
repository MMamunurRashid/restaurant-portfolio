import { baseApi } from "@/redux/baseApi";

export const generalSettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addGeneralSetting: builder.mutation({
      query: (data) => ({
        url: `/general-setting/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["generalSetting"],
    }),

    getGeneralSetting: builder.query({
      query: () => ({
        url: "/general-setting",
      }),
      providesTags: ["generalSetting"],
    }),

    getGeneralSettingById: builder.query({
      query: (id) => ({
        url: `/general-setting/${id}`,
      }),
      providesTags: ["generalSetting"],
    }),

    updateGeneralSetting: builder.mutation({
      query: ({ data, id }) => ({
        url: `/general-setting/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["generalSetting"],
    }),
  }),
});

export const {
  useAddGeneralSettingMutation,
  useGetGeneralSettingQuery,
  useGetGeneralSettingByIdQuery,
  useUpdateGeneralSettingMutation,
} = generalSettingApi;

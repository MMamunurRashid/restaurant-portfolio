import { baseApi } from "@/redux/baseApi";

export const permissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPermissionRoutes: builder.query({
      query: () => ({
        url: `/permission-routes/all`,
      }),
      providesTags: ["permission"],
    }),
  }),
});

export const { useGetAllPermissionRoutesQuery } = permissionApi;

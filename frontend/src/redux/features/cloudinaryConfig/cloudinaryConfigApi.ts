import { baseApi } from "@/redux/baseApi";
import type { ICloudinaryConfig } from "@/interface/cloudinaryConfigInterface";

export const cloudinaryConfigApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCloudinaryConfig: builder.query({
      query: () => ({
        url: "/cloudinary-config",
      }),
      providesTags: ["cloudinaryConfig"],
    }),

    updateCloudinaryConfig: builder.mutation({
      query: (data: ICloudinaryConfig) => ({
        url: "/cloudinary-config/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["cloudinaryConfig"],
    }),
  }),
});

export const {
  useGetCloudinaryConfigQuery,
  useUpdateCloudinaryConfigMutation,
} = cloudinaryConfigApi;

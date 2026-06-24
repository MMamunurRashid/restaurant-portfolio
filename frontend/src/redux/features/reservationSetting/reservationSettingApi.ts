import { baseApi } from "@/redux/baseApi";
import type { IReservationSetting } from "@/interface/reservationSettingInterface";

export const reservationSettingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReservationSetting: builder.query({
      query: () => ({
        url: "/reservation-setting",
      }),
      providesTags: ["reservationSetting"],
    }),

    updateReservationSetting: builder.mutation({
      query: (data: IReservationSetting) => ({
        url: "/reservation-setting/update",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["reservationSetting", "appointment"],
    }),
  }),
});

export const {
  useGetReservationSettingQuery,
  useUpdateReservationSettingMutation,
} = reservationSettingApi;

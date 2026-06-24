import { baseApi } from "@/redux/baseApi";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addAppointment: builder.mutation({
      query: (data) => ({
        url: `/appointment/add`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["appointment"],
    }),
    getAllAppointment: builder.query({
      query: (query) => ({
        url: "/appointment/all",
        method: "GET",
        params: query,
      }),
      providesTags: ["appointment"],
    }),

    getAppointmentCount: builder.query({
      query: () => ({
        url: `/appointment/counts`,
      }),
      providesTags: ["appointment"],
    }),

    getAppointmentById: builder.query({
      query: (id) => ({
        url: `/appointment/${id}`,
      }),
      providesTags: ["appointment"],
    }),

    getAvailableSlots: builder.query({
      query: (params) => ({
        url: "/appointment/available-slots",
        method: "GET",
        params,
      }),
      providesTags: ["appointment"],
    }),

    updateAppointment: builder.mutation({
      query: ({ data, id }) => ({
        url: `/appointment/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["appointment"],
    }),
    markAppointmentAsRead: builder.mutation({
      query: (id) => ({
        url: `/appointment/mark-as-read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["appointment"],
    }),
    assignAppointmentTable: builder.mutation({
      query: ({ id, tableId }) => ({
        url: `/appointment/assign-table/${id}`,
        method: "PATCH",
        body: { tableId },
      }),
      invalidatesTags: ["appointment", "diningTable"],
    }),
    sendAppointmentReminder: builder.mutation({
      query: (id) => ({
        url: `/appointment/send-reminder/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["appointment"],
    }),
    deleteAppointment: builder.mutation({
      query: (id) => ({
        url: `/appointment/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["appointment"],
    }),
  }),
});

export const {
  useAddAppointmentMutation,
  useGetAllAppointmentQuery,
  useGetAppointmentByIdQuery,
  useGetAvailableSlotsQuery,
  useUpdateAppointmentMutation,
  useMarkAppointmentAsReadMutation,
  useAssignAppointmentTableMutation,
  useSendAppointmentReminderMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentCountQuery,
} = appointmentApi;

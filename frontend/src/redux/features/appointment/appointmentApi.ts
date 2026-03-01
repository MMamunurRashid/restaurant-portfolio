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

    updateAppointment: builder.mutation({
      query: ({ data, id }) => ({
        url: `/appointment/update/${id}`,
        method: "PATCH",
        body: data,
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
  useUpdateAppointmentMutation,
  useDeleteAppointmentMutation,
  useGetAppointmentCountQuery,
} = appointmentApi;

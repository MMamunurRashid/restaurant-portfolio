import { apiSlice } from "../api/apiSlice";

export const contactMsgApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllContactMsgs: builder.query({
      query: () => ({
        url: "/contactMsg",
        method: "GET",
      }),
      providesTags: ["ContactMsgs"],
    }),

    getContactMsgById: builder.query({
      query: (id) => ({
        url: `/contactMsg/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "ContactMsgs", id }],
    }),

    addContactMsg: builder.mutation({
        query: (newMessage) => ({
          url: "/contactMsg/add",
          method: "POST",
          body: newMessage,
        }),
        invalidatesTags: ["contactMessages"],
      }),

    deleteContactMsg: builder.mutation({
      query: (id) => ({
        url: `/contactMsg/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "ContactMsgs", id }],
    }),
  }),
});

export const {
  useGetAllContactMsgsQuery,
  useGetContactMsgByIdQuery,
  useAddContactMsgMutation,
  useDeleteContactMsgMutation,
} = contactMsgApi;

import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./userSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/user/register",
        method: "POST",
        body: userInfo,
      }),
    }),

    login: builder.mutation({
      query: (loginInfo) => ({
        url: "/user/login",
        method: "POST",
        body: loginInfo,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          if (result?.data?.success) {
            localStorage.setItem("ecommerce2_jwt", result?.data?.token);
            dispatch(
              userLoggedIn({
                token: result?.data?.token,
                data: result?.data,
              })
            );
          }
        } catch (error) {
          // Do not any thing , handel error from ui
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;

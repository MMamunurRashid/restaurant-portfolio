import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import cartSlice from "../cart/cartSlice";
import userSlice from "../user/userSlice";
import wishlistSlice from "../wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    user: userSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

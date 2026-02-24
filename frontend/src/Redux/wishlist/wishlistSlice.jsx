import { createSlice } from "@reduxjs/toolkit";

const wishlistValue = {
  wishlists: [],
};

const loadState = () => {
  const storedState = localStorage.getItem("wishlistState");

  return storedState ? JSON.parse(storedState) : wishlistValue;
};

const initialState = loadState();

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: initialState,
  reducers: {
    addToWishlist: (state, action) => {
      state.wishlists = action.payload;

      localStorage.setItem("wishlistState", JSON.stringify(state));
    },
    removeFromWishlist: (state, action) => {
      const { _id } = action.payload;
      state.wishlists = state.wishlists.filter((item) => item._id !== _id);

      localStorage.setItem("wishlistState", JSON.stringify(state));
    },
    clearWishlist: (state) => {
      state.wishlists = [];

      localStorage.setItem("wishlistState", JSON.stringify(state));
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;

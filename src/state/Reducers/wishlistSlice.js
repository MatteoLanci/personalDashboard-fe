import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  wishlist: [],
  wishElDeleted: [],
  loading: false,
  error: null,
  errorWishEl: null,
};

export const getUserWishlist = createAsyncThunk("user/wishlist", async (userId, thunkAPI) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}/wishlist`
    );
    return response.data.wishlist;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const handleNewUserWish = createAsyncThunk(
  "user/wishlist/new",
  async ({ userId, formData }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}/wishlist/create`,
        formData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const handleDeleteWishEl = createAsyncThunk(
  "user/wishlist/delete",
  async ({ userId, wishlistItemId }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}/wishlist/${wishlistItemId}/delete`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleDeleteWishEl.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleDeleteWishEl.fulfilled, (state, action) => {
        state.loading = false;
        state.wishElDeleted = action.payload;
      })
      .addCase(handleDeleteWishEl.rejected, (state, action) => {
        state.loading = false;
        state.errorWishEl = action.payload;
      })

      .addCase(getUserWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getUserWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const wishlistState = (state) => state.wishlist.wishlist;
export default wishlistSlice.reducer;

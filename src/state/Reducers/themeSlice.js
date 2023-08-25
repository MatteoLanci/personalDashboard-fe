import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";

import { useState } from "react";

const initialState = {
  theme: [],
  loading: false,
  error: null,
};

export const handleTheme = createAsyncThunk("theme/handleTheme", async (_, thunkAPI) => {
  try {
    const [theme, setTheme] = useState(false);
  } catch (error) {}
});

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleTheme.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleTheme.fulfilled, (state, action) => {
        state.loading = false;
        state.theme = action.payload;
      })
      .addCase(handleTheme.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const themeState = (state) => state.theme.theme;

export default themeSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userLocation: null,
  loading: false,
  error: null,
};

const userLocationSlice = createSlice({
  name: "userLocation",
  initialState,
  reducers: {
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUserLocation, setLoading, setError } = userLocationSlice.actions;
export default userLocationSlice.reducer;

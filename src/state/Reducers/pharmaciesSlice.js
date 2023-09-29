import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  pharmacies: [],
  loading: false,
  error: null,
};

export const handleGetPharmacies = createAsyncThunk(
  "/pharmacies",
  async (locationName, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVERBASE_URL}/scrape?locationName=${locationName}?f=apertura`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const pharmaciesSlice = createSlice({
  name: "pharmacies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleGetPharmacies.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleGetPharmacies.fulfilled, (state, action) => {
        state.loading = false;
        state.pharmacies = action.payload;
      })
      .addCase(handleGetPharmacies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const pharmaciesState = (state) => state.pharmacies.pharmacies;

export default pharmaciesSlice.reducer;

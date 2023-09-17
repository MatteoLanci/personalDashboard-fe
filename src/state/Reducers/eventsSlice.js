import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  events: [],
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (userCoordinates, thunkAPI) => {
    try {
      const response = await axios.get(
        `https://app.ticketmaster.com/discovery/v2/events?apikey=FMt04I9D8JeWAPqHCfURFj5sdF6FKBKj&latlong=${userCoordinates}&locale=*&size=15&page=2&`
      );

      return response.data._embedded.events;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const eventsState = (state) => state.events.events;

export default eventsSlice.reducer;

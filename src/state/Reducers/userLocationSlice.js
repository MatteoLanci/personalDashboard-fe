import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getGeoLocation = createAsyncThunk(
  "userLocation/getGeoLocation",
  async (_, { dispatch }) => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            dispatch(setLocation({ latitude, longitude }));
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Error getting user location:", error);
    }
  }
);

const userLocationSlice = createSlice({
  name: "userLocation",
  // Definisci lo stato iniziale
  initialState: {
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  },

  // Definisci i reducer per gestire le azioni
  reducers: {
    // Azione per impostare le coordinate dell'utente
    setLocation: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    // Altre azioni per gestire il caricamento e gli errori, se necessario
  },
});

export const { setLocation } = userLocationSlice.actions;
export default userLocationSlice.reducer;

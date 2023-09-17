import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userInfo: [],
  loading: false,
  error: null,
};

export const handleUpdateUserInfo = createAsyncThunk(
  "users/updateData",
  async ({ userId, dataToUpdate }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}`,
        dataToUpdate,
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const handleUpdateProfileCover = createAsyncThunk(
  "users/updateProfileCover",
  async ({ id, uploadedProfileCover, setProfileCoverUrl }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${id}`,
        { profileCover: uploadedProfileCover.profileCover },
        { headers: { "Content-Type": "application/json" } }
      );
      setProfileCoverUrl(uploadedProfileCover.profileCover);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getCoordinatesFromCity = createAsyncThunk(
  "users/getCoordinatesFromCity",
  async (cityName, thunkAPI) => {
    const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${cityName}`;
    try {
      const response = await axios.get(apiUrl);
      if (response.data.length > 0) {
        const firstResult = response.data[0];
        const latitude = parseFloat(firstResult.lat);
        const longitude = parseFloat(firstResult.lon);
        return { latitude, longitude };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const profileSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleUpdateUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleUpdateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(handleUpdateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const userInfoState = (state) => state.userInfo.userInfo;

export default profileSlice.reducer;

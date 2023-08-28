import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userInfo: [],
  loading: false,
  error: null,
};

export const handleUpdateUserInfo = createAsyncThunk(
  "users/updateData",
  async ({ id, dataToUpdate }, thunkAPI) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${id}`,
        dataToUpdate,
        { headers: { "Content-Type": "application/json" } }
      );

      return response.data;
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

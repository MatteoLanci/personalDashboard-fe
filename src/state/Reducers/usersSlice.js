import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: null,
  registrationError: null,
  registrationResponse: null,
};

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, thunkAPI) => {
  const token = JSON.parse(localStorage.getItem("userLogged"));
  try {
    const response = await axios.get(`${process.env.REACT_APP_SERVERBASE_URL}/users`, {
      headers: { Authorization: token },
    });
    return response.data.users;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/create`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationResponse = action.payload.message;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload;
      });
  },
});

export const usersState = (state) => state.users.users;

export default usersSlice.reducer;

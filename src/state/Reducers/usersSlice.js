import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  users: [],
  loading: false,
  error: null,
  registrationError: null,
  registrationResponse: null,
  loginError: null,
  loginResponse: null,
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

export const loginUser = createAsyncThunk("users/loginUser", async (loginData, thunkAPI) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_SERVERBASE_URL}/login`, loginData);

    if (response.data.token) {
      localStorage.setItem("userLogged", JSON.stringify(response.data.token));
      return response.data.token;
    } else {
      return thunkAPI.rejectWithValue("Login failed.");
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const handleDeleteAccount = createAsyncThunk(
  "users/userId/delete",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}/delete`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.userToken = action.payload; // Store the user token
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.userToken = null;
      });
  },
});

export const usersState = (state) => state.users.users;

export default usersSlice.reducer;

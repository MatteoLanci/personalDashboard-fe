import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  moneybox: [],
  transactions: [],
  loading: false,
  error: null,
  transactionsError: null,
};

export const getMoneybox = createAsyncThunk("moneybox/getMoneybox", async (userId, thunkAPI) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}/moneybox`
    );

    return response.data.moneybox;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getUserTransactions = createAsyncThunk(
  "moneybox/getTransactions",
  async ({ userId, moneyboxId }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}/moneybox/${moneyboxId}/transactions`
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const moneyboxSlice = createSlice({
  name: "moneybox",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMoneybox.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMoneybox.fulfilled, (state, action) => {
        state.loading = false;
        state.moneybox = action.payload;
      })
      .addCase(getMoneybox.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getUserTransactions.rejected, (state, action) => {
        state.loading = false;
        // state.transactionsError = action.payload;
      });
  },
});

export const moneyboxState = (state) => state.moneybox.moneybox;
export default moneyboxSlice.reducer;

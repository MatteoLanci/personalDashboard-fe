import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";

const initialState = {
  transactions: [],
  newTransactions: [],
  loading: false,
  error: null,
};

export const getUserTransactions = createAsyncThunk(
  "moneybox/getTransactions",
  async ({ userId, moneyboxId }, thunkAPI) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}/moneybox/${moneyboxId}/transactions`
      );
      return response.data.userTransactions.latestTransactions;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const handleNewTransaction = createAsyncThunk(
  "moneybox/newTransaction",
  async ({ userId, moneyboxId, transactionData }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${userId}/moneybox/${moneyboxId}/transactions/create`,
        transactionData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(getUserTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(handleNewTransaction.pending, (state) => {
        state.loading = true;
      })
      .addCase(handleNewTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.newTransactions = action.payload;
      })
      .addCase(handleNewTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const transactionState = (state) => state.transactions.transactions;
export default transactionsSlice.reducer;

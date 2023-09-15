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

export const handlePurchase = createAsyncThunk(
  "user/purchase",
  async (purchaseParams, thunkAPI) => {
    console.log(purchaseParams.userId);
    console.log(purchaseParams.moneyboxId);
    console.log(purchaseParams.productId);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVERBASE_URL}/users/${purchaseParams.userId}/${purchaseParams.moneyboxId}/${purchaseParams.productId}/purchase`
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
      })
      .addCase(handlePurchase.pending, (state) => {
        state.loading = true;
      })
      // .addCase(handlePurchase.fulfilled, (state, action) => {
      //   state.loading = false;

      //   if (action.payload.newTransactions) {
      //     state.transactions.push(action.payload);
      //   }
      // });
      .addCase(handlePurchase.fulfilled, (state, action) => {
        state.loading = false;

        const { newMoneyboxTotalAmount, transaction } = action.payload;

        // Cerca il moneybox corrispondente nel tuo stato
        const moneyboxIndex = state.transactions.findIndex(
          (moneybox) => moneybox._id === transaction.moneybox // Assumendo che il tuo payload contenga un riferimento al moneybox
        );

        if (moneyboxIndex !== -1) {
          // Aggiorna il totalAmount del moneybox
          state.transactions[moneyboxIndex].totalAmount = newMoneyboxTotalAmount;

          // Aggiungi la nuova transazione alle transazioni del moneybox
          state.transactions[moneyboxIndex].latestTransactions.push(transaction);
        }
      });
  },
});

export const transactionState = (state) => state.transactions.transactions;
export default transactionsSlice.reducer;

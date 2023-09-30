import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  news: [],
  loading: false,
  error: null,
};

export const fetchNews = createAsyncThunk("news/fetchNews", async (_, thunkAPI) => {
  try {
    const response = await axios.get(
      // `https://newsapi.org/v2/top-headlines?country=it&apiKey=89c3d81fcd0e48f7b85b0e143aa2c077`
      `${process.env.REACT_APP_SERVERBASE_URL}/scrapenews`
    );
    // return response.data.articles;
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const newsState = (state) => state.news.news;

export default newsSlice.reducer;

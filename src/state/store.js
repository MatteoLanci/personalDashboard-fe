import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Reducers/usersSlice";
import newsReducer from "./Reducers/newsSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    news: newsReducer,
  },
});

export default store;

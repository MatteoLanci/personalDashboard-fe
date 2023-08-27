import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Reducers/usersSlice";
import newsReducer from "./Reducers/newsSlice";
import weatherReducer from "./Reducers/weatherSlice";
import themeReducer from "./Reducers/themeSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    news: newsReducer,
    weather: weatherReducer,
    theme: themeReducer,
  },
});

export default store;

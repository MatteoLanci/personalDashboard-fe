import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Reducers/usersSlice";
import newsReducer from "./Reducers/newsSlice";
import weatherReducer from "./Reducers/weatherSlice";
import themeReducer from "./Reducers/themeSlice";
import eventsReducer from "./Reducers/eventsSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    news: newsReducer,
    weather: weatherReducer,
    theme: themeReducer,
    events: eventsReducer,
  },
});

export default store;

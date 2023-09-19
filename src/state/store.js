import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Reducers/usersSlice";
import newsReducer from "./Reducers/newsSlice";
import weatherReducer from "./Reducers/weatherSlice";
import themeReducer from "./Reducers/themeSlice";
import eventsReducer from "./Reducers/eventsSlice";
import profileReducer from "./Reducers/profileSlice";
import moneyboxReducer from "./Reducers/moneyboxSlice";
import transactionReducer from "./Reducers/transactionsSlice";
import wishlistReducer from "./Reducers/wishlistSlice";
import userLocationReducer from "./Reducers/userLocationSlice";
import pharmaciesReducer from "./Reducers/pharmaciesSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    news: newsReducer,
    weather: weatherReducer,
    theme: themeReducer,
    events: eventsReducer,
    userInfo: profileReducer,
    moneybox: moneyboxReducer,
    transactions: transactionReducer,
    wishlist: wishlistReducer,
    userLocation: userLocationReducer,
    pharmacies: pharmaciesReducer,
  },
});

export default store;

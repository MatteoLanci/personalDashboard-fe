import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Reducers/usersSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default store;

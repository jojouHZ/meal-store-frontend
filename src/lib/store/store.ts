import { configureStore } from "@reduxjs/toolkit";
import mealsReducer from "./mealsSlice";
import categoriesReducer from "./categoriesSlice";

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
    categories: categoriesReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

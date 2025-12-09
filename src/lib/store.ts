import { configureStore } from "@reduxjs/toolkit";
import mealsReducer from "./mealsSlice";

export const store = configureStore({
  reducer: {
    meals: mealsReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

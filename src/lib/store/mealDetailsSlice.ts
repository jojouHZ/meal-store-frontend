import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MealFromApi } from "@/types/meals";

interface MealDetailState {
  byId: Record<string, MealFromApi>;
}

const initialState: MealDetailState = { byId: {} };

const mealDetailsSlice = createSlice({
  name: "mealDetails",
  initialState,
  reducers: {
    upsertMeal(state, action: PayloadAction<MealFromApi>) {
      const meal = action.payload;
      state.byId[meal.idMeal] = meal;
    },
  },
});

export const { upsertMeal } = mealDetailsSlice.actions;
export default mealDetailsSlice.reducer;

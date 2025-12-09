import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Meal } from "@/types/meals";

interface MealsState {
  meals: Meal[];
  loading: boolean;
  filter: "all" | "liked";
}

const initialState: MealsState = {
  meals: [],
  loading: false,
  filter: "all",
};

// AsyncThunk<Returned, ThunkArg, CurriedThunkApiConfig>
export const fetchMeals = createAsyncThunk<Meal[]>(
  "meals/fetchMeals",
  async () => {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood"
    );
    const data = await res.json();
    return (data.meals || []).map((m: any) => ({ ...m, isLiked: false }));
  }
);

// Slice<State, CaseReducers, Name, ReducerPath, Selectors>
const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    toggleLike(state, action: PayloadAction<string>) {
      const meal = state.meals.find((m) => m.idMeal === action.payload);
      if (meal) meal.isLiked = !meal.isLiked;
    },
    deleteMeal(state, action: PayloadAction<string>) {
      state.meals = state.meals.filter(
        (meal) => meal.idMeal !== action.payload
      );
      console.log("delete pressed, id =", action.payload);
    },
    setFilter(state, action: PayloadAction<"all" | "liked">) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeals.fulfilled, (state, action) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMeals.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { toggleLike, deleteMeal, setFilter } = mealsSlice.actions;
export default mealsSlice.reducer;

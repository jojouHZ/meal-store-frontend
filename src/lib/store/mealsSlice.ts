import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Meal, CreateMealForm, ApiMealSummary } from "@/types/meals";

interface MealsState {
  meals: Meal[];
  loading: boolean;
  filter: "all" | "liked";
  search: string;
  page: number;
  pageSize: number;
}

const initialState: MealsState = {
  meals: [],
  loading: false,
  filter: "all",
  search: "",
  page: 1,
  pageSize: 6,
};

// AsyncThunk<Returned, ThunkArg, CurriedThunkApiConfig>
export const fetchMeals = createAsyncThunk<Meal[], string>(
  "meals/fetchMeals",
  async (category) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
        category
      )}`
    );
    const data = await res.json();
    return (data.meals || []).map((m: ApiMealSummary) => ({
      ...m,
      isLiked: false,
      strCategory: category,
    })) as Meal[];
  }
);

// Slice<State, CaseReducers, Name, ReducerPath, Selectors>
const mealsSlice = createSlice({
  name: "meals",
  initialState,
  reducers: {
    deleteMeal(state, action: PayloadAction<string>) {
      state.meals = state.meals.filter(
        (meal) => meal.idMeal !== action.payload
      );
    },
    createMeal(state, action: PayloadAction<CreateMealForm>) {
      const { strMeal, strMealThumb, strInstructions } = action.payload;
      const newMeal = {
        // idMeal: uuid/nanoid
        idMeal: `local-${Date.now()}`,
        strMeal: strMeal,
        strMealThumb: strMealThumb,
        strCategory: "Custom",
        strInstructions: strInstructions,
        isLiked: false,
      };
      state.meals.unshift(newMeal);
    },
    updateMeal(
      state,
      action: PayloadAction<{
        idMeal: string;
        strMeal: string;
        strMealThumb: string;
        strInstructions: string;
      }>
    ) {
      const { idMeal, strMeal, strMealThumb, strInstructions } = action.payload;
      const meal = state.meals.find((m) => m.idMeal === idMeal);
      if (!meal) return;

      meal.strMeal = strMeal;
      meal.strMealThumb = strMealThumb;
      meal.strInstructions = strInstructions;
    },
    toggleLike(state, action: PayloadAction<string>) {
      const meal = state.meals.find((m) => m.idMeal === action.payload);
      if (meal) meal.isLiked = !meal.isLiked;
    },
    setFilter(state, action: PayloadAction<"all" | "liked">) {
      state.filter = action.payload;
      state.page = 1;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      const nextPage = action.payload;
      if (nextPage < 1) return;
      state.page = nextPage;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMeals.fulfilled, (state, action: PayloadAction<Meal[]>) => {
        state.loading = false;
        state.meals = action.payload;
      })
      .addCase(fetchMeals.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const {
  deleteMeal,
  createMeal,
  updateMeal,
  toggleLike,
  setFilter,
  setSearch,
  setPage,
  setPageSize,
} = mealsSlice.actions;
export default mealsSlice.reducer;

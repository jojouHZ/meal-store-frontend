import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Category } from "@/types/meals";

interface CategoriesState {
  categories: Category[];
  selected: string | null;
  loading: boolean;
  hydrated: boolean; // добавляем
}

const initialState: CategoriesState = {
  categories: [],
  selected: null,
  loading: false,
  hydrated: false,
};

export const fetchCategories = createAsyncThunk<Category[]>(
  "categories/fetchCategories",
  async () => {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/categories.php"
    );
    const data = await res.json();
    return data.categories as Category[];
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    selectCategory(state, action: PayloadAction<string | null>) {
      state.selected = action.payload;
      state.hydrated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<Category[]>) => {
          state.loading = false;
          state.categories = action.payload;
        }
      )
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { selectCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;

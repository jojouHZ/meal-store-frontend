import categoriesReducer, {
  fetchCategories,
  selectCategory,
} from "@/lib/store/categoriesSlice";
import type { Category } from "@/types/meals";

type CategoriesState = {
  categories: Category[];
  selected: string | null;
  hydrated: boolean;
  loading: boolean;
};

const createInitialState = (
  overrides?: Partial<CategoriesState>
): CategoriesState => ({
  categories: [],
  selected: null,
  hydrated: false,
  loading: false,
  ...overrides,
});

describe("categoriesSlice reducers", () => {
  it("selectCategory should set selected category", () => {
    const initial = createInitialState({ selected: null });

    const next = categoriesReducer(initial, selectCategory("Beef"));

    expect(next.selected).toBe("Beef");
  });

  it("selectCategory should allow clearing selection with null", () => {
    const initial = createInitialState({ selected: "Beef" });

    const next = categoriesReducer(initial, selectCategory(null));

    expect(next.selected).toBeNull();
  });
});

describe("categoriesSlice extraReducers", () => {
  it("fetchCategories.pending should set loading true", () => {
    const initial = createInitialState();

    const next = categoriesReducer(
      initial,
      fetchCategories.pending("", undefined)
    );

    expect(next.loading).toBe(true);
  });

  it("fetchCategories.fulfilled should set categories, hydrated and loading false", () => {
    const initial = createInitialState({ loading: true, hydrated: false });

    const payload: Category[] = [
      { idCategory: "1", strCategory: "Beef" },
      { idCategory: "2", strCategory: "Chicken" },
    ];

    const next = categoriesReducer(
      initial,
      fetchCategories.fulfilled(payload, "", undefined)
    );

    expect(next.loading).toBe(false);
    expect(next.categories).toEqual(payload);
  });
});

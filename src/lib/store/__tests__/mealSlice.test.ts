import mealsReducer, {
  createMeal,
  deleteMeal,
  toggleLike,
  setFilter,
  setSearch,
  setPage,
  fetchMeals,
} from "@/lib/store/mealsSlice";
import type { Meal } from "@/types/meals";

type MealsState = {
  meals: Meal[];
  loading: boolean;
  filter: "all" | "liked";
  search: string;
  page: number;
  pageSize: number;
};

const createInitialState = (overrides?: Partial<MealsState>): MealsState => ({
  meals: [],
  loading: false,
  filter: "all",
  search: "",
  page: 1,
  pageSize: 6,
  ...overrides,
});

describe("mealsSlice reducers", () => {
  it("toggleLike should invert isLiked for given meal", () => {
    const initial = createInitialState({
      meals: [
        { idMeal: "1", strMeal: "A", strMealThumb: "", isLiked: false },
      ] as Meal[],
    });

    const next = mealsReducer(initial, toggleLike("1"));

    expect(next.meals[0].isLiked).toBe(true);
  });

  it("deleteMeal should remove meal by id", () => {
    const initial = createInitialState({
      meals: [
        { idMeal: "1", strMeal: "A", strMealThumb: "" },
        { idMeal: "2", strMeal: "B", strMealThumb: "" },
      ] as Meal[],
    });

    const next = mealsReducer(initial, deleteMeal("1"));

    expect(next.meals).toHaveLength(1);
    expect(next.meals[0].idMeal).toBe("2");
  });

  it("createMeal should prepend new local meal", () => {
    const initial = createInitialState({
      meals: [{ idMeal: "1", strMeal: "Existing", strMealThumb: "" }] as Meal[],
    });

    const next = mealsReducer(
      initial,
      createMeal({
        strMeal: "New meal",
        strMealThumb: "http://example.com/img.jpg",
        strInstructions: "Test",
      })
    );

    expect(next.meals).toHaveLength(2);
    expect(next.meals[0].idMeal).toMatch(/^local-/);
    expect(next.meals[0].strMeal).toBe("New meal");
    expect(next.meals[1].idMeal).toBe("1");
  });

  it("setFilter should update filter and reset page to 1", () => {
    const initial = createInitialState({ page: 3 });

    const next = mealsReducer(initial, setFilter("liked"));

    expect(next.filter).toBe("liked");
    expect(next.page).toBe(1);
  });

  it("setSearch should update search and reset page to 1", () => {
    const initial = createInitialState({ page: 4 });

    const next = mealsReducer(initial, setSearch("chicken"));

    expect(next.search).toBe("chicken");
    expect(next.page).toBe(1);
  });

  it("setPage should not set page below 1", () => {
    const initial = createInitialState({ page: 2 });

    const next = mealsReducer(initial, setPage(0));

    expect(next.page).toBe(2);
  });
});

describe("mealsSlice extraReducers", () => {
  it("fetchMeals.pending should set loading true", () => {
    const initial = createInitialState();

    const next = mealsReducer(initial, fetchMeals.pending("", "Beef"));

    expect(next.loading).toBe(true);
  });

  it("fetchMeals.fulfilled should set meals and loading false", () => {
    const initial = createInitialState({ loading: true });

    const payload: Meal[] = [
      {
        idMeal: "1",
        strMeal: "Test",
        strMealThumb: "",
        strCategory: "Beef",
        strInstructions: "",
        isLiked: false,
      },
    ];

    const next = mealsReducer(
      initial,
      fetchMeals.fulfilled(payload, "", "Beef")
    );

    expect(next.loading).toBe(false);
    expect(next.meals).toEqual(payload);
  });

  it("fetchMeals.rejected should set loading false", () => {
    const initial = createInitialState({ loading: true });

    const next = mealsReducer(
      initial,
      fetchMeals.rejected(new Error("fail"), "", "Beef")
    );

    expect(next.loading).toBe(false);
  });
});

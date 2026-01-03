"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store/store";
import { fetchCategories, selectCategory } from "@/lib/store/categoriesSlice";
import {
  fetchMeals,
  toggleLike,
  deleteMeal,
  setFilter,
  setSearch,
  setPage,
} from "@/lib/store/mealsSlice";
import { MealCard } from "@/components/ui/MealCard";
import { CatalogHeader } from "@/components/ui/CatalogHeader";
import { Pagination } from "@/components/ui/Pagination";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, selected, hydrated } = useSelector(
    (state: RootState) => state.categories
  );

  const { meals, loading, filter, search, page, pageSize } = useSelector(
    (state: RootState) => state.meals
  );
  const searchResult =
    search !== ""
      ? meals.filter((meal) =>
          meal.strMeal.toLowerCase().includes(search.toLowerCase())
        )
      : meals;
  const visibleMeals =
    filter === "liked"
      ? searchResult.filter((meal) => meal.isLiked)
      : searchResult;
  const startPageIndex = (page - 1) * pageSize;
  const endPageIndex = startPageIndex + pageSize;
  const paginatedMeals = visibleMeals.slice(startPageIndex, endPageIndex);
  const totalPages = Math.max(1, Math.ceil(visibleMeals.length / pageSize));

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!selected) return;
    dispatch(fetchMeals(selected));
  }, [dispatch, selected]);

  useEffect(() => {
    if (page > totalPages) {
      dispatch(setPage(totalPages));
    }
  }, [page, totalPages, dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("selectedCategory");
    if (stored) {
      dispatch(selectCategory(stored));
    } else {
      dispatch(selectCategory(null));
    }
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selected) {
      window.localStorage.setItem("selectedCategory", selected);
    } else {
      window.localStorage.removeItem("selectedCategory");
    }
  }, [selected]);

  if (!hydrated) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading…</p>
      </main>
    );
  }

  if (!selected) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Catalog
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Meals
          </h1>
          <p className="text-sm text-gray-600">
            Choose a category to explore meals.
          </p>
        </header>

        <section className="flex flex-wrap gap-3">
          {categories.map((c) => (
            <button
              key={c.idCategory}
              type="button"
              onClick={() => dispatch(selectCategory(c.strCategory))}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 hover:border-gray-900"
            >
              {c.strCategory}
            </button>
          ))}
        </section>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-700">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-screen max-w-5xl flex-col px-4 py-6">
      <CatalogHeader
        filter={filter}
        onFilterChange={(value) => dispatch(setFilter(value))}
        categories={categories}
        selectedCategory={selected}
        onCategoryChange={(value) => dispatch(selectCategory(value))}
        onSearchChange={(value) => dispatch(setSearch(value))}
        onNewMealClick={() => {
          window.location.href = "/create-product";
        }}
      />

      <section className="mt-4 flex min-h-0 flex-1 flex-col">
        <section
          aria-label="List of products"
          className="grid flex-1 gap-6 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3"
        >
          {paginatedMeals.map((meal) => (
            <MealCard
              key={meal.idMeal}
              meal={meal}
              onToggleLike={(id) => dispatch(toggleLike(id))}
              onDelete={(id) => dispatch(deleteMeal(id))}
            />
          ))}
        </section>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => dispatch(setPage(p))}
        />
      </section>
    </main>
  );
}

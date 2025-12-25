// main page: ./app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store/store";
import Link from "next/link";
import { fetchCategories, selectCategory } from "@/lib/store/categoriesSlice";
import {
  fetchMeals,
  toggleLike,
  deleteMeal,
  setFilter,
  setSearch,
  setPage,
} from "@/lib/store/mealsSlice";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [menuOpen, setMenuOpen] = useState(false);
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
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[180px]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
            Catalog
          </p>
          <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
            Meals
          </h1>
          <p className="mt-1 text-xs text-gray-600">
            Browse meals from the public API or add your own creations.
          </p>
        </div>

        <nav
          aria-label="Filters"
          className="flex flex-wrap items-center justify-end gap-2"
        >
          <button
            type="button"
            onClick={() => dispatch(setFilter("all"))}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium transition ${
              filter === "all"
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-900"
            }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => dispatch(setFilter("liked"))}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-[11px] transition ${
              filter === "liked"
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-900"
            }`}
            aria-label="Show liked meals"
          >
            {filter === "liked" ? (
              <HeartSolid className="h-4 w-4 text-orange-500" />
            ) : (
              <HeartOutline className="h-4 w-4 text-gray-700" />
            )}
          </button>

          <select
            value={selected ?? ""}
            onChange={(e) => dispatch(selectCategory(e.target.value || null))}
            className="max-w-[130px] rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          >
            <option value="">Category…</option>
            {categories.map((c) => (
              <option key={c.idCategory} value={c.strCategory}>
                {c.strCategory}
              </option>
            ))}
          </select>

          <div className="relative">
            <label className="sr-only" htmlFor="search">
              Search meals
            </label>
            <input
              id="search"
              type="search"
              placeholder="Search…"
              onChange={(e) => dispatch(setSearch(e.target.value))}
              className="w-28 md:w-32 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[11px] text-gray-900 placeholder:text-gray-400 focus:w-40 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-[width]"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-900 transition"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="More actions"
            >
              <EllipsisHorizontalIcon className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-40 rounded-2xl border border-gray-200 bg-white py-2 shadow-lg">
                <a
                  href="/create-product"
                  className="block px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  New meal
                </a>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* контент занимает оставшееся место и сам скроллится */}
      <section className="mt-4 flex min-h-0 flex-1 flex-col">
        <section
          aria-label="List of products"
          className="grid flex-1 gap-6 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3"
        >
          {paginatedMeals.map((meal) => (
            <article
              key={meal.idMeal}
              className="group relative flex h-[300px] flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md"
            >
              <Link
                href={`/products/${meal.idMeal}`}
                className="flex h-full flex-col"
                aria-label={`Open details for ${meal.strMeal}`}
              >
                <figure className="aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </figure>

                <section className="flex flex-1 flex-col p-3 pb-10">
                  <h2 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900 min-h-[2.6rem]">
                    {meal.strMeal}
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    {meal.strCategory ?? ""}
                  </p>
                </section>
              </Link>

              <div className="absolute bottom-2 right-3 flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dispatch(toggleLike(meal.idMeal));
                  }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-gray-200 hover:bg-orange-50 hover:ring-orange-300 transition"
                  aria-pressed={meal.isLiked}
                  aria-label={
                    meal.isLiked ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  {meal.isLiked ? (
                    <HeartSolid className="h-3.5 w-3.5 text-orange-500" />
                  ) : (
                    <HeartOutline className="h-3.5 w-3.5 text-gray-700" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!confirm("Delete this meal?")) return;
                    dispatch(deleteMeal(meal.idMeal));
                  }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-gray-200 hover:bg-orange-50 hover:ring-orange-300 transition"
                  aria-label="Delete meal"
                >
                  <TrashIcon className="h-3.5 w-3.5 text-red-500" />
                </button>
              </div>
            </article>
          ))}
        </section>

        <nav
          aria-label="Pagination"
          className="mt-3 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => dispatch(setPage(page - 1))}
            disabled={page === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-900 disabled:opacity-40 disabled:hover:border-gray-300"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => dispatch(setPage(p))}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-medium transition ${
                p === page
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-gray-900"
              }`}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => dispatch(setPage(page + 1))}
            disabled={page === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-700 hover:border-gray-900 disabled:opacity-40 disabled:hover:border-gray-300"
            aria-label="Next page"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </nav>
      </section>
    </main>
  );
}

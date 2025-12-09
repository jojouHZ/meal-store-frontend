// main page: ./app/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/lib/store";
import Link from "next/link";
import {
  fetchMeals,
  toggleLike,
  deleteMeal,
  setFilter,
} from "@/lib/mealsSlice";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { meals, loading, filter } = useSelector(
    (state: RootState) => state.meals
  );
  const visibleMeals =
    filter === "liked" ? meals.filter((meal) => meal.isLiked) : meals;

  useEffect(() => {
    dispatch(fetchMeals());
  }, [dispatch]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-700">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-sm text-gray-600">
          Meals loaded from public API.
        </p>
        <nav aria-label="Filter products" className="flex gap-2">
          <button
            type="button"
            onClick={() => dispatch(setFilter("all"))}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === "all"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => dispatch(setFilter("liked"))}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              filter === "liked"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Liked
          </button>
        </nav>
      </header>

      <section
        aria-label="List of products"
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {/* 
          Meal {
            idMeal: string;
            strMeal: string;
            strMealThumb: string;
            strCategory?: string;
            strInstructions?: string;
            isLiked?: boolean;
          } 
        */}
        {/*
          article: ring, flex flex-col overflow-hidden
          child: flex flex-col flex-? p-? m-?
        */}
        {visibleMeals.map((meal) => (
          <article
            key={meal.idMeal}
            className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100"
          >
            <Link href={`./products/${meal.idMeal}`} className="block">
              <figure>
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="h-48 w-full object-cover"
                />
              </figure>

              <section className="flex flex-1 flex-col p-4">
                <h2 className="mb-3 line-clamp-2 text-sm font-semibold text-gray-900">
                  {meal.strMeal}
                </h2>

                <footer className="mt-auto flex items-center justify-between">
                  {/* Like */}
                  <button
                    type="button"
                    onClick={() => dispatch(toggleLike(meal.idMeal))}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                      meal.isLiked
                        ? "bg-pink-100 text-pink-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-pressed={meal.isLiked}
                  >
                    {meal.isLiked ? "Liked" : "Like"}
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => dispatch(deleteMeal(meal.idMeal))}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </footer>
              </section>
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

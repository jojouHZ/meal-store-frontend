// product page: ./app/products/[id]/page.tsx
"use client";

import { notFound } from "next/navigation";
import { use } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default function ProductPage(props: ProductPageProps) {
  const { id } = use(props.params);

  const meal = useSelector((state: RootState) =>
    state.meals.meals.find((m) => m.idMeal === id)
  );

  if (!meal) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-red-600">
          Meal not found in Redux store. Try opening this page from the list.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{meal.strMeal}</h1>
        <p className="mt-2 text-sm text-gray-600">Product details</p>
      </header>

      <section className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <figure className="overflow-hidden rounded-xl bg-gray-100">
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="h-full w-full object-cover"
          />
        </figure>

        <section className="space-y-4">
          <p className="text-sm text-gray-700">
            Category:{" "}
            <span className="font-medium">{meal!.strCategory ?? "N/A"}</span>
          </p>

          <a
            href="/"
            className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            ← Back to products
          </a>
        </section>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { RootState } from "@/lib/store/store";
import { MealFromApi } from "@/types/meals";
import { useAppDispatch } from "@/hooks/hooks";
import { updateMeal } from "@/lib/store/mealsSlice";
import { upsertMeal } from "@/lib/store/mealDetailsSlice";

type Props = {
  id: string;
  initialMeal: MealFromApi | null;
};

const updateMealSchema = z.object({
  strMeal: z.string().min(3, "Name must be at least 3 characters"),
  strMealThumb: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image URL is required"),
  strInstructions: z.string(),
});

type UpdateMealForm = z.infer<typeof updateMealSchema>;

export default function ProductPageClient({ id, initialMeal }: Props) {
  const dispatch = useAppDispatch();

  const isLocal = id.toLowerCase().includes("local");
  const mealFromStore = useSelector((state: RootState) =>
    state.meals.meals.find((m) => m.idMeal === id)
  );
  const apiMeal = initialMeal;
  const localMeal = mealFromStore;
  const meal = isLocal ? localMeal : apiMeal;

  useEffect(() => {
    if (initialMeal) {
      dispatch(upsertMeal(initialMeal));
    }
  }, [initialMeal, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateMealForm>({
    resolver: zodResolver(updateMealSchema),
    defaultValues: {
      strMeal: meal?.strMeal ?? "",
      strMealThumb: meal?.strMealThumb ?? "",
      strInstructions: meal?.strInstructions ?? "",
    },
  });

  useEffect(() => {
    if (!meal) return;
    reset({
      strMeal: meal.strMeal,
      strMealThumb: meal.strMealThumb,
      strInstructions: meal.strInstructions ?? "",
    });
  }, [meal, meal?.strMeal, meal?.strMealThumb, meal?.strInstructions, reset]);

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => {
    if (isEditing) reset();
    setIsEditing((prev) => !prev);
  };

  const onSubmit = (data: UpdateMealForm) => {
    if (!meal) return;
    dispatch(
      updateMeal({
        idMeal: id,
        strMeal: data.strMeal,
        strMealThumb: data.strMealThumb,
        strInstructions: data.strInstructions,
      })
    );
    setIsEditing(false);
  };

  if (!isLocal && !apiMeal) {
    return <>...not found...</>;
  }

  if (!meal) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-red-600">
          Meal not found in Redux store. Try opening this page from the list.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          ← Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
            Meal detail
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
            {meal.strMeal}
          </h1>
        </>
        <button
          onClick={toggleEditing}
          className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </header>

      <section className="flex flex-col gap-10 md:flex-row md:items-start">
        {/* Left column */}
        <section className="w-full md:w-1/2">
          <figure className="overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="h-full w-full max-h-[420px] object-cover object-center"
            />
          </figure>
        </section>

        {/* Right column */}
        <section className="w-full md:w-1/2 space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
            Category:{" "}
            <span className="font-medium">{meal.strCategory ?? "N/A"}</span>
          </p>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-600">
            Instructions
          </p>
          <p className="text-sm font-light md:text-base leading-relaxed text-gray-700 max-h-80 overflow-auto">
            {meal.strInstructions ?? "N/A"}
          </p>
          <span className="inline-flex max-h-[200px] space-x-2"></span>
        </section>
      </section>
      <footer className="flex flex-col md:flex-row gap-8 items-end pt-5 justify-end">
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors"
        >
          ← Back to products
        </Link>
      </footer>
      {isEditing && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
        >
          <section>
            <label className="block text-sm font-medium text-gray-800">
              Name
            </label>
            <input
              type="text"
              {...register("strMeal")}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
            {errors.strMeal && (
              <p className="mt-1 text-xs text-red-500">
                {errors.strMeal.message}
              </p>
            )}
          </section>

          <section>
            <label className="block text-sm font-medium text-gray-800">
              Image URL
            </label>
            <input
              type="url"
              {...register("strMealThumb")}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
            {errors.strMealThumb && (
              <p className="mt-1 text-xs text-red-500">
                {errors.strMealThumb.message}
              </p>
            )}
          </section>

          <section>
            <label className="block text-sm font-medium text-gray-800">
              Description
            </label>
            <textarea
              rows={4}
              {...register("strInstructions")}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            />
            {errors.strInstructions && (
              <p className="mt-1 text-xs text-red-500">
                {errors.strInstructions.message}
              </p>
            )}
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </main>
  );
}

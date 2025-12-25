"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/lib/store/store";
import { createMeal } from "@/lib/store/mealsSlice";
import Link from "next/link";

const createMealSchema = z.object({
  strMeal: z.string().min(3, "Name must be at least 3 characters"),
  strMealThumb: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Image URL is required"),
  strInstructions: z
    .string()
    .min(10, "Description must be at least 10 characters"),
});

type CreateMealForm = z.infer<typeof createMealSchema>;

export default function CreateProductPage() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateMealForm>({
    resolver: zodResolver(createMealSchema),
    defaultValues: {
      strMeal: "",
      strMealThumb: "",
      strInstructions: "",
    },
  });

  const onSubmit = (data: CreateMealForm) => {
    dispatch(createMeal(data));
    reset();
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-10 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-900">Create product</h1>
        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
          Catalog
        </p>
        <Link
          href="/"
          className="inline-flex text-sm text-blue-600 hover:underline"
        >
          ← Back to products
        </Link>
      </header>

      <section aria-label="Create product form">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
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
            className="inline-flex w-full justify-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-60"
          >
            {isSubmitting ? "Saving…" : "Create product"}
          </button>
        </form>
      </section>
    </main>
  );
}

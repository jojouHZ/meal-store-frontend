"use client";

import Link from "next/link";
import Image from "next/image";
import { Meal } from "@/types/meals";
import {
  HeartIcon as HeartOutline,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

type MealCardProps = {
  meal: Meal;
  onToggleLike: (id: string) => void;
  onDelete: (id: string) => void;
};

export function MealCard({ meal, onToggleLike, onDelete }: MealCardProps) {
  return (
    <article className="group relative flex h-[300px] flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-md">
      <Link
        href={`/products/${meal.idMeal}`}
        className="flex h-full flex-col"
        aria-label={`Open details for ${meal.strMeal}`}
      >
        <figure className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={meal.strMealThumb}
            alt={meal.strMeal}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </figure>

        <section className="flex flex-1 flex-col p-3 pb-10">
          <h2 className="mb-1 min-h-[2.6rem] line-clamp-2 text-sm font-semibold text-gray-900">
            {meal.strMeal}
          </h2>
          <p className="text-[11px] text-gray-500">{meal.strCategory ?? ""}</p>
        </section>
      </Link>

      <div className="absolute bottom-2 right-3 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleLike(meal.idMeal);
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
            onDelete(meal.idMeal);
          }}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-gray-200 hover:bg-orange-50 hover:ring-orange-300 transition"
          aria-label="Delete meal"
        >
          <TrashIcon className="h-3.5 w-3.5 text-red-500" />
        </button>
      </div>
    </article>
  );
}

"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartOutline,
  HeartIcon as HeartSolid,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import type { Category } from "@/types/meals";

type Filter = "all" | "liked";

type CatalogHeaderProps = {
  filter: Filter;
  onFilterChange: (value: Filter) => void;
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  onSearchChange: (value: string) => void;
  onNewMealClick: () => void;
};

export function CatalogHeader({
  filter,
  onFilterChange,
  categories,
  selectedCategory,
  onCategoryChange,
  onSearchChange,
  onNewMealClick,
}: CatalogHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
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
        {/* All / Liked */}
        <button
          type="button"
          onClick={() => onFilterChange("all")}
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
          onClick={() => onFilterChange("liked")}
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

        {/* Category select с disabled placeholder */}
        <select
          value={selectedCategory ?? ""}
          onChange={(e) =>
            onCategoryChange(e.target.value ? e.target.value : null)
          }
          className="max-w-[130px] rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] text-gray-700 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        >
          <option value="" disabled>
            Category…
          </option>
          {categories.map((c) => (
            <option key={c.idCategory} value={c.strCategory}>
              {c.strCategory}
            </option>
          ))}
        </select>

        {/* Search */}
        <div className="relative">
          <label className="sr-only" htmlFor="search">
            Search meals
          </label>
          <input
            id="search"
            type="search"
            placeholder="Search…"
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-28 md:w-32 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-[11px] text-gray-900 placeholder:text-gray-400 focus:w-40 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-[width]"
          />
        </div>

        {/* Menu */}
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
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onNewMealClick();
                }}
                className="block w-full px-3 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                New meal
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

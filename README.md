# Meal Store

A small Next.js app that browses meals from [TheMealDB](https://www.themealdb.com), allows creating local custom meals, and provides a polished Koreana/Farfetch-style catalog UI.

## Tech Stack

- **Next.js 16** (App Router, `app/`) with TypeScript
- **Redux Toolkit** for meals and categories state management
- **React Hook Form + Zod** for form validation
- **Tailwind CSS** for layout and styling
- **TheMealDB API** for public meals data
- **Jest** + **Testing Library** for unit tests

## Installation

Prerequisites:

- Node.js 20+ (LTS recommended)
- Yarn or npm

Clone the repository:

```bash
git clone https://github.com/<your-username>/meal-store-frontend.git
cd meal-store-frontend
```

Install dependencies:

```
# Yarn
yarn install

# or npm
npm install
```

Run development server:

```
yarn dev

# or
npm run dev
```

Open http://localhost:3000 in your browser.

Build and run production:

```
# build & start
yarn build
yarn start

# or
npm run build
npm run start
```

Run tests:

```
yarn test
```

## Features

- Category-based catalog loaded from TheMealDB
- Category selection persisted in `localStorage`
- Filter by:
  - All meals
  - Liked meals
- Text search within the current category
- Pagination with consistent card height (no layout jumps)
- Create, edit and delete local meals (IDs like `local-*`)
- Detailed product page with editable fields (name, image URL, instructions)

## UI Highlights

- Main layout: header + filters are fixed in view, scroll only the cards grid
- **MealCard** component:
  - Next.js `Image` with remote image support and responsive `sizes`
  - Like/delete icon buttons with accessible `aria-label`s
  - Clean card hover animation and line-clamped titles
- **CatalogHeader** component:
  - “All / Liked” toggle
  - Category `<select>` with disabled placeholder option
  - Responsive search input and “New meal” action
- **Pagination** component:
  - Rounded page buttons and arrow icons
  - Proper `aria-label` for navigation and `aria-current` for the active page

## State Management

- `mealsSlice`:

  - `fetchMeals(category)` loads meals from TheMealDB and stores them with `strCategory`
  - `createMeal`, `updateMeal`, `deleteMeal`, `toggleLike`
  - `setFilter`, `setSearch`, `setPage`, `setPageSize`

- `categoriesSlice`:
  - `fetchCategories()` loads categories from TheMealDB
  - `selectCategory` stores the current category and is hydrated from `localStorage`

## Testing

Unit tests cover the core Redux logic:

- **mealsSlice** tests:

  - `toggleLike` toggles `isLiked`
  - `deleteMeal` removes a meal by `idMeal`
  - `createMeal` prepends a new local meal
  - `setFilter` and `setSearch` reset `page` to `1`
  - `setPage` does not go below `1`
  - `fetchMeals.pending / fulfilled / rejected` update `loading` and `meals` correctly

- **categoriesSlice** tests:
  - `selectCategory` sets and clears the selected category
  - `fetchCategories.pending / fulfilled` update `loading` and `categories`

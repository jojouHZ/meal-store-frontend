export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strInstructions?: string;
  isLiked?: boolean;
}

export type MealFromApi = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string | null;
  strArea: string | null;
  strTags: string | null;
  strYoutube: string | null;
  strInstructions: string | null;
  strIngredient1: string | null;
  strIngredient2: string | null;
  strIngredient3: string | null;
  strIngredient4: string | null;
  strIngredient5: string | null;
  strIngredient6: string | null;
  strIngredient7: string | null;
  strIngredient8: string | null;
  strIngredient9: string | null;
  strIngredient10: string | null;
};

export interface CreateMealForm {
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
}

export type Category = {
  idCategory: string;
  strCategory: string;
};

export type ApiMealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

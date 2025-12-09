export interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strInstructions?: string;
  isLiked?: boolean;
}

export interface CreateMealForm {
  name: string;
  imageUrl: string;
  description: string;
}

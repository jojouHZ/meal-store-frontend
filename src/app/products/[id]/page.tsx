import ProductPageClient from "@/lib/productPage/productPageClient";
import { MealFromApi } from "@/types/meals";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) {
    return <p>Invalid id</p>;
  }

  let meal: MealFromApi | null = null;

  if (!id.toLowerCase().includes("local")) {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      { next: { revalidate: 60 } }
    );
    const data = await res.json();
    meal = data.meals?.[0] ?? null;
  }

  return <ProductPageClient initialMeal={meal} id={id} />;
}

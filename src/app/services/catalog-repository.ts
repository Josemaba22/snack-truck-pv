import { Injectable } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';

import { CategoriesApiService } from './categories-api';
import { IngredientsApiService } from './ingredients-api';
import { LocalDb } from './local-db';
import { ProductRecipeDetailsApiService } from './product-recipe-details-api';
import { ProductsApiService } from './products-api';
import { CategoryResponse } from '../models/api/category.api';
import { IngredientResponse } from '../models/api/ingredient.api';
import { ProductRecipeDetailResponse } from '../models/api/product-recipe-detail.api';
import { ProductResponse } from '../models/api/product.api';

// Catálogo (categorías, productos, ingredientes y recetas) espejado en IndexedDB. La UI lee
// siempre de aquí; `refresh()` lo actualiza desde la API cuando hay conexión.
@Injectable({ providedIn: 'root' })
export class CatalogRepository {
  constructor(
    private readonly db: LocalDb,
    private readonly categoriesApi: CategoriesApiService,
    private readonly productsApi: ProductsApiService,
    private readonly ingredientsApi: IngredientsApiService,
    private readonly recipeDetailsApi: ProductRecipeDetailsApiService,
  ) {}

  // Receta de un producto con solo los ingredientes disponibles (la API rechaza los demás),
  // cada uno con la imagen del ingrediente.
  async getRecipe(productId: string): Promise<ProductRecipeDetailResponse[]> {
    const [details, ingredients] = await Promise.all([
      this.db.recipeDetails.where('productId').equals(productId).toArray(),
      this.db.ingredients.toArray(),
    ]);
    const availableById = new Map(
      ingredients
        .filter((ingredient) => ingredient.available)
        .map((ingredient) => [ingredient.id, ingredient] as const),
    );
    return details
      .filter((detail) => availableById.has(detail.ingredientId))
      .map((detail) => ({
        ...detail,
        ingredientImageUrl: availableById.get(detail.ingredientId)?.imageUrl ?? null,
      }));
  }

  // Primer arranque sin API: carga el catálogo empaquetado con la app (public/seed/catalog.json).
  // Si ya hay catálogo guardado no hace nada.
  async seedIfEmpty(): Promise<void> {
    if ((await this.db.categories.count()) > 0) {
      return;
    }
    const response = await fetch('seed/catalog.json');
    if (!response.ok) {
      throw new Error(`No se pudo leer el catálogo empaquetado (${response.status})`);
    }
    const seed = (await response.json()) as {
      categories: CategoryResponse[];
      products: ProductResponse[];
      ingredients: IngredientResponse[];
      recipeDetails: ProductRecipeDetailResponse[];
    };

    await this.db.transaction(
      'rw',
      [this.db.categories, this.db.products, this.db.ingredients, this.db.recipeDetails],
      async () => {
        await this.db.categories.bulkPut(seed.categories);
        await this.db.products.bulkPut(seed.products);
        await this.db.ingredients.bulkPut(seed.ingredients);
        await this.db.recipeDetails.bulkPut(seed.recipeDetails);
      },
    );
  }

  // Todo o nada: si falla cualquier petición no se toca lo que ya hay guardado.
  async refresh(): Promise<void> {
    const { categories, products, ingredients } = await firstValueFrom(
      forkJoin({
        categories: this.categoriesApi.getAll(),
        products: this.productsApi.getAll(),
        ingredients: this.ingredientsApi.getAll(),
      }),
    );

    const recipes = products.length
      ? await firstValueFrom(
          forkJoin(products.map((product) => this.recipeDetailsApi.getByProduct(product.id))),
        )
      : [];

    await this.db.transaction(
      'rw',
      [this.db.categories, this.db.products, this.db.ingredients, this.db.recipeDetails],
      async () => {
        await Promise.all([
          this.db.categories.clear(),
          this.db.products.clear(),
          this.db.ingredients.clear(),
          this.db.recipeDetails.clear(),
        ]);
        await Promise.all([
          this.db.categories.bulkPut(categories),
          this.db.products.bulkPut(products),
          this.db.ingredients.bulkPut(ingredients),
          this.db.recipeDetails.bulkPut(recipes.flat()),
        ]);
      },
    );
  }
}

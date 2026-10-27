import { Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { IngredientSummary } from '../../../models/ui/cart-item.ui';

@Component({
  selector: 'app-ingredient-picker',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './ingredient-picker.html',
  styleUrl: './ingredient-picker.css',
})
export class IngredientPicker {
  ingredients = input.required<IngredientSummary[]>();

  // Ids activos (verde); el resto se muestra desactivado (rosa suave).
  selectedIds = input<Set<string>>(new Set());

  showPrice = input(true);

  emptyMessage = input('Este producto no tiene ingredientes disponibles');

  toggled = output<IngredientSummary>();

  // Columnas impuestas por el padre para que varios pickers usen el mismo tamaño de celda.
  columnsOverride = input<number | null>(null, { alias: 'columns' });

  // Sin override, la cuadrícula reparte los items en el espacio disponible para no necesitar scroll.
  readonly columns = computed(() => {
    const forced = this.columnsOverride();
    if (forced !== null) {
      return Math.max(1, forced);
    }
    const count = this.ingredients().length;
    return Math.max(1, Math.min(count, Math.ceil(Math.sqrt(count * 3))));
  });

  readonly rows = computed(() =>
    Math.max(1, Math.ceil(this.ingredients().length / this.columns())),
  );

  isSelected(ingredient: IngredientSummary): boolean {
    return this.selectedIds().has(ingredient.ingredientId);
  }
}

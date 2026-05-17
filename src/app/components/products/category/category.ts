import { Component, input, signal } from '@angular/core';
import { CategoryUi } from '../../../models/ui/category.ui';
import { ProductView } from '../../../models/view/product.view';

import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  category = input.required<CategoryUi>();

  products = input.required<ProductView[]>();

  dropdown = signal(false);

  toggleDropdown(): void {
    this.dropdown.update((value) => !value);
  }
}

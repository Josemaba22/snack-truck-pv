import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryUi } from '../../../models/ui/category.ui';
import { ProductResponse } from '../../../models/api/product.api';

import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  category = input.required<CategoryUi>();

  products = input.required<ProductResponse[]>();

  back = output<void>();

  selected = output<ProductResponse>();
}

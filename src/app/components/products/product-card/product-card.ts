import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductResponse } from '../../../models/api/product.api';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input.required<ProductResponse>();

  selected = output<ProductResponse>();

  onSelect(): void {
    this.selected.emit(this.product());
  }
}

import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductView } from '../../../models/view/product.view';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  product = input.required<ProductView>();
}

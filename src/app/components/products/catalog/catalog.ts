import { Component } from '@angular/core';
import { Category } from '../category/category';

@Component({
  selector: 'app-catalog',
  imports: [Category],
  standalone: true,
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {}

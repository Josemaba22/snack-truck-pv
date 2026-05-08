import { Component, signal } from '@angular/core';
import { Catalog } from './components/products/catalog/catalog';

@Component({
  selector: 'app-root',
  imports: [Catalog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('markesitas-v2');
}

import { Component, signal } from '@angular/core';
import { Catalog } from './components/products/catalog/catalog';
import { Example } from '../app/shared/button/example/example';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Catalog, Example],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('markesitas-v2');
}

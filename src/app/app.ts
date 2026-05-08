import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductSelector } from './components/product/product-selector/product-selector';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductSelector],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('markesitas-v2');
}

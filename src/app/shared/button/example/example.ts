import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from '../button';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Button, CommonModule],
  templateUrl: './example.html',
  styleUrl: './example.css',
}) // products-page.component.ts
export class Example {
  saveProduct(): void {
    console.log('Producto guardado');
  }

  deleteProduct(): void {
    console.log('Producto eliminado');
  }
}

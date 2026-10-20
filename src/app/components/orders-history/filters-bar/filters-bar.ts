import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface OrdersFilter {
  readonly query: string;
  // yyyy-MM-dd o vacío.
  readonly date: string;
}

@Component({
  selector: 'app-filters-bar',
  imports: [FormsModule],
  templateUrl: './filters-bar.html',
  styleUrl: './filters-bar.css',
})
export class FiltersBar {
  query = signal('');

  date = signal('');

  filtered = output<OrdersFilter>();

  applyFilter(): void {
    this.filtered.emit({ query: this.query().trim(), date: this.date() });
  }

  clear(): void {
    this.query.set('');
    this.date.set('');
    this.applyFilter();
  }
}

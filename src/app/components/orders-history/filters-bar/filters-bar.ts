import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters-bar',
  imports: [FormsModule],
  templateUrl: './filters-bar.html',
  styleUrl: './filters-bar.css',
})
export class FiltersBar {
  query = signal('');

  filtered = output<string>();

  applyFilter(): void {
    this.filtered.emit(this.query().trim());
  }
}

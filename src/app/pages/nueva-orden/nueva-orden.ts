import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SnackCategory, SnackItem } from './../../shared/interfaces/SnackCategory';

@Component({
  selector: 'app-nueva-orden',
  imports: [CommonModule],
  templateUrl: './nueva-orden.html',
  styleUrl: './nueva-orden.css',
})
export class NuevaOrden {
  constructor(private router: Router) {}

  goToMenu() {
    this.router.navigate(['']);
  }

  bool = signal<boolean>(true);

  hiddeSnackname() {
    this.bool.update((v) => !v);
  }

  snackCategory = signal<SnackCategory>({
    uuid: crypto.randomUUID(),
    name: 'Marquesitas',
    snackitems: [
      { uuid: crypto.randomUUID(), name: 'Fresas' },
      { uuid: crypto.randomUUID(), name: 'Kitkat' },
    ],
    isVisible: true,
  });

  snackCategory2 = signal<SnackCategory>({
    uuid: crypto.randomUUID(),
    name: 'Postres',
    snackitems: [
      { uuid: crypto.randomUUID(), name: 'Fresas' },
      { uuid: crypto.randomUUID(), name: 'Kitkat' },
    ],
    isVisible: true,
  });

  snackCategorys = signal([this.snackCategory(), this.snackCategory2()]);
  toggleVisibility(uuid: string) {
    this.snackCategorys.update((categories) =>
      categories.map((cat) => (cat.uuid === uuid ? { ...cat, isVisible: !cat.isVisible } : cat)),
    );
  }

  snackname = this.snackCategory().name;

  items: SnackItem[] = this.snackCategory().snackitems;
}

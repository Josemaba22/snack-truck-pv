import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SnackCategory } from './../../shared/interfaces/SnackCategory';
import { Snack } from './../../shared/interfaces/Snack';

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

  goToNewSnack(snack: Snack) {
    this.router.navigate(['nueva-orden/new-snack'], {
      state: { snack: snack },
    });
  }

  hiddeSnackname() {
    this.bool.update((v) => !v);
  }

  snackCategory = signal<SnackCategory>({
    uuid: crypto.randomUUID(),
    name: 'Marquesitas',
    snacks: [
      { uuid: crypto.randomUUID(), name: 'Fresas' },
      { uuid: crypto.randomUUID(), name: 'Kitkat' },
    ],
    isVisible: true,
  });

  snackCategory2 = signal<SnackCategory>({
    uuid: crypto.randomUUID(),
    name: 'Postres',
    snacks: [
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

  items: Snack[] = this.snackCategory().snacks;
}

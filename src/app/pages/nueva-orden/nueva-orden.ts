import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  snackname = 'Marquesitas';

  items: string[] = ['sas', 'ses'];
}

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-orden',
  imports: [],
  templateUrl: './nueva-orden.html',
  styleUrl: './nueva-orden.css',
})
export class NuevaOrden {
  constructor(private router: Router) {}

  goToMenu() {
    this.router.navigate(['']);
  }

  snackname = 'Marquesitas';
}

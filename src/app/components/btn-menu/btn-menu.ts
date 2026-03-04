import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './btn-menu.html',
  styleUrl: './btn-menu.css',
})
export class BtnMenu {
  @Input() route: string = '';
  @Input() label: string = '☰ Menú';

  constructor(private router: Router) {}

  goToMenu() {
    this.router.navigate([this.route || '']);
  }
}

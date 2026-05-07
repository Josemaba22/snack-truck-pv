import { Component, signal, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-hamburguesa',
  imports: [RouterLink],
  templateUrl: './menu-hamburguesa.html',
  styleUrl: './menu-hamburguesa.css',
})
export class MenuHamburguesa {
  isOpen = signal(false);
  closeMenu = output<void>();

  toggle() {
    this.isOpen.update(v => !v);
  }

  onOverlayClick() {
    this.isOpen.set(false);
    this.closeMenu.emit();
  }
}

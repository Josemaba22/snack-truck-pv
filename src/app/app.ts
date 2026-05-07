import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { Menu } from './pages/menu/menu';
import { MenuHamburguesa } from './components/menu-hamburguesa/menu-hamburguesa';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, Menu, MenuHamburguesa],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('markesitas');
  protected readonly showMenuHamburguesa = computed(() => {
    const path = this.router.url.split('?')[0];
    return path !== '/' && path !== '';
  });

  constructor(private router: Router) {}
}

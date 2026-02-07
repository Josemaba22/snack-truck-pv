import { Routes } from '@angular/router';
import { Menu } from './pages/menu/menu';
import { NuevaOrden } from './pages/nueva-orden/nueva-orden';

export const routes: Routes = [
  {
    path: '',
    component: Menu,
  },
  {
    path: 'nueva-orden',
    component: NuevaOrden,
  },
];

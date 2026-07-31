import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pos', pathMatch: 'full' },
  { path: 'pos', loadComponent: () => import('./pages/pos/pos').then((m) => m.Pos) },
  { path: 'kitchen', loadComponent: () => import('./pages/kitchen/kitchen').then((m) => m.Kitchen) },
  {
    path: 'orders-history',
    loadComponent: () => import('./pages/orders-history/orders-history').then((m) => m.OrdersHistory),
  },
  {
    path: 'cash-closing',
    loadComponent: () => import('./pages/cash-closing/cash-closing').then((m) => m.CashClosing),
  },
  { path: '**', redirectTo: 'pos' },
];

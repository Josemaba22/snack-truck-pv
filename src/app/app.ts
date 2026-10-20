import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Menu } from './shared/menu/menu';
import { SyncStatus } from './shared/sync-status/sync-status';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, SyncStatus],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

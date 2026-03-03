import { Component, signal } from '@angular/core';
import { Snack } from './../../shared/interfaces/Snack';

@Component({
  selector: 'app-new-snack',
  imports: [],
  templateUrl: './new-snack.html',
  styleUrl: './new-snack.css',
})
export class NewSnack {
  marquesita = signal<Snack>({
    uuid: crypto.randomUUID(),
    name: 'Marquesita',
  });
}

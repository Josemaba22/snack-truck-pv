import { Component, signal } from '@angular/core';
import { Snack } from './../../shared/interfaces/Snack';
import { BtnMenu } from '../../components/btn-menu/btn-menu';

@Component({
  selector: 'app-new-snack',
  imports: [BtnMenu],
  templateUrl: './new-snack.html',
  styleUrl: './new-snack.css',
})
export class NewSnack {
  marquesita = signal<Snack>({
    uuid: crypto.randomUUID(),
    name: 'Marquesita',
  });
}

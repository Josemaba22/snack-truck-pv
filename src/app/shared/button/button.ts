import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {
  variant = input('primary');

  size = input('md');

  fullWidth = input(false);

  loading = input(false);

  disabled = input(false);

  clicked = output<void>();

  get classes(): string[] {
    return [
      `btn-${this.variant()}`,
      `btn-${this.size()}`,
      this.fullWidth() ? 'btn-full' : '',
      this.loading() ? 'btn-loading' : '',
    ];
  }

  handleClick(): void {
    if (this.disabled() || this.loading()) {
      return;
    }

    this.clicked.emit();
  }
}

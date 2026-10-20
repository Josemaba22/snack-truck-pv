import { Component, computed } from '@angular/core';

import { SyncService } from '../../services/sync';

@Component({
  selector: 'app-sync-status',
  templateUrl: './sync-status.html',
  styleUrl: './sync-status.css',
})
export class SyncStatus {
  readonly label = computed(() => {
    if (this.sync.failedCount() > 0) {
      return `${this.sync.failedCount()} sin enviar (toca para reintentar)`;
    }
    if (!this.sync.online()) {
      const pending = this.sync.pendingCount();
      return pending > 0 ? `Sin conexión · ${pending} por enviar` : 'Sin conexión';
    }
    if (this.sync.syncing() || this.sync.pendingCount() > 0) {
      return 'Sincronizando...';
    }
    return null;
  });

  readonly tone = computed(() => {
    if (this.sync.failedCount() > 0) {
      return 'error';
    }
    return this.sync.online() ? 'info' : 'offline';
  });

  constructor(readonly sync: SyncService) {}
}

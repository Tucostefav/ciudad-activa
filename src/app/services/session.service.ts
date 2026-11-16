import { Injectable, inject, signal } from '@angular/core';

import type { UserRole } from '../models/enums';
import type { SessionData } from '../models/user.model';

import { StorageService } from './storage.service';

// Guarda en memoria el perfil del usuario (con su rol) y lo respalda en
// Capacitor Preferences para no leer Firestore en cada pantalla.
@Injectable({ providedIn: 'root' })
export class SessionService {
  private storage = inject(StorageService);
  private session = signal<SessionData | null>(null);

  readonly current = this.session.asReadonly();

  async restore(): Promise<void> {
    this.session.set(await this.storage.getSession());
  }

  async set(data: SessionData): Promise<void> {
    await this.storage.setSession(data);
    this.session.set(data);
  }

  async clear(): Promise<void> {
    await this.storage.clearSession();
    this.session.set(null);
  }

  isLoggedIn(): boolean {
    return this.session() !== null;
  }

  getRole(): UserRole | null {
    return this.session()?.role ?? null;
  }

  getUid(): string | null {
    return this.session()?.uid ?? null;
  }
}

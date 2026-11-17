import { Injectable, inject, signal } from '@angular/core';

import type { UserRole } from '../models/enums';
import type { SessionData } from '../models/user.model';

import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);
  private session = signal<SessionData | null>(null);

  readonly currentUser = this.session.asReadonly();

  // Se llama al iniciar la app para recuperar la sesión guardada
  async restoreSession(): Promise<void> {
    this.session.set(await this.storage.getSession());
  }

  // Fase 1: inicio de sesión simulado, el rol lo elige el usuario en el formulario.
  // En la Fase 2 se valida contra Firebase Authentication y el rol sale de Firestore.
  async login(email: string, password: string, role: UserRole = 'citizen'): Promise<SessionData> {
    const data: SessionData = {
      uid: `demo-${role}`,
      full_name: email.split('@')[0],
      email,
      role,
    };
    await this.storage.setSession(data);
    this.session.set(data);
    return data;
  }

  async logout(): Promise<void> {
    await this.storage.clearSession();
    this.session.set(null);
  }

  isLoggedIn(): boolean {
    return this.session() !== null;
  }

  getRole(): UserRole | null {
    return this.session()?.role ?? null;
  }
}

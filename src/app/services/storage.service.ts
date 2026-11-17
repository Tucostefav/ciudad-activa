import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import type { SessionData } from '../models/user.model';

const SESSION_KEY = 'ca_session';

// Envuelve Capacitor Preferences para guardar la sesión en el dispositivo
@Injectable({ providedIn: 'root' })
export class StorageService {
  async setSession(data: SessionData): Promise<void> {
    await Preferences.set({ key: SESSION_KEY, value: JSON.stringify(data) });
  }

  async getSession(): Promise<SessionData | null> {
    const { value } = await Preferences.get({ key: SESSION_KEY });
    return value ? (JSON.parse(value) as SessionData) : null;
  }

  async clearSession(): Promise<void> {
    await Preferences.remove({ key: SESSION_KEY });
  }
}

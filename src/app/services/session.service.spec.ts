import { TestBed } from '@angular/core/testing';

import type { SessionData } from '../models/user.model';

import { SessionService } from './session.service';
import { StorageService } from './storage.service';

const officer: SessionData = {
  uid: 'uid-123',
  full_name: 'Ana Pérez',
  email: 'ana@correo.com',
  role: 'officer',
};

describe('SessionService', () => {
  let session: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    session = TestBed.inject(SessionService);
  });

  afterEach(async () => {
    await session.clear();
  });

  it('guarda el perfil en memoria y en el dispositivo', async () => {
    await session.set(officer);

    expect(session.isLoggedIn()).toBe(true);
    expect(session.getRole()).toBe('officer');
    expect(session.getUid()).toBe('uid-123');

    const saved = await TestBed.inject(StorageService).getSession();
    expect(saved?.email).toBe('ana@correo.com');
  });

  it('recupera la sesión guardada al reabrir la app', async () => {
    await session.set(officer);

    const otraInstancia = TestBed.runInInjectionContext(() => new SessionService());
    expect(otraInstancia.isLoggedIn()).toBe(false);
    await otraInstancia.restore();
    expect(otraInstancia.getRole()).toBe('officer');
  });

  it('limpia la sesión al cerrar sesión', async () => {
    await session.set(officer);
    await session.clear();

    expect(session.isLoggedIn()).toBe(false);
    expect(await TestBed.inject(StorageService).getSession()).toBeNull();
  });
});

import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';

describe('AuthService (sesión simulada)', () => {
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    auth = TestBed.inject(AuthService);
  });

  afterEach(async () => {
    await auth.logout();
  });

  it('guarda la sesión al iniciar sesión', async () => {
    await auth.login('carlos@correo.com', '123456', 'admin');

    expect(auth.isLoggedIn()).toBe(true);
    expect(auth.getRole()).toBe('admin');

    const saved = await TestBed.inject(StorageService).getSession();
    expect(saved?.email).toBe('carlos@correo.com');
  });

  it('recupera la sesión guardada al reabrir la app', async () => {
    await auth.login('carlos@correo.com', '123456', 'citizen');

    const otraInstancia = TestBed.runInInjectionContext(() => new AuthService());
    expect(otraInstancia.isLoggedIn()).toBe(false);
    await otraInstancia.restoreSession();
    expect(otraInstancia.getRole()).toBe('citizen');
  });

  it('limpia la sesión al cerrar sesión', async () => {
    await auth.login('carlos@correo.com', '123456', 'citizen');
    await auth.logout();

    expect(auth.isLoggedIn()).toBe(false);
    expect(await TestBed.inject(StorageService).getSession()).toBeNull();
  });
});

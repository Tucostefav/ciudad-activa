import { TestBed } from '@angular/core/testing';
import type { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router, UrlTree, provideRouter } from '@angular/router';

import { SessionService } from '../services/session.service';

import { roleGuard } from './role.guard';

function runGuard(roles: string[]) {
  const route = { data: { roles } } as unknown as ActivatedRouteSnapshot;
  return TestBed.runInInjectionContext(() => roleGuard(route, {} as RouterStateSnapshot));
}

describe('roleGuard', () => {
  let session: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
    session = TestBed.inject(SessionService);
  });

  afterEach(async () => {
    await session.clear();
  });

  it('manda al login si no hay sesión', () => {
    const result = runGuard(['citizen']);
    const router = TestBed.inject(Router);
    expect(result instanceof UrlTree && router.serializeUrl(result)).toBe('/login');
  });

  it('deja pasar al rol permitido', async () => {
    await session.set({ uid: 'u1', full_name: 'Luis', email: 'luis@correo.com', role: 'citizen' });
    expect(runGuard(['citizen'])).toBe(true);
  });

  it('manda al inicio si el rol no corresponde', async () => {
    await session.set({ uid: 'u1', full_name: 'Luis', email: 'luis@correo.com', role: 'citizen' });
    const result = runGuard(['officer']);
    const router = TestBed.inject(Router);
    expect(result instanceof UrlTree && router.serializeUrl(result)).toBe('/home');
  });
});

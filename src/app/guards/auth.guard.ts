import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { SessionService } from '../services/session.service';

// Deja pasar solo si hay una sesión iniciada
export const authGuard: CanActivateFn = () => {
  const session = inject(SessionService);
  const router = inject(Router);

  return session.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

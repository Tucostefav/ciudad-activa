import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import type { UserRole } from '../models/enums';
import { AuthService } from '../services/auth.service';

// Uso en las rutas: canActivate: [roleGuard], data: { roles: ['officer'] }
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const allowed = route.data['roles'] as UserRole[] | undefined;
  const role = auth.getRole();
  if (allowed && (!role || !allowed.includes(role))) {
    return router.createUrlTree(['/home']);
  }
  return true;
};

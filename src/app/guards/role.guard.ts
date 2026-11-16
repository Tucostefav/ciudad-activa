import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import type { UserRole } from '../models/enums';
import { SessionService } from '../services/session.service';

// Uso en las rutas: canActivate: [roleGuard], data: { roles: ['officer'] }
// El rol viene del perfil en Firestore que se guardó al iniciar sesión.
export const roleGuard: CanActivateFn = (route) => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const allowed = route.data['roles'] as UserRole[] | undefined;
  const role = session.getRole();
  if (allowed && (!role || !allowed.includes(role))) {
    return router.createUrlTree(['/home']);
  }
  return true;
};

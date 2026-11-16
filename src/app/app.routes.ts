import type { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'reports',
    canActivate: [roleGuard],
    data: { roles: ['citizen'] },
    loadComponent: () => import('./pages/reports/reports.page').then((m) => m.ReportsPage),
  },
  {
    path: 'map',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/map/map.page').then((m) => m.MapPage),
  },
  {
    path: 'management',
    canActivate: [roleGuard],
    data: { roles: ['officer'] },
    loadComponent: () => import('./pages/management/management.page').then((m) => m.ManagementPage),
  },
  {
    path: 'admin',
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

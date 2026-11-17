import type { ApplicationConfig } from '@angular/core';
import { inject, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  provideRouter,
  withComponentInputBinding,
  withPreloading,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'md' }),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),

    // Firebase (AngularFire)
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),

    // Recupera la sesión guardada antes de que los guards revisen la primera ruta
    provideAppInitializer(() => inject(AuthService).restoreSession()),
  ],
};

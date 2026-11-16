import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  clipboardOutline,
  documentTextOutline,
  homeOutline,
  logOutOutline,
  mapOutline,
  settingsOutline,
} from 'ionicons/icons';

import type { UserRole } from './models/enums';
import { ROLE_LABELS } from './models/enums';
import { AuthService } from './services/auth.service';

interface MenuOption {
  title: string;
  url: string;
  icon: string;
  roles: UserRole[];
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonNote,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly user = this.auth.currentUser;
  readonly roleLabels = ROLE_LABELS;

  private readonly options: MenuOption[] = [
    { title: 'Inicio', url: '/home', icon: 'home-outline', roles: ['citizen', 'officer', 'admin'] },
    { title: 'Mis reportes', url: '/reports', icon: 'document-text-outline', roles: ['citizen'] },
    { title: 'Reportes entrantes', url: '/management', icon: 'clipboard-outline', roles: ['officer'] },
    { title: 'Mapa', url: '/map', icon: 'map-outline', roles: ['citizen', 'officer', 'admin'] },
    { title: 'Administración', url: '/admin', icon: 'settings-outline', roles: ['admin'] },
  ];

  // Opciones del menú según el rol de la sesión
  readonly menuOptions = computed(() => {
    const role = this.user()?.role;
    return role ? this.options.filter((option) => option.roles.includes(role)) : [];
  });

  constructor() {
    addIcons({ homeOutline, documentTextOutline, clipboardOutline, mapOutline, settingsOutline, logOutOutline });
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}

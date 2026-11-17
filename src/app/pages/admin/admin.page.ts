import { Component } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';

import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

// Panel del administrador (categorías e indicadores)
@Component({
  selector: 'app-admin',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Administración</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-empty-state icon="settings-outline" message="Aquí se gestionarán las categorías y los indicadores."></app-empty-state>
    </ion-content>
  `,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, EmptyStateComponent],
})
export class AdminPage {}

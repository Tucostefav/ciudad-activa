import { Component } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';

import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

// Vista del funcionario municipal
@Component({
  selector: 'app-management',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Reportes entrantes</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-empty-state icon="clipboard-outline" message="No hay reportes pendientes de revisión."></app-empty-state>
    </ion-content>
  `,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, EmptyStateComponent],
})
export class ManagementPage {}

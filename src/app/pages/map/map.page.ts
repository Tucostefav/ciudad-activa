import { Component } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';

import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-map',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-menu-button></ion-menu-button>
        </ion-buttons>
        <ion-title>Mapa</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-empty-state icon="map-outline" message="Aquí se mostrarán los reportes ubicados en el mapa."></app-empty-state>
    </ion-content>
  `,
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, EmptyStateComponent],
})
export class MapPage {}

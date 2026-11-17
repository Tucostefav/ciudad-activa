import { Component } from '@angular/core';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular';

import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { ReportCardComponent } from '../../components/report-card/report-card.component';
import type { Report } from '../../models/reporte.model';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    ReportCardComponent,
    EmptyStateComponent,
  ],
})
export class ReportsPage {
  // Datos de prueba de la Fase 1. En la Fase 2 la lista se lee de Firestore con DataService.
  readonly reports: Report[] = [
    {
      id: 'r1',
      owner_uid: 'demo-citizen',
      category_id: 'baches',
      title: 'Hueco grande en la vía principal',
      latitude: 8.9824,
      longitude: -79.5199,
      status: 'received',
    },
    {
      id: 'r2',
      owner_uid: 'demo-citizen',
      category_id: 'alumbrado',
      title: 'Luminaria apagada frente al parque',
      latitude: 8.9936,
      longitude: -79.5101,
      status: 'in_progress',
    },
    {
      id: 'r3',
      owner_uid: 'demo-citizen',
      category_id: 'basura',
      title: 'Acumulación de basura en la esquina',
      latitude: 9.0012,
      longitude: -79.5023,
      status: 'resolved',
    },
  ];

  readonly categoryNames: Record<string, string> = {
    baches: 'Baches',
    alumbrado: 'Alumbrado público',
    basura: 'Recolección de basura',
  };
}

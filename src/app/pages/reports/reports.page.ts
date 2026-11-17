import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { map } from 'rxjs';

import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { ReportCardComponent } from '../../components/report-card/report-card.component';
import type { ReportStatus } from '../../models/reporte.model';
import { DataService } from '../../services/data.service';
import { SessionService } from '../../services/session.service';

type Filter = 'active' | 'closed' | 'all';

const CLOSED: ReportStatus[] = ['resolved', 'rejected', 'cancelled'];

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonSpinner,
    IonFab,
    IonFabButton,
    IonIcon,
    ReportCardComponent,
    EmptyStateComponent,
  ],
})
export class ReportsPage {
  private data = inject(DataService);
  private session = inject(SessionService);

  readonly filter = signal<Filter>('active');

  // Se actualiza sola cuando cambia algo en Firestore
  readonly reports = toSignal(this.data.getReportsByOwner(this.session.getUid() ?? ''));

  readonly categoryNames = toSignal(
    this.data.getCategories().pipe(map((list) => Object.fromEntries(list.map((c) => [c.id, c.name])))),
    { initialValue: {} as Record<string, string> },
  );

  readonly filtered = computed(() => {
    const list = this.reports() ?? [];
    switch (this.filter()) {
      case 'active':
        return list.filter((r) => !CLOSED.includes(r.status));
      case 'closed':
        return list.filter((r) => CLOSED.includes(r.status));
      default:
        return list;
    }
  });

  constructor() {
    addIcons({ add });
  }

  onFilterChange(value: unknown): void {
    this.filter.set(value as Filter);
  }
}

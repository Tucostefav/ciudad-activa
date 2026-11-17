import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { map } from 'rxjs';

import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { ReportCardComponent } from '../../components/report-card/report-card.component';
import type { ReportStatus } from '../../models/reporte.model';
import { DataService } from '../../services/data.service';

type Filter = 'pending' | 'in_progress' | 'closed';

// Vista del funcionario municipal: todos los reportes en tiempo real
@Component({
  selector: 'app-management',
  templateUrl: './management.page.html',
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
    ReportCardComponent,
    EmptyStateComponent,
  ],
})
export class ManagementPage {
  private data = inject(DataService);

  readonly filter = signal<Filter>('pending');
  readonly reports = toSignal(this.data.getReports());

  readonly categoryNames = toSignal(
    this.data.getCategories().pipe(map((list) => Object.fromEntries(list.map((c) => [c.id, c.name])))),
    { initialValue: {} as Record<string, string> },
  );

  private readonly groups: Record<Filter, ReportStatus[]> = {
    pending: ['received', 'in_review'],
    in_progress: ['in_progress'],
    closed: ['resolved', 'rejected', 'cancelled'],
  };

  readonly filtered = computed(() =>
    (this.reports() ?? []).filter((r) => this.groups[this.filter()].includes(r.status)),
  );

  onFilterChange(value: unknown): void {
    this.filter.set(value as Filter);
  }
}

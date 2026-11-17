import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';
import { catchError, map, of } from 'rxjs';

import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { CANCELLABLE_STATUS, NEXT_STATUS, STATUS_COLORS, STATUS_LABELS } from '../../models/enums';
import type { Report, ReportStatus } from '../../models/reporte.model';
import { DataService } from '../../services/data.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-reports-detail',
  templateUrl: './reports-detail.page.html',
  styleUrls: ['./reports-detail.page.scss'],
  imports: [
    DatePipe,
    DecimalPipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonSpinner,
    EmptyStateComponent,
  ],
})
export class ReportsDetailPage {
  private route = inject(ActivatedRoute);
  private data = inject(DataService);
  private session = inject(SessionService);
  private alert = inject(AlertController);
  private toast = inject(ToastController);

  readonly id = this.route.snapshot.paramMap.get('id') ?? '';
  readonly statusLabels = STATUS_LABELS;
  readonly statusColors = STATUS_COLORS;
  readonly working = signal(false);

  // null = no existe o no tiene permiso para verlo
  readonly report = toSignal(
    this.data.getReport(this.id).pipe(
      map((r) => r ?? null),
      catchError(() => of(null)),
    ),
  );

  readonly history = toSignal(this.data.getStatusHistory(this.id).pipe(catchError(() => of([]))), {
    initialValue: [],
  });

  readonly categoryName = toSignal(
    this.data.getCategories().pipe(map((list) => (id: string) => list.find((c) => c.id === id)?.name ?? '')),
    { initialValue: () => '' },
  );

  // Estados a los que el funcionario puede mover el reporte
  readonly nextStatus = computed<ReportStatus[]>(() => {
    const r = this.report();
    return r && this.session.getRole() === 'officer' ? NEXT_STATUS[r.status] : [];
  });

  readonly canCancel = computed(() => {
    const r = this.report();
    return !!r && r.owner_uid === this.session.getUid() && CANCELLABLE_STATUS.includes(r.status);
  });

  constructor() {
    addIcons({ alertCircleOutline });
  }

  async confirmChange(report: Report, status: ReportStatus): Promise<void> {
    const alert = await this.alert.create({
      header: 'Cambiar estado',
      message: `¿Pasar el reporte a "${STATUS_LABELS[status]}"?`,
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí, cambiar', handler: () => this.changeStatus(report, status) },
      ],
    });
    await alert.present();
  }

  async confirmCancel(report: Report): Promise<void> {
    const alert = await this.alert.create({
      header: 'Cancelar reporte',
      message: 'El reporte quedará como cancelado y ya no se atenderá. ¿Deseas continuar?',
      buttons: [
        { text: 'No', role: 'cancel' },
        { text: 'Sí, cancelar', role: 'destructive', handler: () => this.cancel(report) },
      ],
    });
    await alert.present();
  }

  private async changeStatus(report: Report, status: ReportStatus): Promise<void> {
    const officer = this.session.current();
    if (!officer) return;
    this.working.set(true);
    try {
      await this.data.changeStatus(report, status, officer);
      await this.showToast(`Estado actualizado a "${STATUS_LABELS[status]}"`, 'success');
    } catch {
      await this.showToast('No se pudo cambiar el estado.', 'danger');
    } finally {
      this.working.set(false);
    }
  }

  private async cancel(report: Report): Promise<void> {
    this.working.set(true);
    try {
      await this.data.cancelReport(report.id);
      await this.showToast('El reporte fue cancelado', 'success');
    } catch {
      await this.showToast('No se pudo cancelar el reporte.', 'danger');
    } finally {
      this.working.set(false);
    }
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toast.create({ message, duration: 2500, color });
    await toast.present();
  }
}

import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip } from '@ionic/angular';

import { STATUS_COLORS, STATUS_LABELS } from '../../models/enums';
import type { Report } from '../../models/reporte.model';

@Component({
  selector: 'app-report-card',
  templateUrl: './report-card.component.html',
  styleUrls: ['./report-card.component.scss'],
  imports: [DatePipe, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonChip],
})
export class ReportCardComponent {
  readonly report = input.required<Report>();
  readonly categoryName = input<string>('');
  // El funcionario necesita ver quién hizo el reporte
  readonly showOwner = input(false);

  readonly statusLabels = STATUS_LABELS;
  readonly statusColors = STATUS_COLORS;
}

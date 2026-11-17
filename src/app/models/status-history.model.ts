import type { Timestamp } from '@angular/fire/firestore';

import type { ReportStatus } from './reporte.model';

export interface StatusHistory {
  id: string;
  report_id: string;
  old_status: ReportStatus;
  new_status: ReportStatus;
  changed_by_user_id: string;
  changed_by_name: string;
  changed_at?: Timestamp;
}

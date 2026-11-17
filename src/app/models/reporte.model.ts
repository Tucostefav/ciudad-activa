import type { Timestamp } from '@angular/fire/firestore';

export type ReportStatus = 'received' | 'in_review' | 'in_progress' | 'resolved' | 'rejected' | 'cancelled';

export interface Report {
  id: string;
  owner_uid: string; // uid de Firebase del ciudadano que crea el reporte
  owner_name: string; // copia del nombre para no leer users en cada lista
  category_id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
  created_at?: Timestamp;
  updated_at?: Timestamp;
}

// Lo que llena el ciudadano en el formulario
export type NewReport = Pick<Report, 'category_id' | 'title' | 'description' | 'latitude' | 'longitude'>;

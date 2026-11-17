export type ReportStatus = 'received' | 'in_review' | 'in_progress' | 'resolved' | 'rejected';

export interface Report {
  id: string;
  owner_uid: string; // uid de Firebase del ciudadano que crea el reporte
  category_id: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  status: ReportStatus;
}

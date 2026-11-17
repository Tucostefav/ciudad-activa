import type { ReportStatus } from './reporte.model';

export type UserRole = 'citizen' | 'officer' | 'admin';

export const ROLE_LABELS: Record<UserRole, string> = {
  citizen: 'Ciudadano',
  officer: 'Funcionario municipal',
  admin: 'Administrador',
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  received: 'Recibido',
  in_review: 'En revisión',
  in_progress: 'En atención',
  resolved: 'Resuelto',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};

// Color de Ionic que usa cada estado en los chips
export const STATUS_COLORS: Record<ReportStatus, string> = {
  received: 'medium',
  in_review: 'tertiary',
  in_progress: 'warning',
  resolved: 'success',
  rejected: 'danger',
  cancelled: 'dark',
};

// A qué estados puede pasar el funcionario desde cada estado
export const NEXT_STATUS: Record<ReportStatus, ReportStatus[]> = {
  received: ['in_review'],
  in_review: ['in_progress', 'rejected'],
  in_progress: ['resolved'],
  resolved: [],
  rejected: [],
  cancelled: [],
};

// El ciudadano solo puede cancelar mientras nadie ha empezado a atender el reporte
export const CANCELLABLE_STATUS: ReportStatus[] = ['received', 'in_review'];

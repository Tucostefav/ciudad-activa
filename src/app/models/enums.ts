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
};

// Color de Ionic que usa cada estado en los chips
export const STATUS_COLORS: Record<ReportStatus, string> = {
  received: 'medium',
  in_review: 'tertiary',
  in_progress: 'warning',
  resolved: 'success',
  rejected: 'danger',
};

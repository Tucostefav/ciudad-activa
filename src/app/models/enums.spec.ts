import { CANCELLABLE_STATUS, NEXT_STATUS, STATUS_LABELS } from './enums';
import type { ReportStatus } from './reporte.model';

describe('Flujo de estados del reporte', () => {
  it('todos los estados tienen etiqueta en español', () => {
    const statuses = Object.keys(NEXT_STATUS) as ReportStatus[];
    for (const status of statuses) {
      expect(STATUS_LABELS[status]).toBeTruthy();
    }
  });

  it('sigue el orden recibido → revisión → atención → resuelto', () => {
    expect(NEXT_STATUS.received).toEqual(['in_review']);
    expect(NEXT_STATUS.in_review).toContain('in_progress');
    expect(NEXT_STATUS.in_review).toContain('rejected');
    expect(NEXT_STATUS.in_progress).toEqual(['resolved']);
  });

  it('los estados finales no tienen siguiente paso', () => {
    expect(NEXT_STATUS.resolved).toEqual([]);
    expect(NEXT_STATUS.rejected).toEqual([]);
    expect(NEXT_STATUS.cancelled).toEqual([]);
  });

  it('el ciudadano no puede cancelar un reporte que ya está en atención', () => {
    expect(CANCELLABLE_STATUS).not.toContain('in_progress');
    expect(CANCELLABLE_STATUS).toContain('received');
  });
});

import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from '@angular/fire/firestore';
import type { Observable } from 'rxjs';

import type { Category } from '../models/category.model';
import type { NewReport, Report, ReportStatus } from '../models/reporte.model';
import type { StatusHistory } from '../models/status-history.model';
import type { SessionData } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private firestore = inject(Firestore);

  // Todos los reportes, del más reciente al más antiguo (vista del funcionario)
  getReports(): Observable<Report[]> {
    const ref = collection(this.firestore, 'reports');
    const q = query(ref, orderBy('created_at', 'desc'));
    // idField copia el id del documento dentro de cada objeto
    return collectionData(q, { idField: 'id' }) as Observable<Report[]>;
  }

  // Lista en tiempo real de los reportes del usuario actual
  getReportsByOwner(uid: string): Observable<Report[]> {
    const ref = collection(this.firestore, 'reports');
    const q = query(ref, where('owner_uid', '==', uid), orderBy('created_at', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Report[]>;
  }

  getReport(id: string): Observable<Report | undefined> {
    return docData(doc(this.firestore, 'reports', id), { idField: 'id' }) as Observable<Report | undefined>;
  }

  getCategories(): Observable<Category[]> {
    const q = query(collection(this.firestore, 'categories'), orderBy('name'));
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }

  getStatusHistory(reportId: string): Observable<StatusHistory[]> {
    const ref = collection(this.firestore, 'report_status_history');
    const q = query(ref, where('report_id', '==', reportId), orderBy('changed_at', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<StatusHistory[]>;
  }

  // Create: el reporte nace siempre en received y a nombre de quien lo crea
  async createReport(data: NewReport, user: SessionData): Promise<string> {
    const ref = await addDoc(collection(this.firestore, 'reports'), {
      ...data,
      owner_uid: user.uid,
      owner_name: user.full_name,
      status: 'received',
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return ref.id;
  }

  // Update: el funcionario cambia el estado y en la misma operación queda el historial
  async changeStatus(report: Report, newStatus: ReportStatus, officer: SessionData): Promise<void> {
    const batch = writeBatch(this.firestore);
    batch.update(doc(this.firestore, 'reports', report.id), {
      status: newStatus,
      updated_at: serverTimestamp(),
    });
    batch.set(doc(collection(this.firestore, 'report_status_history')), {
      report_id: report.id,
      old_status: report.status,
      new_status: newStatus,
      changed_by_user_id: officer.uid,
      changed_by_name: officer.full_name,
      changed_at: serverTimestamp(),
    });
    await batch.commit();
  }

  // Delete lógico: no se borra el documento, se marca como cancelado
  cancelReport(id: string): Promise<void> {
    return updateDoc(doc(this.firestore, 'reports', id), {
      status: 'cancelled',
      updated_at: serverTimestamp(),
    });
  }
}

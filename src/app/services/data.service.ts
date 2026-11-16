import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import type { Observable } from 'rxjs';

import type { Report } from '../models/reporte.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private firestore = inject(Firestore);

  getReports(): Observable<Report[]> {
    const ref = collection(this.firestore, 'reports');
    // idField copia el id del documento dentro de cada objeto
    return collectionData(ref, { idField: 'id' }) as Observable<Report[]>;
  }
}

import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { locateOutline } from 'ionicons/icons';

import { DataService } from '../../services/data.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-reports-form',
  templateUrl: './reports-form.page.html',
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonNote,
    IonSpinner,
  ],
})
export class ReportsFormPage {
  private fb = inject(FormBuilder);
  private data = inject(DataService);
  private session = inject(SessionService);
  private router = inject(Router);
  private toast = inject(ToastController);

  readonly categories = toSignal(this.data.getCategories(), { initialValue: [] });
  readonly saving = signal(false);
  readonly locating = signal(false);

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(80)]],
    category_id: ['', Validators.required],
    description: ['', Validators.maxLength(500)],
    latitude: [null as number | null, [Validators.required, Validators.min(-90), Validators.max(90)]],
    longitude: [null as number | null, [Validators.required, Validators.min(-180), Validators.max(180)]],
  });

  constructor() {
    addIcons({ locateOutline });
  }

  // Toma la ubicación del dispositivo. En la Fase 3 se cambia por el plugin
  // Geolocation de Capacitor para pedir el permiso nativo en Android.
  useMyLocation(): void {
    if (!navigator.geolocation) {
      this.showToast('Este dispositivo no permite obtener la ubicación.', 'warning');
      return;
    }
    this.locating.set(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.form.patchValue({
          latitude: Number(pos.coords.latitude.toFixed(6)),
          longitude: Number(pos.coords.longitude.toFixed(6)),
        });
        this.locating.set(false);
      },
      () => {
        this.locating.set(false);
        this.showToast('No se pudo obtener la ubicación. Escríbela a mano.', 'warning');
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async submit(): Promise<void> {
    const user = this.session.current();
    if (this.form.invalid || !user) {
      this.form.markAllAsTouched();
      await this.showToast('Completa el título, la categoría y la ubicación.', 'warning');
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    try {
      await this.data.createReport(
        {
          title: value.title!.trim(),
          category_id: value.category_id!,
          description: value.description?.trim() ?? '',
          latitude: Number(value.latitude),
          longitude: Number(value.longitude),
        },
        user,
      );
      await this.showToast('Reporte enviado con éxito', 'success');
      this.form.reset();
      await this.router.navigateByUrl('/reports', { replaceUrl: true });
    } catch {
      await this.showToast('No se pudo guardar el reporte. Intenta de nuevo.', 'danger');
    } finally {
      this.saving.set(false);
    }
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toast.create({ message, duration: 2500, color });
    await toast.present();
  }
}

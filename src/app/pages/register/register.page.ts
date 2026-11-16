import { Component, inject, signal } from '@angular/core';
import type { AbstractControl, ValidationErrors } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';

import { authErrorMessage } from '../../services/auth-errors';
import { AuthService } from '../../services/auth.service';

// Valida que las dos contraseñas coincidan
function samePassword(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirm = group.get('confirm')?.value;
  return password === confirm ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
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
    IonNote,
    IonButton,
    IonSpinner,
  ],
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastController);

  readonly loading = signal(false);

  form = this.fb.nonNullable.group(
    {
      full_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required],
    },
    { validators: samePassword },
  );

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const message = this.form.hasError('mismatch')
        ? 'Las contraseñas no coinciden.'
        : 'Completa todos los campos correctamente.';
      await this.showToast(message, 'warning');
      return;
    }

    const { full_name, email, password } = this.form.getRawValue();
    this.loading.set(true);
    try {
      await this.auth.register(email, password, full_name.trim());
      await this.showToast('Cuenta creada. ¡Bienvenido a CiudadActiva!', 'success');
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (error) {
      await this.showToast(authErrorMessage(error), 'danger');
    } finally {
      this.loading.set(false);
    }
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toast.create({ message, duration: 2500, color });
    await toast.present();
  }
}

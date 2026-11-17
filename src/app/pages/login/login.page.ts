import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';

import type { UserRole } from '../../models/enums';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonNote,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastController);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['citizen' as UserRole, Validators.required],
  });

  ionViewWillEnter(): void {
    // Si ya hay sesión guardada no tiene sentido mostrar el login
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.showToast('Revisa el correo y la contraseña (mínimo 6 caracteres).', 'warning');
      return;
    }

    const { email, password, role } = this.form.getRawValue();
    await this.auth.login(email, password, role);
    this.form.reset();
    await this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toast.create({ message, duration: 2500, color });
    await toast.present();
  }
}

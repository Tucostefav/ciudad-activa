import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';

import { authErrorMessage } from '../../services/auth-errors';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
  ],
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private session = inject(SessionService);
  private router = inject(Router);
  private toast = inject(ToastController);

  readonly loading = signal(false);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  ionViewWillEnter(): void {
    // Si ya hay sesión guardada no tiene sentido mostrar el login
    if (this.session.isLoggedIn()) {
      this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      await this.showToast('Revisa el correo y la contraseña (mínimo 6 caracteres).', 'warning');
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    try {
      await this.auth.login(email, password);
      this.form.reset();
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

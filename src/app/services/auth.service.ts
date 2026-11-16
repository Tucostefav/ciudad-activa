import { Injectable, inject } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

import type { SessionData, User } from '../models/user.model';

import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private session = inject(SessionService);

  // Observable del usuario autenticado en Firebase (o null)
  readonly currentUser$ = user(this.auth);

  // Se ejecuta al abrir la app: recupera la sesión local y la cruza con Firebase.
  // Si Firebase ya no tiene al usuario (token vencido, sesión cerrada en otro lado)
  // se limpia la sesión local para que los guards manden al login.
  async init(): Promise<void> {
    await this.session.restore();
    const firebaseUser = await firstValueFrom(authState(this.auth));
    if (!firebaseUser && this.session.isLoggedIn()) {
      await this.session.clear();
    }
  }

  // El registro desde la app siempre crea ciudadanos. Los funcionarios y
  // administradores se asignan desde la consola de Firebase.
  async register(email: string, password: string, fullName: string): Promise<SessionData> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    const profile: Omit<User, 'uid'> = {
      full_name: fullName,
      email,
      role: 'citizen',
      created_at: Date.now(),
    };
    await setDoc(doc(this.firestore, 'users', cred.user.uid), profile);

    const data: SessionData = { uid: cred.user.uid, full_name: fullName, email, role: 'citizen' };
    await this.session.set(data);
    return data;
  }

  async login(email: string, password: string): Promise<SessionData> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    const profile = await this.getProfile(cred.user.uid);
    if (!profile) {
      // Usuario sin documento en users: no sabemos su rol, no lo dejamos entrar
      await signOut(this.auth);
      throw Object.assign(new Error('Perfil no encontrado'), { code: 'app/profile-not-found' });
    }

    const data: SessionData = {
      uid: cred.user.uid,
      full_name: profile.full_name,
      email: profile.email,
      role: profile.role,
    };
    await this.session.set(data);
    return data;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.session.clear();
  }

  // Lee el perfil (incluye el rol) del usuario
  async getProfile(uid: string): Promise<User | null> {
    const snap = await getDoc(doc(this.firestore, 'users', uid));
    return snap.exists() ? ({ uid, ...snap.data() } as User) : null;
  }
}

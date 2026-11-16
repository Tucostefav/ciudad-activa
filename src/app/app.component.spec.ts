import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        // En la prueba no se usa Firebase de verdad
        { provide: AuthService, useValue: { logout: async () => undefined } },
      ],
    }).compileComponents();
  });

  it('crea la app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra en el menú solo las opciones del rol', async () => {
    const session = TestBed.inject(SessionService);
    await session.set({ uid: 'u1', full_name: 'Ana', email: 'ana@correo.com', role: 'officer' });

    const fixture = TestBed.createComponent(AppComponent);
    const urls = fixture.componentInstance.menuOptions().map((option) => option.url);

    expect(urls).toContain('/management');
    expect(urls).not.toContain('/reports');
    expect(urls).not.toContain('/admin');
    await session.clear();
  });
});

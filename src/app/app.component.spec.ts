import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('crea la app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra en el menú solo las opciones del rol', async () => {
    const auth = TestBed.inject(AuthService);
    await auth.login('ana@correo.com', '123456', 'officer');

    const fixture = TestBed.createComponent(AppComponent);
    const urls = fixture.componentInstance.menuOptions().map((option) => option.url);

    expect(urls).toContain('/management');
    expect(urls).not.toContain('/reports');
    expect(urls).not.toContain('/admin');
    await auth.logout();
  });
});

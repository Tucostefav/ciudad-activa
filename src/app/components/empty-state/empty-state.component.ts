import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { fileTrayOutline } from 'ionicons/icons';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="empty">
      <ion-icon [name]="icon()"></ion-icon>
      <p>{{ message() }}</p>
    </div>
  `,
  styles: `
    .empty {
      text-align: center;
      padding: 48px 24px;
      color: var(--ion-color-medium);
    }
    ion-icon {
      font-size: 56px;
    }
  `,
  imports: [IonIcon],
})
export class EmptyStateComponent {
  readonly message = input('No hay información para mostrar.');
  readonly icon = input('file-tray-outline');

  constructor() {
    addIcons({ fileTrayOutline });
  }
}

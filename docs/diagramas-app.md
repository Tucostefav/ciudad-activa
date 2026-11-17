# Estructura de la app y navegación

## Diagrama de clases

Las páginas dependen de los servicios; los servicios usan los modelos y hablan con Firebase. Ninguna página llama al SDK directamente.

```mermaid
classDiagram
  direction LR
  class LoginPage {
    +form
    +submit()
  }
  class HomePage {
    +user
  }
  class ReportsPage {
    +reports: Report[]
  }
  class AppComponent {
    +menuOptions()
    +logout()
  }
  class AuthService {
    +currentUser
    +login(email, password, role) Promise
    +logout() Promise
    +restoreSession() Promise
    +isLoggedIn() boolean
    +getRole() UserRole
  }
  class StorageService {
    +setSession(data) Promise
    +getSession() Promise
    +clearSession() Promise
  }
  class DataService {
    +getReports() Observable
  }
  class Report {
    +id: string
    +owner_uid: string
    +category_id: string
    +title: string
    +status: ReportStatus
  }
  class User {
    +uid: string
    +full_name: string
    +role: UserRole
  }
  LoginPage --> AuthService : usa
  HomePage --> AuthService : usa
  AppComponent --> AuthService : menú por rol
  ReportsPage --> Report : muestra
  AuthService --> StorageService : guarda sesión
  AuthService --> User : devuelve
  DataService --> Report : devuelve
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/login` | LoginPage | Público |
| `/home` | HomePage | Cualquier usuario con sesión |
| `/reports` | ReportsPage | Ciudadano |
| `/management` | ManagementPage | Funcionario municipal |
| `/admin` | AdminPage | Administrador |
| `/map` | MapPage | Cualquier usuario con sesión |

`authGuard` revisa que haya sesión y `roleGuard` revisa además el rol indicado en `data.roles` de la ruta.

## Diagrama de flujo de la navegación

En la Fase 1 el inicio de sesión es simulado (el rol se elige en el formulario), pero el flujo ya está completo.

```mermaid
flowchart TD
  A([Abre la app]) --> B{¿Hay sesión guardada?}
  B -- No --> L[Pantalla de login]
  L --> C{¿Datos válidos?}
  C -- No --> L
  C -- Sí --> R{¿Qué rol tiene?}
  B -- Sí --> R
  R -- Ciudadano --> H[Inicio y Mis reportes]
  R -- Funcionario --> M[Reportes entrantes]
  R -- Administrador --> D[Panel de administración]
  H --> MENU[Menú lateral: navegar entre páginas]
  M --> MENU
  D --> MENU
  MENU --> F([Cerrar sesión])
  F --> L
```

## Ciclo de estados de un reporte

```mermaid
flowchart LR
  received([Recibido]) --> in_review([En revisión])
  in_review --> in_progress([En atención])
  in_progress --> resolved([Resuelto])
  in_review --> rejected([Rechazado])
```

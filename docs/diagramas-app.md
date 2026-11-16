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
  class RegisterPage {
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
    +currentUser$
    +init() Promise
    +register(email, password, fullName) Promise
    +login(email, password) Promise
    +logout() Promise
    +getProfile(uid) Promise
  }
  class SessionService {
    +current
    +restore() Promise
    +set(data) Promise
    +clear() Promise
    +isLoggedIn() boolean
    +getRole() UserRole
    +getUid() string
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
  RegisterPage --> AuthService : usa
  HomePage --> SessionService : lee el perfil
  AppComponent --> SessionService : menú por rol
  AppComponent --> AuthService : cerrar sesión
  ReportsPage --> Report : muestra
  AuthService --> SessionService : guarda el perfil
  SessionService --> StorageService : Preferences
  AuthService --> User : devuelve
  DataService --> Report : devuelve
```

## Secuencia: inicio de sesión

La app se autentica con Firebase Authentication, lee el perfil (con el rol) en Firestore y lo guarda en el dispositivo para no volver a leerlo en cada pantalla.

```mermaid
sequenceDiagram
  actor U as Usuario
  participant P as LoginPage
  participant A as AuthService
  participant FA as Firebase Auth
  participant FS as Firestore
  participant S as SessionService
  U->>P: Correo y contraseña
  P->>P: Valida el formulario
  P->>A: login(email, password)
  A->>FA: signInWithEmailAndPassword()
  FA-->>A: usuario (uid)
  A->>FS: getDoc(users/uid)
  FS->>FS: Reglas: usuario autenticado
  FS-->>A: perfil con rol
  A->>S: set(perfil)
  S->>S: Guarda en Preferences
  A-->>P: ok
  P->>U: Home según el rol
```

Si la contraseña es incorrecta, Firebase devuelve un código como `auth/invalid-credential` y la página muestra un toast en español ("Correo o contraseña incorrectos.").

## Secuencia: registro

```mermaid
sequenceDiagram
  actor U as Ciudadano
  participant P as RegisterPage
  participant A as AuthService
  participant FA as Firebase Auth
  participant FS as Firestore
  U->>P: Nombre, correo y contraseña
  P->>A: register(email, password, fullName)
  A->>FA: createUserWithEmailAndPassword()
  FA-->>A: uid
  A->>FS: setDoc(users/uid, role = citizen)
  FS->>FS: Reglas: es su propio uid y el rol es citizen
  A-->>P: ok
  P->>U: Toast de bienvenida y Home
```

## Rutas

| Ruta | Página | Acceso |
|---|---|---|
| `/login` | LoginPage | Público |
| `/register` | RegisterPage | Público |
| `/home` | HomePage | Cualquier usuario con sesión |
| `/reports` | ReportsPage | Ciudadano |
| `/management` | ManagementPage | Funcionario municipal |
| `/admin` | AdminPage | Administrador |
| `/map` | MapPage | Cualquier usuario con sesión |

`authGuard` revisa que haya sesión y `roleGuard` revisa además el rol indicado en `data.roles` de la ruta. Desde la Fase 2 el rol sale del perfil en Firestore (ya no es simulado), y las reglas de Firestore lo vuelven a comprobar del lado del servidor.

## Diagrama de flujo de la navegación

```mermaid
flowchart TD
  A([Abre la app]) --> B{¿Hay sesión guardada?}
  B -- No --> L[Pantalla de login]
  L -. ¿No tiene cuenta? .-> REG[Registro como ciudadano]
  REG --> H
  L --> C{¿Firebase acepta las credenciales?}
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

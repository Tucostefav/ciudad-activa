# Catálogo de operaciones de datos

No hay API REST propia: estas son las operaciones que la app hace contra Cloud Firestore desde `DataService` y `AuthService`. Cada una pasa por las reglas de `firestore.rules`.

## DataService

| Operación | Tipo | Colección | Campos que toca | Quién la usa |
|---|---|---|---|---|
| `getReports()` | Read (tiempo real) | `reports` | todos, orden `created_at` desc | Funcionario (ManagementPage) |
| `getReportsByOwner(uid)` | Read (tiempo real) | `reports` | filtro `owner_uid == uid`, orden `created_at` desc | Ciudadano (ReportsPage) |
| `getReport(id)` | Read (tiempo real) | `reports/{id}` | todos | Detalle |
| `getCategories()` | Read (tiempo real) | `categories` | `name` | Formulario y listas |
| `getStatusHistory(reportId)` | Read (tiempo real) | `report_status_history` | filtro `report_id`, orden `changed_at` | Detalle |
| `createReport(data, user)` | Create | `reports` | `title`, `category_id`, `description`, `latitude`, `longitude`, `owner_uid`, `owner_name`, `status = received`, `created_at`, `updated_at` | Ciudadano |
| `changeStatus(report, status, officer)` | Update + Create (batch) | `reports`, `report_status_history` | `status`, `updated_at` / `report_id`, `old_status`, `new_status`, `changed_by_user_id`, `changed_by_name`, `changed_at` | Funcionario |
| `cancelReport(id)` | Update (borrado lógico) | `reports` | `status = cancelled`, `updated_at` | Ciudadano dueño |

## AuthService

| Operación | Servicio | Qué hace |
|---|---|---|
| `register(email, password, fullName)` | Firebase Auth + `users` | Crea la cuenta y el documento `users/{uid}` con rol `citizen`. |
| `login(email, password)` | Firebase Auth + `users` | Inicia sesión y lee el perfil con el rol. |
| `logout()` | Firebase Auth | Cierra la sesión y limpia la sesión local. |
| `getProfile(uid)` | `users` | Lee el perfil de un usuario. |

## Lectura en tiempo real

Las lecturas usan `collectionData` y `docData` de AngularFire, que devuelven Observables. Las páginas los convierten en signals con `toSignal`, que se suscribe y se da de baja sola cuando la página se destruye. Por eso, cuando el funcionario cambia un estado, la lista y el detalle del ciudadano se actualizan sin recargar.

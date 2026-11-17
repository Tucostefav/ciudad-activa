# CiudadActiva

**GovTech Istmo S.A.** — Reportes ciudadanos de incidencias urbanas.

App móvil para que los ciudadanos reporten incidencias de su ciudad (baches, alumbrado, basura, etc.) y para que los funcionarios municipales les den seguimiento hasta resolverlas.

Proyecto de la asignatura **Desarrollo de Aplicaciones Móviles (EID 1022)**.

## Roles

| Rol | Valor en la app | Qué puede hacer |
|---|---|---|
| Ciudadano | `citizen` | Crear reportes, ver sus reportes y seguir su avance. |
| Funcionario municipal | `officer` | Ver los reportes entrantes y cambiar su estado. |
| Administrador | `admin` | Gestionar categorías y consultar indicadores. |

Estados de un reporte: **Recibido → En revisión → En atención → Resuelto** (o **Rechazado**).

## Tecnologías

- Ionic 9 + Angular 21 (modo Material Design) con TypeScript
- Capacitor 8 (Android)
- Firebase: Authentication, Cloud Firestore, Storage, Cloud Messaging y Hosting, usados desde la app con AngularFire
- GitHub Actions para el pipeline y Jira para la gestión

No hay backend propio: la app habla directo con Firebase y la seguridad está en `firestore.rules`. Más detalle en [docs/arquitectura.md](docs/arquitectura.md).

## Requisitos

- Node.js **22.22.3 o superior** (Angular 21 no corre con versiones anteriores)
- Ionic CLI: `npm install -g @ionic/cli`
- Firebase CLI (para reglas y hosting): `npm install -g firebase-tools`
- Android Studio (solo para compilar la app Android)

## Instalación

1. Clonar el repositorio y entrar a la rama de trabajo:
   ```bash
   git clone https://github.com/Tucostefav/ciudad-activa.git
   cd ciudad-activa
   git switch develop
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar Firebase. Hay dos opciones:
   - Copiar `src/environments/environment.example.ts` como `environment.ts` y `environment.prod.ts` (en este último poner `production: true`) y completar los datos de la app web de Firebase.
   - O copiar `.env.example` como `.env`, completarlo y ejecutar `npm run env`.
4. Levantar la app en el navegador:
   ```bash
   ionic serve
   ```

### Categorías

La app solo lee las categorías. Se crean desde la Consola de Firebase → Firestore → colección `categories`, un documento por categoría con el campo `name` (por ejemplo: Baches, Alumbrado público, Recolección de basura).

### Usuarios y roles

- Desde la app cualquiera se registra como **ciudadano**.
- Para convertir una cuenta en funcionario o administrador: Consola de Firebase → Firestore → `users/{uid}` → cambiar el campo `role` a `officer` o `admin`. Las reglas no permiten que un usuario se cambie el rol a sí mismo.

### Trabajar con los emuladores de Firebase

Para probar sin tocar el proyecto real:

```bash
firebase emulators:start --only auth,firestore --project demo-ciudadactiva
```

y poner `useEmulators: true` en `src/environments/environment.ts` (o `FIREBASE_USE_EMULATORS=true` en el `.env` y `npm run env`). La interfaz de los emuladores queda en http://localhost:4000.

## Comandos útiles

| Comando | Qué hace |
|---|---|
| `ionic serve` / `npm start` | Servidor de desarrollo |
| `npm run build` | Compilación de producción en `www/` |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run lint` | Revisión de estilo con ESLint |
| `firebase deploy --only firestore:rules,firestore:indexes --project <id>` | Publica las reglas e índices de Firestore |

## Estructura

```
src/app/
├── pages/        # pantallas
├── components/   # piezas reutilizables
├── services/     # acceso a Firebase y a la sesión local
├── models/       # interfaces y tipos
└── guards/       # protección de rutas por sesión y rol
docs/             # arquitectura, modelo de datos y diagramas
```

## Forma de trabajo

- `main`: versión estable, protegida. Solo recibe cambios desde `develop` por Pull Request.
- `develop`: integración del sprint.
- `feature/<descripcion>`: una rama por historia, creada desde `develop`. Se integra con un Pull Request revisado por otro integrante.

Al hacer push a `main`, el pipeline (`.github/workflows/deploy.yml`) instala dependencias, corre lint y pruebas, compila y publica la web en Firebase Hosting.

### Secretos del pipeline

Se configuran en GitHub → Settings → Secrets and variables → Actions:

| Secreto | Para qué |
|---|---|
| `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET`, `FIREBASE_MESSAGING_SENDER_ID`, `FIREBASE_APP_ID` | Generar los archivos de environment en la compilación |
| `FIREBASE_SERVICE_ACCOUNT` | Cuenta de servicio para desplegar en Hosting |

## Documentación

- [Arquitectura](docs/arquitectura.md)
- [Modelo de datos y diccionario](docs/modelo-datos.md)
- [Diagramas de la app y navegación](docs/diagramas-app.md)
- [Catálogo de operaciones de datos](docs/operaciones-datos.md)

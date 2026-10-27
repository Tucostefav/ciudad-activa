# CiudadActiva

**GovTech Istmo S.A.** — Reportes ciudadanos de incidencias urbanas.

Aplicación móvil para que los ciudadanos reporten incidencias de su ciudad (baches, alumbrado, basura, etc.) con foto y ubicación, y para que los funcionarios municipales les den seguimiento hasta resolverlas.

Proyecto de la asignatura **Desarrollo de Aplicaciones Móviles (EID 1022)**.

## Roles

| Rol | Qué puede hacer |
|---|---|
| Ciudadano | Crear reportes con foto y ubicación, ver sus reportes, leer comentarios y seguir su avance. |
| Funcionario municipal | Ver los reportes entrantes, cambiar su estado y responder con comentarios. |
| Administrador | Gestionar las categorías de incidencia y consultar indicadores de atención. |

Estados de un reporte: **Recibido → En revisión → En atención → Resuelto** (o **Rechazado**).

## Tecnologías

| Componente | Tecnología |
|---|---|
| App móvil | Ionic + Angular (modo Material Design) |
| Lenguaje | TypeScript |
| Empaquetado Android | Capacitor + Android Studio |
| Base de datos | PostgreSQL en Supabase |
| Autenticación | Firebase Authentication |
| Imágenes | Firebase Storage |
| Notificaciones | Firebase Cloud Messaging |
| Web | Firebase Hosting |
| Gestión | GitHub + Jira |

## Estructura del repositorio

```
ciudad-activa/
├── app/                # Proyecto Ionic + Angular
├── supabase/
│   ├── migrations/     # Scripts SQL de tablas, políticas y triggers
│   └── functions/      # Funciones en la nube (notificaciones)
├── .env.example        # Variables de entorno necesarias (sin valores reales)
└── README.md
```

## Ramas

- `main`: versión estable. Solo recibe cambios desde `develop` mediante Pull Request.
- `develop`: integración del sprint en curso.
- `feature/<clave-jira>-<descripcion>`: una rama por historia de usuario, creada desde `develop`.

Todo cambio entra por Pull Request y necesita la revisión de otro integrante del equipo.

## Instalación

> En construcción. Los pasos para levantar la app se irán agregando a medida que avance el proyecto.

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Tucostefav/ciudad-activa.git
   ```
2. Copiar `.env.example` a `.env` y completar las claves de Firebase y Supabase.

## Documentación

El manual de usuario, el manual técnico y los diagramas están en la [wiki del proyecto](https://github.com/Tucostefav/ciudad-activa/wiki).

# Portfolio de Tobías Mislej · etapa 02

Portfolio UX/UI construido con Astro y una API CRUD local. La interfaz pública se alimenta desde una base JSON, incluye una fila de proyectos con imágenes en transición, un archivo de trabajos y páginas de detalle. El panel `/admin` permite crear, ver, editar y eliminar contenido sin tocar el código.

## Funciones principales

- Panel local en `/admin` con navegación por categorías.
- CRUD completo para proyectos y experiencia laboral.
- Carga de portada, múltiples imágenes y documentos PDF.
- Formulario de experiencia con puesto, empresa, tipo, modalidad, período, responsabilidades, logros y habilidades.
- Gestión secundaria de skills, herramientas, servicios, certificados, educación, intereses, perfil y contacto.
- Fila horizontal de proyectos destacados con transición automática entre imágenes.
- Página `/trabajos` con todos los casos y ruta `/trabajos/[slug]` para cada proyecto.
- API pública filtrada en `/api/portfolio` y diagnóstico en `/api/health`.
- Escrituras atómicas para reducir el riesgo de corromper el JSON.
- Diseño responsive para notebook y celular, con estados de foco y reducción de movimiento.

## Ejecutar en local

Requiere Node.js 22 o superior.

```bash
npm install
npm run dev
```

Abrí las direcciones que muestra Astro:

```text
http://localhost:4321/             Portfolio
http://localhost:4321/trabajos     Archivo de proyectos
http://localhost:4321/admin        Panel de administración
http://localhost:4321/api/health   Estado de la API
```

## Persistencia local

Los datos se guardan en:

```text
data/portfolio.json
```

Los archivos cargados desde el panel se guardan en:

```text
public/uploads/images
public/uploads/pdfs
```

Las imágenes aceptadas son JPG, PNG, WebP, GIF y SVG, con un máximo de 8 MB por archivo. Los PDF admiten hasta 15 MB por archivo. Los archivos generados dentro de `public/uploads` están excluidos de Git para evitar publicar material privado o pesado por accidente.

## Rutas de la API

| Método | Ruta | Función |
|---|---|---|
| `GET` | `/api/health` | Estado y conteos principales |
| `GET` | `/api/portfolio` | Contenido público visible |
| `GET` / `POST` | `/api/projects` | Listar o crear proyectos |
| `GET` / `PUT` / `DELETE` | `/api/projects/:id` | Ver, editar o eliminar un proyecto |
| `GET` / `POST` | `/api/experiences` | Listar o crear experiencias |
| `GET` / `PUT` / `DELETE` | `/api/experiences/:id` | Ver, editar o eliminar una experiencia |
| `GET` / `POST` | `/api/content/:section` | Listar o crear contenido secundario |
| `GET` / `PUT` / `DELETE` | `/api/content/:section/:id` | Gestionar un dato secundario |
| `GET` / `PUT` | `/api/profile` | Ver o actualizar el perfil |
| `GET` / `PUT` | `/api/contact` | Ver o actualizar el contacto |

Las secciones secundarias válidas son `skills`, `tools`, `services`, `certifications`, `education` e `interests`.

## Clave de administración

En desarrollo local las escrituras funcionan sin clave. Podés probar el mismo control de acceso creando un archivo `.env` basado en `.env.example`:

```text
PORTFOLIO_ADMIN_KEY=una-clave-larga-y-segura
```

Después, abrí **Clave API** dentro de `/admin` e ingresá el mismo valor. La clave se conserva solamente en `sessionStorage` durante la sesión actual del navegador.

## Importante para Vercel

La lectura del portfolio funciona al desplegar esta etapa, pero el sistema de escritura está diseñado para desarrollo local. El filesystem de una función de Vercel no es una base persistente: un cambio puede fallar o desaparecer al reiniciar o volver a desplegar.

Para una futura etapa productiva, reemplazá:

- `data/portfolio.json` por una base persistente como PostgreSQL, Turso, Neon o Vercel Postgres.
- `public/uploads` por un almacenamiento de objetos como Vercel Blob, Cloudflare R2 o S3.
- La clave compartida por autenticación real con sesiones y roles.

No publiques `/admin` como herramienta de edición hasta completar esa migración.

## Verificar y compilar

```bash
npm run check
npm run build
```

El proyecto usa salida de servidor y el adaptador oficial para Vercel. La compilación genera `dist/` y `.vercel/output/`.

## Documentación adicional

La arquitectura, las decisiones y el flujo de datos están explicados en [ETAPA_02_API.md](./ETAPA_02_API.md) y [ESTRUCTURA.md](./ESTRUCTURA.md).

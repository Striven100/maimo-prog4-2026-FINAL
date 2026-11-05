# Portfolio de Tobías Mislej · etapa 03

Portfolio UX/UI construido con Astro, una API CRUD y una dirección visual editorial. La portada concentra toda la información, presenta los proyectos como casos interactivos y abre sus detalles en ventanas superpuestas. El panel privado `/admin` permite crear, ver, editar, ordenar y eliminar contenido sin tocar el código, tanto en local como desde el sitio publicado en Vercel.

## Funciones principales

- Experiencia visual de etapa 03 con transiciones, revelado progresivo, indicador de lectura y navegación activa.
- Casos de proyecto en ventanas accesibles, con navegación por teclado, galerías manuales y enlaces profundos.
- Panel privado en `/admin` con navegación por categorías y edición de la narrativa general de la página.
- CRUD completo para proyectos y experiencia laboral.
- Carga de portada, múltiples imágenes y documentos PDF, con reordenamiento, edición de textos alternativos y eliminación de archivos existentes.
- Formulario de experiencia con puesto, empresa, tipo, modalidad, período, responsabilidades, logros y habilidades.
- Gestión secundaria de skills, herramientas, servicios, certificados, educación, intereses, perfil, retrato y contacto.
- Fila horizontal de proyectos destacados con transición automática entre imágenes.
- Página `/trabajos` con todos los casos y ruta `/trabajos/[slug]` para cada proyecto.
- API pública filtrada en `/api/portfolio` y diagnóstico en `/api/health`.
- Escrituras atómicas para reducir el riesgo de corromper el JSON.
- Persistencia productiva de datos, imágenes y PDF mediante Vercel Blob.
- Sesión de administración protegida por una cookie `HttpOnly`, `SameSite=Strict` y firmada con la clave privada.
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

Las imágenes aceptadas son JPG, PNG, WebP, GIF y SVG. Imágenes y PDF admiten hasta 4 MB por archivo. Los archivos generados dentro de `public/uploads` están excluidos de Git para evitar publicar material privado o pesado por accidente.

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
| `GET` / `PUT` | `/api/site` | Ver o actualizar títulos y narrativa global |

Las secciones secundarias válidas son `skills`, `tools`, `services`, `certifications`, `education` e `interests`.

## Administración en local

En desarrollo local las escrituras funcionan sin clave. Podés probar el mismo acceso protegido creando un archivo `.env` basado en `.env.example`:

```text
PORTFOLIO_ADMIN_KEY=una-clave-larga-y-segura
```

Después abrí `/admin`, ingresá la clave y usá el panel normalmente. La clave se envía una sola vez para crear una sesión; no se guarda en el código ni queda disponible para JavaScript.

## Habilitar la edición desde Vercel

Vercel no permite conservar cambios en el filesystem de una función. Por eso, en producción la API guarda la base, las imágenes y los PDF en un almacenamiento Blob conectado al proyecto.

Configuración única:

1. En el proyecto correcto de Vercel, abrí **Storage** y creá un almacenamiento **Blob público**.
2. Conectalo a los entornos donde quieras editar: como mínimo **Production**; también **Preview** si lo necesitás.
3. En **Settings → Environment Variables**, agregá `PORTFOLIO_ADMIN_KEY` con una clave larga y privada para esos mismos entornos.
4. Volvé a desplegar el proyecto para que el despliegue reciba las variables.
5. Abrí `https://tu-dominio.vercel.app/admin`, iniciá sesión y entrá en **Proyectos → + Nuevo**.

El primer cambio crea automáticamente `portfolio-data/portfolio.json` en Blob a partir de los datos incluidos en el despliegue. Las cargas quedan en `uploads/images` y `uploads/pdfs`. El portfolio público refleja los cambios sin modificar GitHub ni volver a desplegar.

> El almacenamiento debe ser público porque sus imágenes y PDF se muestran directamente en el portfolio. La administración y las rutas CRUD siguen protegidas por la sesión privada.

## Verificar y compilar

```bash
npm run check
npm run build
```

El proyecto usa salida de servidor y el adaptador oficial para Vercel. La compilación genera `dist/` y `.vercel/output/`.

## Documentación adicional

La arquitectura, las decisiones y el flujo de datos están explicados en [ETAPA_03_EXPERIENCIA.md](./ETAPA_03_EXPERIENCIA.md), [ETAPA_02_API.md](./ETAPA_02_API.md) y [ESTRUCTURA.md](./ESTRUCTURA.md).

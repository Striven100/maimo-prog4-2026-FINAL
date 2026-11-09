# Guía breve para la defensa

## Recorrido recomendado

1. Explicar el problema: convertir un portfolio de Notion fragmentado en una experiencia propia, clara y administrable.
2. Mostrar la portada y el concepto “ordenar decisiones”.
3. Filtrar proyectos y abrir NARA+, ABASTO o FRECUENCIA.
4. Alternar celular/notebook y desplazarse dentro del caso.
5. Abrir una ventana personal y una experiencia.
6. Mostrar `/trabajos` y una ruta individual.
7. Entrar a `/admin` y editar un dato pequeño.
8. Abrir `/api/health` y explicar la fuente dinámica.

## Arquitectura en una frase

Astro renderiza la interfaz; los componentes reutilizan una misma base de datos; las rutas API normalizan y validan formularios; el repositorio coordina lecturas y escrituras; el servicio de almacenamiento usa JSON local o Vercel Blob según el entorno.

## Flujo de datos

```text
data/portfolio.json o Vercel Blob
              ↓
portfolio.repository.js
              ↓
 páginas Astro / rutas API
              ↓
 portada, archivo, casos y editor
```

## Archivos que conviene conocer

- `src/pages/index.astro`: composición de la portada.
- `src/components/ProjectDialog.astro`: detalle emergente del proyecto.
- `src/components/CaseStudyPreview.astro`: selector celular/notebook.
- `src/components/InfoDialog.astro`: ventanas personales reutilizables.
- `src/scripts/page.js`: interacciones del sitio público.
- `src/scripts/admin.js`: formularios y estados del editor.
- `src/server/portfolio.repository.js`: operaciones de contenido.
- `src/server/storage.service.js`: JSON, Blob y migración.
- `data/portfolio.json`: estructura de todos los datos.

## Cambios simples para demostrar dominio

### Cambiar el texto principal

Editar `site.heroLine` y `site.heroAccent` desde `/admin → Página` o en `data/portfolio.json`.

### Cambiar el color de un proyecto

Editar `accent` desde el formulario del proyecto. El valor se reutiliza en tarjeta, diálogo, página y visor.

### Agregar una especialidad al filtro

Añadir una etiqueta al proyecto y sumar su clave en `tagFilters` dentro de `index.astro`.

### Modificar la velocidad de la galería

Cambiar `3600` en `src/scripts/page.js`; representa milisegundos entre imágenes.

### Desactivar una animación

El bloque `@media (prefers-reduced-motion: reduce)` de `global.css` muestra cómo se eliminan animaciones sin romper la interfaz.

## Preguntas probables

### ¿Por qué Astro?

Porque el portfolio es principalmente contenido y navegación. Astro entrega HTML semántico, permite componentes y añade JavaScript sólo a interacciones concretas.

### ¿La API es externa?

La consigna acepta API externa o fuente dinámica. En producción los datos viven en Vercel Blob y se acceden mediante rutas API del sitio; en local se usa el mismo esquema JSON.

### ¿Qué interacción es significativa?

Los filtros cambian el conjunto visible, los diálogos cambian la profundidad de lectura, el selector cambia el dispositivo representado y el editor cambia el contenido persistente.

### ¿Cómo se evita perder cambios?

Blob conserva los datos fuera del despliegue y `etag` detecta ediciones concurrentes. Las escrituras locales son atómicas.

### ¿Qué pasa sin JavaScript?

La información principal, el archivo y las páginas individuales siguen renderizadas como HTML. Los filtros, diálogos enriquecidos y galerías requieren JavaScript.

## Comandos de verificación

```bash
npm run validate:content
npm run check
npm run build
```

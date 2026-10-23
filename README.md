# Portfolio base en Astro

Estructura inicial y responsive de un portfolio. El proyecto no contiene información personal, casos de estudio, imágenes, documentos ni integraciones: solamente páginas, categorías y espacios preparados para completar.

## Páginas disponibles

- `/` — inicio y mapa del sitio.
- `/sobre-mi` — presentación, enfoque, habilidades y herramientas.
- `/proyectos` — índice general de categorías.
- `/proyectos/ux-ui` — plantilla para casos de UX/UI.
- `/proyectos/branding` — plantilla para casos de identidad de marca.
- `/proyectos/desarrollo-web` — plantilla para productos web.
- `/experiencia` — línea de tiempo profesional.
- `/formacion` — estudios, cursos y certificaciones.
- `/contacto` — vías de contacto.
- `/404` — página de error.

## Ejecutar en local

```bash
npm install
npm run dev
```

Astro mostrará la URL local en la terminal, normalmente `http://localhost:4321`.

## Verificar y compilar

```bash
npm run check
npm run build
```

La compilación estática se genera en `dist/` y puede desplegarse directamente en Vercel.

## Cómo completar la base

1. Cambiar la marca temporal del encabezado en `src/components/SiteHeader.astro`.
2. Reemplazar los textos de orientación en cada archivo de `src/pages/`.
3. Añadir o modificar categorías en `src/config/navigation.js`.
4. Incorporar recursos visuales únicamente cuando estén definidos los casos de estudio.


# Etapa 01 — Bases del portfolio

Primera versión estructural de un portfolio desarrollado con AstroJS. No contiene información personal, casos reales, estudios ni experiencias: define navegación, jerarquía, componentes, front modular y un back mínimo para que las siguientes etapas puedan incorporar contenido sin rehacer la arquitectura.

## Ejecutar

```bash
npm install
npm run dev
```

Compilar para producción:

```bash
npm run build
```

## Rutas

- `/`: portada y mapa de contenido.
- `/proyectos`: archivo de placeholders con filtro funcional.
- `/perfil`: estructura para síntesis, experiencia, estudios y herramientas.
- `/contacto`: formulario estructural sin envío.
- `/api/portfolio.json`: fuente dinámica vacía por diseño.
- `/api/portfolio.json?state=error`: error controlado para probar la interfaz.

## Arquitectura front / back

### Front

`src/scripts/page.js` es el único punto de entrada del navegador. Importa módulos transversales y el controlador correspondiente a cada página:

- `core/navigation.js`: menú adaptable.
- `core/api-status.js`: carga, contenido vacío, error y reintento.
- `pages/home.js`: cambio entre vista mapa e índice.
- `pages/projects.js`: filtros y contador anunciado.
- `pages/profile.js`: inicialización de la estructura de perfil.
- `pages/contact.js`: estado de respuesta sin enviar datos.

### Back

- `server/portfolio.repository.js`: fuente vacía y contrato estructural.
- `server/portfolio.service.js`: prepara la respuesta pública.
- `pages/api/portfolio.json.js`: endpoint server-side de Astro.

## Componentes propios

1. `SiteHeader`: navegación y estado activo.
2. `PageIntro`: jerarquía común para las cuatro rutas.
3. `PlaceholderCard`: unidad estructural reutilizable.
4. `ApiStatus`: estado de la fuente dinámica.
5. `SiteFooter`: navegación secundaria y cierre.

## Relación con la consigna

- AstroJS y adaptador Vercel.
- Más de tres componentes relevantes.
- Navegación entre cuatro rutas.
- Interacción significativa: vista mapa/listado y filtro del archivo.
- Fuente dinámica propia con carga, vacío, error y reintento.
- Composición responsive, no solo reducción de escala.
- Semántica, enlace de salto, foco visible, `aria-current`, `aria-expanded` y `aria-live`.

Esta etapa no intenta resolver todavía identidad final ni contenido profesional. Es evidencia del comienzo del proceso. Las imágenes, casos, biografía y dirección visual se incorporan en versiones posteriores.

## Deploy en Vercel

Importar el repositorio y usar esta carpeta como **Root Directory**. Vercel detecta Astro; el comando es `npm run build`. Reemplazar la URL de ejemplo en `astro.config.mjs` al recibir el dominio.

## Uso de IA

Se utilizó IA como apoyo para organizar la arquitectura inicial, generar una primera implementación y documentar decisiones. El código debe revisarse, comprenderse y adaptarse antes de la defensa. No se generó ni atribuyó contenido profesional.

## Límites de esta versión

- La API está vacía intencionalmente.
- El formulario no transmite datos.
- No hay recursos multimedia ni contenido definitivo.
- El diseño funciona como wireframe técnico y no como identidad final.

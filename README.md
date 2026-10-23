# Portfolio de Tobías Mislej

Portfolio de UX/UI y diseño multimedia desarrollado con Astro. Toda la información principal se presenta en una sola página y los casos de estudio se abren en paneles emergentes, sin cambiar de ruta.

## Estructura de la página

- **Inicio:** presentación, ubicación, disponibilidad y accesos de contacto.
- **Proyectos:** UMBRAL, Brasa Alta, TRAZA y NARA+, con filtros por categoría.
- **Capacidades:** servicios, habilidades y herramientas.
- **Experiencia:** roles profesionales y proyectos aplicados.
- **Formación:** educación, certificaciones e intereses.
- **Contacto:** correo, LinkedIn y teléfono.

Cada proyecto abre un diálogo accesible con descripción, desafío, enfoque, resultado, herramientas y paleta visual. Los paneles se cierran con el botón correspondiente, la tecla `Esc` o un clic fuera de su contenido.

## Editar contenido

La información está centralizada en:

```text
src/data/portfolio.js
```

Los componentes principales son:

```text
src/components/Icon.astro
src/components/ProjectArtwork.astro
src/components/ProjectDialog.astro
```

La interacción de filtros, navegación y modales está en:

```text
src/scripts/page.js
```

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

La salida estática se genera en `dist/` y puede desplegarse directamente en Vercel.


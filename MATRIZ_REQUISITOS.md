# Matriz de requisitos · Examen Final

Esta matriz vincula cada punto de la consigna con una evidencia concreta del proyecto.

| Requisito | Implementación | Evidencia |
|---|---|---|
| AstroJS | Proyecto Astro 5 con salida de servidor | `astro.config.mjs`, `package.json` |
| Ejecutable desde README | Instalación, desarrollo, validación y build documentados | `README.md` |
| Responsive significativo | Navegación móvil, reflujo de grillas, controles táctiles y casos celular/notebook | `global.css`, `CaseStudyPreview.astro` |
| Tres componentes propios | Hay seis componentes con responsabilidades diferenciadas | `src/components/`, tabla del README |
| Navegación clara | Barra fija, menú móvil, secciones activas, archivo y páginas por slug | `index.astro`, `/trabajos` |
| Interacción relevante | Filtros que cambian el contenido, diálogos con información y selector de vista responsive | `page.js` |
| Fuente dinámica | JSON local en desarrollo y Vercel Blob en producción | `storage.service.js` |
| Estados pertinentes | Selección, carga, vacío, error, autenticación, navegación y disponibilidad | Portada, `/admin`, API |
| Despliegue accesible | Proyecto conectado a Vercel | URL declarada en la entrega |
| Repositorio e historial | Etapas 01, 02, 03 y 04 en commits separados | Historial de `main` |
| README suficiente | Propuesta, público, comandos, decisiones, componentes, API, accesibilidad, límites y créditos | `README.md` |
| Evidencia de proceso | Problema, alternativas, evolución, pruebas, dificultades y pendientes | `PROCESO.md` |
| Uso de IA documentado | Tareas, adaptaciones, descartes, límites y decisiones propias | `PROCESO.md` |
| Defensa individual | Recorrido de arquitectura y cambios rápidos explicados | `GUIA_DEFENSA.md` |

## Aspectos de evaluación

### Identidad y concepto

La identidad editorial común permite reconocer el portfolio, mientras cada proyecto conserva un acento y lenguaje propio. El concepto central es “ordenar decisiones”: se aplica al discurso personal, a la arquitectura y a la forma de presentar casos.

### Creatividad y experiencia

La experiencia evita una sucesión genérica de tarjetas. Combina portada editorial, rail horizontal, diálogos profundos, páginas largas, filtros, archivo y visualización responsive de casos.

### Arquitectura y código

Presentación, componentes, scripts, API, normalización, repositorio y almacenamiento están separados. El contenido no está duplicado entre portada, archivo, páginas de caso y editor.

### Integración e interacción

La API CRUD y Blob permiten cambiar el contenido publicado sin redeploy. Las interacciones alteran información, selección, navegación o modo de lectura; no son sólo animaciones decorativas.

### Responsive y accesibilidad

Se utilizan elementos nativos, ARIA sólo donde aporta, foco restaurado, textos alternativos, reducción de movimiento y breakpoints con cambios de composición.

# Portfolio de Tobías Mislej · entrega final

Portfolio web personal e interactivo construido con Astro. La propuesta reúne en una sola portada el perfil profesional, las capacidades, la experiencia, la formación y una selección de casos UX/UI. Los detalles se abren en ventanas accesibles y cada proyecto también tiene una página propia.

El público principal son equipos de producto, estudios, recruiters y personas interesadas en contratar o colaborar con un perfil UX/UI y multimedia junior.

## Propuesta y experiencia

- Dirección visual editorial basada en grilla, contraste tipográfico y acentos por proyecto.
- Seis casos seleccionados, filtros por especialidad y archivo completo en `/trabajos`.
- Diálogos de proyecto con desafío, proceso, resultado, rol, herramientas, entregables y recursos.
- Casos NARA+, ABASTO y FRECUENCIA con páginas completas para celular y notebook, selector responsive, desplazamiento interno y PDF descargable.
- Dossier personal con perfil, método, trayectoria e intereses.
- Detalle emergente para cada experiencia laboral.
- Animaciones de entrada y salida, galerías, indicador de lectura y navegación activa; todo respeta `prefers-reduced-motion`.
- Panel privado en `/admin` para crear, editar, ordenar, ocultar y eliminar el contenido sin modificar código.

## Tecnología y decisiones

| Capa | Implementación | Decisión |
|---|---|---|
| Framework | Astro 5, salida `server` | HTML semántico y componentes simples con JavaScript sólo donde aporta interacción. |
| Hosting | Vercel + adaptador oficial | Despliegue continuo desde `main` y funciones para la API. |
| Datos | JSON local / Vercel Blob | El mismo repositorio funciona sin servicios externos en local y conserva cambios en producción. |
| API | Rutas Astro REST | Separa presentación, normalización, persistencia y respuestas HTTP. |
| UI | CSS propio | Identidad específica sin biblioteca de componentes ni plantilla visual. |
| Archivos | Vercel Blob o `public/uploads` | Galerías y PDF administrables desde el editor. |

La portada es deliberadamente de una sola página para ofrecer una lectura rápida. Los diálogos añaden profundidad sin perder el contexto y las rutas `/trabajos/[slug]` permiten compartir cada caso directamente.

## Componentes propios relevantes

| Componente | Responsabilidad |
|---|---|
| `ProjectGallery.astro` | Galería automática/manual, contador, carga diferida y alternativa sin imágenes. |
| `ProjectDialog.astro` | Ventana accesible con la historia y los recursos del caso. |
| `CaseStudyPreview.astro` | Selector por pestañas entre celular/notebook y recorrido de páginas extensas. |
| `InfoDialog.astro` | Ventanas reutilizables para perfil, método, trayectoria, intereses y experiencia. |
| `ProjectArtwork.astro` | Portadas generativas para proyectos sin archivos visuales. |
| `Icon.astro` | Sistema de iconografía SVG coherente y liviano. |

## Fuente dinámica y API

En local, la fuente es `data/portfolio.json`. En Vercel, la misma estructura se guarda en un Blob público y se consulta sin caché para mostrar las ediciones. La etapa final incluye una migración no destructiva: añade los casos nuevos y sus recursos a una base de etapa 03 sin reemplazar textos personales editados por el usuario.

La API pública está en `/api/portfolio`; `/api/health` informa etapa, almacenamiento y conteos. Las mutaciones requieren una sesión de administración firmada.

| Método | Ruta | Función |
|---|---|---|
| `GET` | `/api/health` | Diagnóstico de API y fuente dinámica. |
| `GET` | `/api/portfolio` | Contenido público visible. |
| `GET` / `POST` | `/api/projects` | Listar o crear proyectos. |
| `GET` / `PUT` / `DELETE` | `/api/projects/:id` | Ver, editar o eliminar un proyecto. |
| `GET` / `POST` | `/api/experiences` | Listar o crear experiencias. |
| `GET` / `PUT` / `DELETE` | `/api/experiences/:id` | Gestionar una experiencia. |
| `GET` / `POST` | `/api/content/:section` | Listar o crear datos secundarios. |
| `GET` / `PUT` / `DELETE` | `/api/content/:section/:id` | Gestionar un dato secundario. |
| `GET` / `PUT` | `/api/profile`, `/api/contact`, `/api/site` | Actualizar datos únicos y narrativa. |

Las categorías secundarias son `skills`, `tools`, `services`, `certifications`, `education` e `interests`.

### Errores y límites

- La API devuelve JSON con estado HTTP y un mensaje legible cuando faltan datos, la sesión expiró o la fuente no está disponible.
- Las escrituras usan `etag` para evitar que dos sesiones sobrescriban cambios sin advertencia.
- Imágenes: JPG, PNG, WebP, GIF o SVG. Documentos: PDF. Máximo 4 MB por archivo cargado desde el editor.
- En Vercel, si Blob no está conectado, el sitio puede leer la base incluida pero bloquea escrituras con un error `503` explícito.
- El JSON se escribe de forma atómica en local para reducir el riesgo de corrupción.

## Estados de interfaz

| Estado | Evidencia |
|---|---|
| Selección | Filtros de proyectos, pestañas celular/notebook y navegación activa. |
| Carga | Botones del editor usan `aria-busy`, se deshabilitan y cambian su etiqueta. |
| Disponible | Indicador de disponibilidad y diagnóstico `/api/health`. |
| Vacío | Mensaje de filtro sin resultados y listas administrables sin registros. |
| Error | Toast del editor y respuestas API con mensajes accionables. |
| Autenticación | Login, sesión válida y redirección cuando la sesión falta o vence. |
| Navegación | Deep links de diálogos, archivo y rutas individuales por slug. |

## Ejecutar en local

Requiere Node.js 22 o superior.

```bash
npm install
npm run dev
```

Direcciones principales:

```text
http://localhost:4321/             Portfolio
http://localhost:4321/trabajos     Archivo
http://localhost:4321/admin        Editor
http://localhost:4321/api/health   Diagnóstico
```

Para probar el acceso protegido, crear `.env` desde `.env.example`:

```text
PORTFOLIO_ADMIN_KEY=una-clave-larga-y-privada
```

No se debe versionar `.env` ni exponer la clave en el cliente.

## Validar y compilar

```bash
npm run validate:content
npm run check
npm run build
```

O ejecutar toda la verificación:

```bash
npm run verify
```

`validate:content` detecta identificadores o slugs repetidos, campos esenciales ausentes y recursos locales inexistentes.

## Responsive y accesibilidad

- Reflujo real de grillas y navegación móvil; las páginas no se limitan a reducir escala.
- HTML semántico, enlace para saltar al contenido y jerarquía de títulos.
- Diálogos nativos con retorno de foco, cierre por fondo, botón o `Escape` y enlace profundo por hash.
- Pestañas con roles ARIA y navegación por flechas, `Home` y `End`.
- Foco visible, contraste controlado, textos alternativos y controles táctiles de al menos 44 px.
- Imágenes diferidas y PDF como recurso opcional.
- Animaciones desactivables mediante `prefers-reduced-motion`.

## Limitaciones y mejoras futuras

- No hay recuperación automática de la clave de administración; se gestiona desde variables de entorno.
- Vercel Blob público es apropiado para material de portfolio, no para documentos privados.
- El editor no genera miniaturas: conviene subir imágenes ya optimizadas.
- Como mejora futura se puede agregar analítica respetuosa de privacidad, traducción al inglés y pruebas automatizadas de navegador.

## Créditos y licencias

- Código y dirección visual: Tobías Mislej, con asistencia técnica documentada en [PROCESO.md](./PROCESO.md).
- Framework: [Astro](https://astro.build/) y adaptador oficial de Vercel, bajo sus licencias de código abierto.
- Persistencia: [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).
- Tipografías: familias de sistema; no se redistribuyen archivos tipográficos.
- Los casos NARA+, ABASTO y FRECUENCIA son proyectos conceptuales. Las cifras, nombres y escenas que aparecen dentro de esas interfaces son contenido ficticio de demostración, no afirmaciones sobre organizaciones reales.

## Documentación de entrega

- [MATRIZ_REQUISITOS.md](./MATRIZ_REQUISITOS.md): correspondencia exacta con la consigna.
- [PROCESO.md](./PROCESO.md): problema, alternativas, evolución, pruebas, dificultades y uso de IA.
- [GUIA_DEFENSA.md](./GUIA_DEFENSA.md): arquitectura explicada y cambios simples para demostrar dominio.
- [ETAPA_03_EXPERIENCIA.md](./ETAPA_03_EXPERIENCIA.md), [ETAPA_02_API.md](./ETAPA_02_API.md) y [ESTRUCTURA.md](./ESTRUCTURA.md): evolución técnica previa.

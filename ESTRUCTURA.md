# Arquitectura del portfolio

## Capas

1. **Presentación pública.** La portada reúne toda la información esencial, aplica una narrativa editorial y revela el contenido de forma progresiva. Los proyectos destacados se filtran, abren en diálogos y alternan sus imágenes automáticamente.
2. **Archivo de trabajos.** `/trabajos` muestra todos los proyectos visibles y `/trabajos/[slug]` desarrolla cada caso.
3. **Administración.** `/admin` presenta formularios y listados para gestionar la narrativa, el perfil, todas las categorías y los archivos sin editar código.
4. **API.** Las rutas de `src/pages/api` validan solicitudes, archivos y permisos.
5. **Dominio y persistencia.** `src/server` normaliza los datos y usa JSON local en desarrollo o Vercel Blob en producción.

## Flujo de datos

```mermaid
flowchart LR
  A[Panel admin] --> B[API Astro]
  B --> C[Validación y sesión]
  C --> D[JSON local]
  C --> E[Vercel Blob]
  D --> F[Portfolio público]
  E --> F
```

## Carpetas principales

```text
data/
  portfolio.json
public/
  demo/
  uploads/
src/
  components/
  layouts/
  pages/
    admin.astro
    api/
    trabajos/
  scripts/
    admin.js
    page.js
  server/
    http.js
    portfolio.repository.js
    record.normalizers.js
    storage.service.js
    upload.service.js
  styles/
```

## Accesibilidad e interacción

- HTML semántico, encabezados jerárquicos y enlace para saltar al contenido.
- Diálogos nativos con cierre mediante botón, fondo o tecla `Esc`.
- Enlaces profundos a cada diálogo mediante el hash de la URL y navegación de galería con flechas del teclado.
- Restauración del foco al cerrar un caso.
- Formularios con etiquetas visibles, errores legibles y estados de carga.
- Descripciones alternativas para cada imagen de proyecto.
- Transiciones desactivadas cuando el sistema solicita movimiento reducido.
- Navegación y panel responsive para notebook y celular.

## Modelo editorial de la etapa 03

El objeto `site` de `data/portfolio.json` concentra títulos, especialidades, textos introductorios y el llamado a contacto. El perfil conserva la identidad personal y el retrato; cada proyecto agrega año, color de acento, entregables y estado ordenado de su galería y documentos. Esta separación permite cambiar la voz del portfolio sin modificar los componentes.

## Seguridad y límites

En desarrollo se puede escribir sin clave; en producción se exige `PORTFOLIO_ADMIN_KEY` y una sesión firmada. La base y las cargas se guardan en Vercel Blob para sobrevivir despliegues y reinicios. Cada archivo puede pesar hasta 4 MB.
